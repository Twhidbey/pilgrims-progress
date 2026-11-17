# Free clips (the `clips` branch)

This branch holds only the clip queue, its runner and the clips it makes. It is never merged into `main`
(pushing `main` republishes the game). Nothing here is in the game until the owner chooses a clip and it is
cut into game frames on `main`.

- `queue.json`: the jobs, in order. Each has an `id`, `uses` (every level it can serve), a `first` picture and
  sometimes a `last` one, `prompt`, `seconds`, and `status` (`todo`, `done`, `failed`).
- `run.py`: makes the next jobs on the free Hugging Face Space `r3gm/wan2-2-fp8da-aoti-preview` (Wan 2.2
  image-to-video on ZeroGPU). The owner's read token is a network secret of the `pilgrims-progress` cloud
  environment, added by the proxy; it is not in any file or variable. Free: about 5 to 8 clips a day.
- `out/`: `<id>.mp4`, `<id>-sheet.jpg` (eight frames), and the first/last pictures given to the model.
- `log.md`: one line per attempt.

## The daily run (what the scheduled session does)

    git fetch origin main clips
    git checkout clips                    # or: git checkout -B clips origin/clips
    pip install -q gradio_client opencv-python-headless
    python3 clips/run.py 8                # stops by itself when the day's free GPU is used up
    git add clips && git commit -m "Clips: <date>" && git push origin clips

Then write a short report: which clips were made (with their sheets), which failed and why, how many remain.
Do not touch `main`. Do not spend money: this Space is free; if it is gone or refuses, report it and stop.

## Adding a job

Copy one and change it. A picture is `{"src": "assets/<name>.webp" | "pack:<name>:<frame>", "flip": bool,
"h": height of 720, "x": feet centre of 1280}`, or a living part of a room: `{"src": "assets/room4.webp",
"crop": [x0, y0, x1, y1]}` in the asset's pixels, about 16:9. The house's room figures (`room-*.webp`) face
LEFT in their files: flip them to face right. Every other figure faces right. Follow the game's rules in the
prompt: flat side view, both feet on one line, camera still, slow (see `CLAUDE.md` on `main`).
