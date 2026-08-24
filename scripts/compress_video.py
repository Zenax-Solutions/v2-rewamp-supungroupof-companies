import os
import sys
import argparse
import subprocess
import imageio_ffmpeg

def compress_video(
    input_path="src/assets/SUPUN GROUP OF COMPANY.mp4",
    output_path="public/videos/hero-background.mp4",
    target_height=720,
    fps=25,
    crf=30,
    duration=None
):
    """
    Compress and optimize video for web background streaming:
    - Strips audio (-an)
    - Downsamples framerate to web standard 25 fps
    - Applies H.264 high compression (libx264)
    - Adds web streaming metadata header to start playing instantly (-movflags +faststart)
    """
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    if not os.path.exists(input_path):
        print(f"Error: Input file '{input_path}' not found.")
        return

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    initial_size_mb = os.path.getsize(input_path) / (1024 * 1024)
    
    print("=" * 60)
    print(" WEB VIDEO COMPRESSION")
    print("=" * 60)
    print(f"Input File:        {input_path} ({initial_size_mb:.2f} MB)")
    print(f"Output File:       {output_path}")
    print(f"Max Height:        {target_height}p")
    print(f"Target FPS:        {fps} fps")
    print(f"CRF Quality:       {crf} (Higher = smaller file)")
    if duration:
        print(f"Duration Limit:    {duration} seconds")
    print("=" * 60)

    cmd = [
        ffmpeg_exe,
        "-y",
        "-i", input_path,
        "-c:v", "libx264",
        "-crf", str(crf),
        "-preset", "slow",
        "-r", str(fps),
        "-vf", f"scale=-2:min({target_height}\\,ih)",
        "-an",
        "-movflags", "+faststart",
        "-pix_fmt", "yuv420p"
    ]

    if duration:
        cmd.extend(["-t", str(duration)])

    cmd.append(output_path)

    print("\nCompressing... Please wait...")
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    if result.returncode == 0:
        new_size_mb = os.path.getsize(output_path) / (1024 * 1024)
        reduction = ((initial_size_mb - new_size_mb) / initial_size_mb) * 100
        print("\n Compression Completed Successfully!")
        print(f"• Original Size:   {initial_size_mb:.2f} MB")
        print(f"• Compressed Size: {new_size_mb:.2f} MB ({reduction:.1f}% reduction)")
        print(f"• File Location:   {output_path}\n")
    else:
        print("\n Compression failed:")
        print(result.stderr)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Web Hero Video Optimizer")
    parser.add_argument("--input", default="src/assets/SUPUN GROUP OF COMPANY.mp4", help="Input video file")
    parser.add_argument("--output", default="public/videos/hero-background.mp4", help="Output video path")
    parser.add_argument("--height", type=int, default=720, help="Target resolution height (720 or 1080)")
    parser.add_argument("--fps", type=int, default=25, help="Frame rate (recommended: 25)")
    parser.add_argument("--crf", type=int, default=30, help="CRF constant rate factor (26-32)")
    parser.add_argument("--duration", type=int, default=None, help="Clip duration in seconds (optional)")

    args = parser.parse_args()
    compress_video(
        input_path=args.input,
        output_path=args.output,
        target_height=args.height,
        fps=args.fps,
        crf=args.crf,
        duration=args.duration
    )
