#!/bin/sh
set -e

# Firewall baseline: deny incoming, allow outgoing, open only HTTP 80/tcp and HTTPS 443/tcp.
# SSH (port 22) stays closed. To allow SSH from one IP only, run before enabling:
#   ufw allow from <IP> to any port 22

ufw default deny incoming
ufw default allow outgoing
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
