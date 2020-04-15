const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const initial = require('./initialize-db');

const corsOptions = {
    origin: 'http://localhost:3301',
};

const dbConfig = require('./configs/database.config');
const db = require('./models');

db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Successfully connect to MongoDB.');
        initial();
    })
    .catch((err) => {
        console.error('Connection error', err);
        process.exit();
    });


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get('/', (req, res) => {
    res.json({ message: 'SWDS server is running!' });
});

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/analyzer.routes')(app);

// set port, listen for requests
const PORT = 3302;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
