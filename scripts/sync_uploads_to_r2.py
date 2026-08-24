import os
import subprocess
import glob

def sync_uploads_to_r2(local_dir="server/uploads", bucket_name="supun-group-uploads", remote=True):
    """
    Sync all existing uploaded images from server/uploads/ to Cloudflare R2 bucket.
    """
    if not os.path.exists(local_dir):
        print(f"Directory {local_dir} does not exist.")
        return

    files = glob.glob(os.path.join(local_dir, "*"))
    files = [f for f in files if os.path.isfile(f) and not f.endswith(".gitkeep")]
    
    print("=" * 60)
    print(f" SYNCING {len(files)} IMAGES TO CLOUDFLARE R2 ({bucket_name})")
    print(f" Mode: {'REMOTE (Cloudflare Cloud)' if remote else 'LOCAL (.wrangler state)'}")
    print("=" * 60)

    for i, file_path in enumerate(files, 1):
        filename = os.path.basename(file_path)
        # R2 object key in the bucket
        key = f"{bucket_name}/{filename}"
        
        cmd = ["npx", "wrangler", "r2", "object", "put", key, "--file", file_path]
        if not remote:
            cmd.append("--local")

        print(f"[{i}/{len(files)}] Uploading {filename}...")
        try:
            res = subprocess.run(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                encoding="utf-8",
                errors="replace",
                shell=True
            )
            if res.returncode == 0:
                print(f"   Done")
            else:
                print(f"   Note: {res.stderr.strip() or res.stdout.strip()}")
        except Exception as e:
            print(f"   Error: {e}")

    print("\n Sync completed successfully!")

if __name__ == "__main__":
    import sys
    is_remote = "--local" not in sys.argv
    sync_uploads_to_r2(remote=is_remote)
