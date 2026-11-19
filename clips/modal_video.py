"""Pilgrim's Progress: clips on Modal's monthly credits (Wan 2.2 image-to-video, the same Lightning model the free
Hugging Face Space uses, so the clips match).

Run by GitHub Actions (.github/workflows/clips-modal.yml on main), never by hand: the workflow holds the Modal
token in the repository's secrets. "setup" fetches the model into Modal's storage (on CPU) and deploys this app;
"run" makes the next clips in clips/queue.json through clips/modal_run.py.

Cost guards here: one GPU at most (max_containers=1), every clip cut off after 10 minutes, the GPU shut down a
minute after the last clip, nothing kept warm. clips/modal_run.py adds a monthly cap (clips/modal-spend.json).
"""
import modal

MODEL = "TestOrganizationPleaseIgnore/WAMU_v2_WAN2.2_I2V_LIGHTNING"
GPU = "A100-80GB"
image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("ffmpeg")
    .pip_install(
        "torch==2.6.0", "diffusers==0.35.2", "transformers==4.56.2", "accelerate==1.10.1", "ftfy", "sentencepiece",
        "imageio==2.37.0", "imageio-ffmpeg==0.6.0", "pillow", "numpy<2.3", "huggingface_hub[hf_transfer]==0.35.3",
    )
    .env({"HF_HOME": "/weights", "HF_HUB_ENABLE_HF_TRANSFER": "1", "TOKENIZERS_PARALLELISM": "false"})
)
app = modal.App("pp-video", image=image)
weights = modal.Volume.from_name("pp-weights", create_if_missing=True)


@app.function(volumes={"/weights": weights}, timeout=3600)
def download():
    """Fetch the model once into the volume (runs on CPU: cheap)."""
    from huggingface_hub import snapshot_download
    snapshot_download(MODEL)
    weights.commit()
    return "model stored"


@app.cls(gpu=GPU, memory=98304, volumes={"/weights": weights}, timeout=600, scaledown_window=60, max_containers=1)
class Video:
    @modal.enter()
    def load(self):
        import torch
        from diffusers.pipelines.wan.pipeline_wan_i2v import WanImageToVideoPipeline
        self.pipe = WanImageToVideoPipeline.from_pretrained(MODEL, torch_dtype=torch.bfloat16)
        self.pipe.enable_model_cpu_offload()

    @modal.method()
    def make(self, body: dict) -> bytes:
        import io, tempfile
        import numpy as np, torch
        from PIL import Image
        from diffusers.utils.export_utils import export_to_video

        def pic(b):
            return Image.open(io.BytesIO(b)).convert("RGB") if b else None

        first, last = pic(body["first"]), pic(body.get("last"))
        # the Space's own sizing: the long side 832, both sides multiples of 16
        w, h = first.size
        if w >= h:
            W, H = 832, max(480, int(round(832 * h / w / 16)) * 16)
        else:
            H, W = 832, max(480, int(round(832 * w / h / 16)) * 16)
        first = first.resize((W, H), Image.LANCZOS)
        if last:
            last = last.resize((W, H), Image.LANCZOS)
        frames = 1 + int(np.clip(round(float(body.get("seconds", 3.5)) * 16), 8, 160))
        frames = (frames - 1) // 4 * 4 + 1
        out = self.pipe(
            image=first, last_image=last, prompt=body.get("prompt", ""), negative_prompt=body.get("negative", ""),
            height=H, width=W, num_frames=frames, guidance_scale=1.0, guidance_scale_2=1.0,
            num_inference_steps=int(body.get("steps", 6)),
            generator=torch.Generator(device="cuda").manual_seed(int(body.get("seed", 42))), output_type="np",
        ).frames[0]
        with tempfile.NamedTemporaryFile(suffix=".mp4") as f:
            export_to_video(list(out), f.name, fps=16)
            return open(f.name, "rb").read()
