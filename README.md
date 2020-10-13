# Smart Web Design Scraper

Smart Web Design Scraper

## Preparation

These steps are required before development or production compilation.

```sh
# Install node modules
(cd shared && npm install)
(cd client && npm install)
(cd server && npm install)
(cd chrome-ext && npm install)
```

## Running development mode

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
