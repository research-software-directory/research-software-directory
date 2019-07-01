#!/bin/bash
# this is not a script, execute manually
sudo -i

# install docker
sudo apt-get update
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common \
    git

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository -y \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io


# install nginx
sudo apt-get install -y nginx-light

# install docker composees
sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# install certbot
sudo add-apt-repository -y universe
sudo add-apt-repository -y ppa:certbot/certbot
sudo apt-get update
sudo apt-get install -y certbot python-certbot-nginx

sudo certbot ./certbot-auto certonly --manual \
 --preferred-challenges=dns \
 --email rsd@esciencecenter.nl \
 --server https://acme-v02.api.letsencrypt.org/directory \
 --agree-tos \
 -d *.research-software.nl