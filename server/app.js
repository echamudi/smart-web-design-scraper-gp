const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dbConfig = require('./config/dbconf.js');

mongoose.Promise = global.Promise;
mongoose
    .connect(
        dbConfig.url,
        { useNewUrlParser: true },
    )
    .then(
        () => {
            console.log('Connected to mongoDB');
        },
        (err) => console.log('Error connecting to mongoDB', err),
    );
const app = express();
const port = 3302;

// sets up the middleware for parsing bodies and cookies off of the request.
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('temp'));

// routes ...
const userRoute = require('./routes/users');
const analyzerRoute = require('./routes/analyzer');

app.use('/api/users', userRoute);
analyzerRoute(app);

app.listen(port, () => {
    console.log(`server running on port  ${port}`);
});
