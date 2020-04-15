const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');

const router = express.Router();


const { authenticate } = require('../middleware/authenticate.middleware');
const Session = require('../models/session.model');


const initSession = async (userID) => {
    const token = await Session.generateToken();
    const session = new Session({ token, userID });
    await session.save();
    return session;
};

// checking if email id valid...
const isEmail = (email) => {
    if (typeof email !== 'string') {
        return false;
    }
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    return emailRegex.test(email);
};


router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(password) ;
        if (!isEmail(email)) {
            throw new Error('Email must be a valid email address.');
        }
        if (typeof password !== 'string') {
            throw new Error('Password must be a string.');
        }
        const user = new User({ email, password });
        const persistedUser = await user.save();

        const userID = persistedUser._id;
        const session = await initSession(userID);

        res.cookie('token', session.token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 1209600000,
            secure: process.env.NODE_ENV === 'production',
        }).status(201).json({
            title: 'User Registration Successful',
            detail: 'Successfully registered new user', // will only be set to true in production ...
        });
    } catch (err) {
        res.status(400).json({
            errors: [
                {
                    title: 'Registration Error',
                    detail: 'Something went wrong during registration process.',
                    errorMessage: err.message,
                },
            ],
        });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!isEmail(email)) {
            return res.status(400).json({
                errors: [
                    {
                        title: 'Bad Request',
                        detail: 'Email must be a valid email address',
                    },
                ],
            });
        }
        if (typeof password !== 'string') {
            return res.status(400).json({
                errors: [
                    {
                        title: 'Bad Request',
                        detail: 'Password must be a string',
                    },
                ],
            });
        }
        // queries database to find a user with the received email
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error();
        }

        // using bcrypt to compare passwords
        const passwordValidated = await bcrypt.compare(password, user.password);
        if (!passwordValidated) {
            throw new Error();
        }

        const userId = user._id;
        const session = await initSession(userId);

        res.cookie('token', session.token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 1209600000,
            secure: process.env.NODE_ENV === 'producion',

        }).json({
            title: 'Login Successful',
            detail: 'Successfully validated user credentials',
        });
    } catch (err) {
        res.status(401).json({
            errors: [
                {
                    title: 'Invalid Credentials',
                    detail: 'Check email and password combination',
                    errorMessage: err.message,
                },
            ],
        });
    }
});

router.get('/test', authenticate, async (req, res) => {
    try {
    // using an object to grab the user id from the request session ...
        const { userId } = req.session;

        // only retrieve the authenticated user's email ...
        const user = await User.findById({ _id: userId }, { email: 1, _id: 0 });

        res.json({
            title: 'Authentication successful',
            detail: 'Successfully authenticated user',
            user,
        });
    } catch (err) {
        res.status(401).json({
            errors: [
                {
                    title: 'invalid credentials',
                    detail: 'Check email and password combination ',
                    errorMessage: err.message,
                },
            ],
        });
    }
});


// test secure authenticate function...

router.get('/authTest', authenticate, async (req, res) => {
    try {
    // using object destructuring to grab the userId from the request session
        const { userId } = req.session;

        const user = await User.findById({ _id: userId }, { email: 1, _id: 0 });

        res.json({
            title: 'Authentication successful',
            detail: 'successfully authenticated user'
                .user,
        });
    } catch (err) {
        res.status(401).json({
            errors: [
                {
                    title: 'Unauthorized',
                    detail: 'Not authorized to access this route',
                    errorMessage: err.message,
                },
            ],
        });
    }
});


module.exports = router;
