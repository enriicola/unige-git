# GS STARTER

## NODE / NPM

look at the package.json in the section "engines" to see the currently supported version of both NODE and NPM

If you need multiple version on the same development machine you can consider **NVM Windows** from <https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows>

Example for node 16 (last minor) With Administrator rights:  

```
nvm install 16    
nvm use 16.x.x 
```

## FRONT-END ANGULAR v 15

npm install (npm v 16.18.1)

npm run build (ng build)

npm run start (ng serve)

### navigate to gui -> <http://localhost:4200/>

docker build -t gs-templates/starter-front-end:latest .

docker run -p 80:80 gs-templates/starter-front-end:latest


## BACK-END .NET 6

dotnet build

dotnet run

### navigate to api swagger -> <https://localhost:5007/swagger/>

### copy 'dist' folder from front-end to 'wwwroot' into back-end to navigate gui -> <https://localhost:5007/>

dotnet publish -c Release -r linux-x64 -o ./publish

docker build -t gs-templates/starter-back-end:latest .

docker run -p 5007:5007 gs-templates/starter-back-end:latest


## IDENTITY PROVIDER KEYCLOAK (inside folder identity-provider/keycloak)

sudo service docker start

docker swarm init

printf 'Admin' | sudo docker secret create kc_user -

printf 'Admin' | sudo docker secret create pgsql_db_user -

printf 'tirocinio0799000' | sudo docker secret create kc_pwd -

printf 'tirocinio0799000!' | sudo docker secret create pgsql_db_pwd -

sudo docker stack deploy --compose-file docker-compose.yml kc-portale-aziendale

### navigate to identity provider -> <https://localhost:8443/auth/>

(sudo docker stack rm kc-starter)

### keycloak config

import automatically from 'realm-export.json' file (select if a resource exists skip):

    clients:
    - 'starter-gui' (for front-end)
    - 'starter-swagger' (for back-end)

    groups and roles:
    - group -> 'base-user'    roles -> 'base-user'
    - group -> 'admin-user'   roles -> 'admin-user' 'admin'

to be set manually:

    add 'admin-user' group to the default user 'admin'

### modifiche 12/07 per iniziare a lavorare
sostituito "database" in appsettings.json abbiamo messo sqlite
in appsettings.json 0.0.0.0 --> localhost
commentato tutto quello che riguarda l'Authorization flow (in Program.cs)
commentato Authorization nel sampleController
