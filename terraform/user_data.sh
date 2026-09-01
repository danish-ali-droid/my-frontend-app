#!/bin/bash

sudo apt update -y
sudo apt install nginx -y
sudo systemctl enable --now nginx
sudo apt install ruby-full wget -y
cd /tmp
wget https://aws-codedeploy-eu-north-1.s3.eu-north-1.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
sudo systemctl enable codedeploy-agent
sudo systemctl start codedeploy-agent

