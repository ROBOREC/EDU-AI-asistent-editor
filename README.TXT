EDU AI asistent
VEŘEJNÁ BETA VERZE

Prostředí pro návrh a provoz kurzů či procvičování - projekt AI asistent pro učitele a žáky: https://edu-ai.eu

EDU AI asistent usnadňuje práci učitelů - pomáhá s hledáním a tvorbou digitálních učebních materiálů, doučováním a podporou hybridní výuky. Žákům AI asistent pomáhá s pochopením látky a s přípravou na zkoušky. Usnadní jim využití existujících digitálníchvzdělávacích nástrojů a zpřístupní doučování dle potřeb jednotlivce.


#Struktura#
* Roborec UI - webová aplikace editoru je psaná v Pythonu, servírují ji Gunicorn workeři 
* DB - databáze (aktuálně z legacy důvodů MySQL)
Celery - správa úloh pro asynchronní spouštění s využitím front
RabbitMQ - broker pro Celery
RASA - open source framework pro tvorbu chatbotů
RASA Actions - akce, které může RASA vykonat při odpovědi uživateli
Webchat - webchat komunikující s RASA frameworkem

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
