# StreamFlow VPS Setup Guide

This guide assumes you have a fresh Ubuntu 20.04/22.04 LTS server.

## 1. System Updates & Prerequisites
SSH into your server and run:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3-pip python3-venv ffmpeg -y
```
*Note: FFMPEG is critical for yt-dlp to merge video+audio streams.*

## 2. Project Setup
Create a directory for the backend:
```bash
mkdir -p ~/streamflow-backend
cd ~/streamflow-backend
```

Copy the contents of the `vps-setup` folder (server.py and requirements.txt) into this directory.

## 3. Install Dependencies
Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 4. Test the Server
Run the server manually to check for errors:
```bash
python3 server.py
```
*You should see "Running on http://0.0.0.0:5000". Press Ctrl+C to stop.*

## 5. Production Deployment (Systemd + Gunicorn)
Don't use `python server.py` for production. Use Gunicorn.

1. **Create a Systemd Service:**
```bash
sudo nano /etc/systemd/system/streamflow.service
```

Paste this content (adjust paths if your user isn't 'root'):
```ini
[Unit]
Description=StreamFlow Backend
After=network.target

[Service]
User=root
WorkingDirectory=/root/streamflow-backend
Environment="PATH=/root/streamflow-backend/venv/bin"
ExecStart=/root/streamflow-backend/venv/bin/gunicorn --workers 4 --bind 0.0.0.0:5000 server:app

[Install]
WantedBy=multi-user.target
```

2. **Start the Service:**
```bash
sudo systemctl daemon-reload
sudo systemctl start streamflow
sudo systemctl enable streamflow
```

3. **Check Status:**
```bash
sudo systemctl status streamflow
```

## 6. Frontend Connection
1. Get your VPS Public IP.
2. Open `components/YouTubeDownloader.tsx` in your frontend code.
3. Update `VPS_API_URL` constant:
   ```typescript
   const VPS_API_URL = 'http://YOUR.VPS.IP.ADDRESS:5000';
   ```
   *(Or setup Nginx with a domain and SSL for https://your-api.com)*

## Troubleshooting
- **CORS Errors:** Ensure `flask-cors` is installed and instantiated in `server.py`.
- **Download Failures:** Check if FFMPEG is installed (`ffmpeg -version`).
- **Disk Full:** The server automatically deletes files older than 1 hour.
