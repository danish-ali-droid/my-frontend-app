#!/bin/bash
set -e
sudo DEBIAN_FRONTEND=noninteractive apt-get update -y
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y ruby-full wget
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y nginx
sudo systemctl enable --now nginx
cd /tmp
wget https://aws-codedeploy-eu-north-1.s3.eu-north-1.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
sudo systemctl start codedeploy-agent
sudo systemctl enable codedeploy-agent

