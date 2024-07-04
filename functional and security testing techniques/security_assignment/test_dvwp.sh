git clone https://github.com/vavkamil/dvwp.git
cd dvwp
docker-compose up -d --build
docker-compose run --rm wp-cli install-wp
docker-compose up -d
#docker-compose down