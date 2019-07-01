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
sudo chmod +x /usr/local/bin/docker-compose

# install certbot
sudo add-apt-repository -y universe
sudo add-apt-repository -y ppa:certbot/certbot
sudo apt-get update
sudo apt-get install -y certbot python-certbot-nginx

sudo certbot certonly --manual \
 --preferred-challenges=dns \
 --email rsd@esciencecenter.nl \
 --server https://acme-v02.api.letsencrypt.org/directory \
 --agree-tos \
 -d *.demo.research-software.nl

cd ~
git clone https://github.com/research-software-directory/research-software-directory.git
cd research-software-directory
git checkout conference-demo

apt-get upgrade -y

# Create instance

# 1. Copy demo repo

cp -rP research-software-directory instances/unix
cd instances/unix
git checkout -b unix.demo.research-software.nl

#2. Customize
#2.1. Change admin password  (AUTH_PASSWORD env in rsd-secrets.env)
#2.2. Logo, colors, etc.

#3. up

source rsd-secrets.env
docker-compose -p unix up --build

#4. configure proxy with external instance http port

# get port on which unix rsd is running
docker ps |grep unix |grep reverse
cp /etc/nginx/sites-enabled/other /etc/nginx/sites-enabled/unix
nano /etc/nginx/sites-enabled/unix
service nginx reload

# 6. test admin
# 7. test frontend
# 8. mail back


# After admin additions

source rsd-secrets.env
docker-compose --project-name unix exec harvesting python app.py harvest all
docker-compose --project-name unix exec harvesting python app.py resolve

If software does not show use cache busting
