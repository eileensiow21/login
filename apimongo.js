const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // This is needed for POST requests
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const uuid = require('uuid');

app.use(bodyParser.json()); // This will extract data from body of the message
app.use(bodyParser.urlencoded({extended: true})); // This will extract data from the URL
app.use(cookieParser());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/eileen1', {useNewUrlParser: true, useUnifiedTopology: true});

const User = mongoose.model('User', {
    name: String,
    username: String,
    email: String,
    password: String,
    accessLvl: Number
});

const Session = mongoose.model('Session', {
    token: String,
    username: String,
    ip: String,
    expiry: Number
});

// GET
// http://localhost:3000/api/user/add/Username/some@thing.com/passowrd/password
// POST
// http://localhost:3000/api/user/add
// {
//      name: Username,
//      email: some@thing.com
//      pass1: password,
//      pass2: password
// }
// app.get('/test', (req, res) => {
//    console.log(req);
// });

// igor
// sam
// john

// IGOR
// Igor
// iGOR

app.get('/api/user/register/:name/:username/:email/:pass', async (req, res) => {
    // const existingUsers = await User.find({username: req.params.username.toLowerCase()}).exec();

    const existingUsers = await User.find({
        $or: [
            {username: req.params.username.toLowerCase()},
            {email: req.params.email.toLowerCase()}
        ]
    }).exec();

    if (existingUsers.length === 0) {
        const newUser = new User({
            name: req.params.name,
            username: req.params.username.toLowerCase(),
            email: req.params.email.toLowerCase(),
            password: req.params.pass,
            accessLvl: 1
        });

        newUser.save().then(function () {
            res.send({status: 1, msg: 'User registered successfully!'});
        });
    } else {
        res.send({status: 0, msg: 'User exists already!'});
    }

});

app.post('/api/user/register', async (req, res) => {
    // const existingUsers = await User.find({username: req.params.username.toLowerCase()}).exec();

    const existingUsers = await User.find({
        $or: [
            {username: req.body.username.toLowerCase()},
            {email: req.body.email.toLowerCase()}
        ]
    }).exec();

    if (existingUsers.length === 0) {
        const newUser = new User({
            name: req.body.name,
            username: req.body.username.toLowerCase(),
            email: req.body.email.toLowerCase(),
            password: req.body.password,
            accessLvl: 1
        });

        newUser.save().then(function () {
            res.send({status: 1, msg: 'User registered successfully!'});
        });
    } else {
        res.send({status: 0, msg: 'User exists already!'});
    }
});

app.get('/api/user/login/:username/:password', async (req, res) => {
    const user = await User.find({
        $and: [
            {$or: [
                    {username: req.params.username.toLowerCase()},
                    {email: req.params.username.toLowerCase()},
                ]},
            {password: req.params.password}
            ]
    }).exec();

    if(user.length === 1) {
        const sessionId = uuid.v4();
        const timeStamp = new Date().getTime(); // Number of milliseconds since 1st Jan 1970 (EPOCH Time)
        const expiry = timeStamp + (1000 * 60 * 60);
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // const offset = timeStamp + (14 * 24 * 60 * 60 * 1000);
        const newSession = new Session({username: req.params.username, token: sessionId, expiry: expiry, ip: ip});

        newSession.save().then(() => {
            res.send({status: 1, msg: sessionId});
        });
    } else {
        res.send({status: 0, msg: 'Incorrect details!'});
    }
});

app.post('/api/user/login', async (req, res) => {
    const user = await User.find({
        $and: [
            {$or: [
                    {username: req.body.username.toLowerCase()},
                    {email: req.body.username.toLowerCase()},
                ]},
            {password: req.body.password}
        ]
    }).exec();

    if(user.length === 1) {
        const sessionId = uuid.v4();
        const timeStamp = new Date().getTime(); // Number of milliseconds since 1st Jan 1970 (EPOCH Time)
        const expiry = timeStamp + (1000 * 60 * 60);
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // const offset = timeStamp + (14 * 24 * 60 * 60 * 1000);
        const newSession = new Session({username: req.body.username, token: sessionId, expiry: expiry, ip: ip});

        newSession.save().then(() => {
            res.cookie('token', sessionId, {
                httpOnly: true,
                maxAge: 3600000
            });
            res.send({status: 1, msg: {username: req.body.username, token: sessionId}});
        });
    } else {
        res.send({status: 0, msg: 'Incorrect details!'});
    }
});

app.get('/api/user/data/:username', async (req, res) => {
    const session = await Session.findOne({token: req.cookies['token']}).exec();
    const sessionValidity = validateSession(session);

    if(sessionValidity.status && session.username === req.params.username) {
        res.send('All good - user has valid session!');
    } else if(sessionValidity.status && session.username !== req.params.username) {
        res.send('No access!');
    } else {
        res.send(sessionValidity.msg);
    }
});

app.post('/api/password', async (req, res) => {
    const token = req.body.session;

    const session = await Session.findOne({token: token}).exec();
    const validity = validateSession(session);

    if(validity.status) {
        // DO LOGICS
        const username = req.body.username;
        const password = req.body.password;

        if(username === session.username) {
            const update = User.updateOne({username: username}, {$set: {password: password}});
            if(update) {
                res.send({status:1, msg: 'Password change'});
            } else {
                res.send({status:0, msg: 'Server error'});
            }
        } else {
            res.send({status:0, msg: 'Not authorised'});
        }

    } else {
        res.send(validity);
    }


    // if(session) {
    //     const currentTime = new Date().getTime();
    //     if(currentTime < session.expiry) {
    //         // SESSION IS VALID CARRY ON WITH LOGICS
    //         res.send({status: 1, msg: 'All good!'});
    //     } else {
    //         res.send({status: 0, msg: 'Session has expired!'});
    //     }
    // } else {
    //     res.send({status: 0, msg: 'Session does not exist!'});
    // }
});


app.get('/api/test/:session', async (req, res) => {
    const session = await Session.findOne({token: req.params.session}).exec();
    const validity = validateSession(session);

    if (validity.status) {
        // DO LOGICS
        const a = 1;
        const b = 3;
        const result = a + b;
        res.send({status: 1, msg: result});
    } else {
        res.send(validity);
    }

});

// app.get('/route/test', (req, res) => {
//     res.send('This is get route!');
// })
//
// app.post('/route/test', (req, res) => {
//     res.send('This is post route!');
// })

// app.post('/test/post', (req, res) => {
//     const name = req.body.username;
//     const email = req.body.email;
//     console.log(name);
//     console.log(email);
//     res.send('Hello,' + name + ',' + email);
// });

// fetch('url')
//     .then(r => r.json())
//     .then(response => {
//
//     });

const validateSession = (session) => {
    if(session) {
        const currentTime = new Date().getTime();
        if(currentTime < session.expiry) {
            return ({status: 1, msg: 'All good!'});
        } else {
            return ({status: 0, msg: 'Session has expired!'});
        }
    } else {
        return ({status: 0, msg: 'Session does not exist!'});
    }
}

app.listen(3000);
