# codymatch 0.1

## Commands

Create and start containers:

```bash
./codymatch.sh up
```


Stop running containers:

```bash
./codymatch.sh stop
```

Stop and remove containers & networks:

```bash
./codymatch.sh down
```

Stop and remove containers & networks + build or rebuild services:

```bash
./codymatch.sh build
```

View output from containers:

```bash
./codymatch.sh logs
```

Stop, remove, build, create, start containers & networks and view output:

```bash
./codymatch.sh bul
```

Create, start containers & networks and view output:

```bash
./codymatch.sh ul
```

Stop, remove, create, start containers & networks and view output:

```bash
./codymatch.sh dul
```

Start local testing environment:

```bash
./codymatch.sh test
```

Pull latest version from git and deploy

```bash
./codymatch.sh deploy
```

### Backend container only

Restart backend service container:

```bash
./codymatch.sh backend restart
```

View output from backend container:

```bash
./codymatch.sh backend logs
```

Restart backend service container and view output:

```bash
./codymatch.sh brl
```

Execute /bin/sh command in backend container:

```bash
./codymatch.sh backend bash
```

Execute npm command in backend container:

```bash
./codymatch.sh backend npm
```

Execute npx command in backend container:

```bash
./codymatch.sh backend npx
```

### Frontend container only

Restart frontend service container:

```bash
./codymatch.sh frontend restart
```

View output from frontend container:

```bash
./codymatch.sh frontend logs
```

Execute /bin/sh command in frontend container:

```bash
./codymatch.sh frontend bash
```

Execute npm command in frontend container:

```bash
./codymatch.sh frontend npm
```
