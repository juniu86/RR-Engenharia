#!/bin/bash
set -e

FTP_HOST="107.180.117.143"
FTP_USER="ppcnwsqxzio0"
FTP_PASS="${FTP_PASSWORD}"
FTP_PATH="/public_html"

echo "Deploying to GoDaddy..."

# Create lftp script
cat > /tmp/deploy.lftp << LFTP_EOF
open -u $FTP_USER,$FTP_PASS $FTP_HOST
cd $FTP_PATH

# Remove all files and directories
find . -type f -exec rm {} \;
find . -type d -not -name "." -exec rmdir {} \; 2>/dev/null || true

# Upload new files
mirror -R dist/public/ .

quit
LFTP_EOF

# Run lftp
lftp -f /tmp/deploy.lftp

echo "✓ Deployment complete!"
rm /tmp/deploy.lftp
