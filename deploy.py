#!/usr/bin/env python3
import ftplib
import os
from pathlib import Path

# FTP Configuration
FTP_HOST = "107.180.117.143"
FTP_USER = "ppcnwsqxzio0"
FTP_PASS = os.environ.get("FTP_PASSWORD", "")
FTP_PATH = "/public_html"

def delete_remote_files(ftp, path=""):
    """Recursively delete all files and directories in FTP path"""
    try:
        if path:
            ftp.cwd(path)
        
        items = ftp.nlst()
        for item in items:
            try:
                # Try to delete as file
                ftp.delete(item)
                print(f"  ✓ Deleted file: {item}")
            except ftplib.all_errors:
                # If it fails, it might be a directory
                try:
                    delete_remote_files(ftp, item)
                    ftp.cwd("..")
                    ftp.rmd(item)
                    print(f"  ✓ Deleted directory: {item}")
                except ftplib.all_errors as e:
                    print(f"  ✗ Could not delete {item}: {e}")
    except ftplib.all_errors as e:
        print(f"  ✗ Error listing directory: {e}")

def deploy():
    """Upload built files to GoDaddy via FTP"""
    try:
        # Connect to FTP
        print(f"Connecting to {FTP_HOST}...")
        ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS)
        print("✓ Connected!")
        
        # Change to target directory
        ftp.cwd(FTP_PATH)
        print(f"✓ Changed to {FTP_PATH}")
        
        # Delete old files
        print("\nCleaning old files...")
        delete_remote_files(ftp)
        
        # Make sure we're back in the target directory
        ftp.cwd(FTP_PATH)
        
        # Upload all files from dist/public
        local_dir = Path("dist/public")
        if not local_dir.exists():
            print(f"✗ Error: {local_dir} does not exist. Did you run 'pnpm build'?")
            return False
        
        print(f"\nUploading files from {local_dir}...")
        uploaded = 0
        
        for file_path in sorted(local_dir.rglob("*")):
            if file_path.is_file():
                relative_path = file_path.relative_to(local_dir)
                remote_path = str(relative_path).replace("\\", "/")
                
                # Create subdirectories if needed
                remote_dir = os.path.dirname(remote_path)
                if remote_dir:
                    try:
                        ftp.mkd(remote_dir)
                    except ftplib.all_errors:
                        pass  # Directory might already exist
                    ftp.cwd(FTP_PATH)
                
                # Upload file
                with open(file_path, "rb") as f:
                    ftp.storbinary(f"STOR {remote_path}", f)
                    uploaded += 1
                    print(f"  ✓ {remote_path}")
        
        ftp.quit()
        print(f"\n✓ Deployment complete! {uploaded} files uploaded.")
        return True
        
    except Exception as e:
        print(f"\n✗ Deployment failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    deploy()
