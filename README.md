# Smart Web Design Scraper

Smart Web Design Scraper

## How to Run

### Angular Client
```
cd client
npm start
```
It will start angular dev server at port 3301

### Server
```
cd server
node app.js
```

Server will run at port 3302

Example API Usage:
```
http://localhost:3302/api/analyze?url=http:%2F%2Flocalhost:3303%2Fpage1.html&size=1024x768
```
### Test Site
```
cd sample-website
docker-compose up
```
It will start a sample site for testing purpose at port 3303

## Authors
- Ezzat Chamudi
- Mohammed Ayman Rahmon