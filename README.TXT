EDITOR KURZŮ projektu EDU AI asistent

veřejná beta verze - pro účely testování


Instalace: 
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version

sudo apt update
sudo apt install apt-transport-https curl gnupg-agent ca-certificates software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo apt install docker-ce docker-ce-cli containerd.io -y
docker version

docker-compose up -d

UI webserveru na portu 8088
