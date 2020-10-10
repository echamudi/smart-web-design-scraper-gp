# Smart Web Design Scraper

Smart Web Design Scraper

## Running development mode

```sh
# Install node modules if it's not installed yet
(cd shared && npm install)
(cd client && npm install)
(cd server && npm install)
(cd chrome-ext && npm install)
```

### Terminal 1: Mongo
```
docker-compose -f dev.docker-compose.yml up
```

### Terminal 2: Express
```
cd server
npm start
```

### Terminal 3: Angular
```
cd client
npm start
```

### Terminal 4: Chrome Extension
```
cd chrome-ext
npm run watch
```

## Running the app

```sh
# Install node modules if it's not installed yet
(cd shared && npm install)
(cd client && npm install)
(cd server && npm install)
(cd chrome-ext && npm install)

# Compile codes
(cd client && npm run build)
(cd server && npm run build)
(cd chrome-ext && npm run build)

# Run docker
docker-compose up
```

## Authors
- Ezzat Chamudi
- Mohammed Ayman Rahmon
