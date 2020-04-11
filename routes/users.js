const express = require('express');
const bcrypt = require('bcryptjs') ; 

const User = require('../models/user');

const router = express.Router(); 


// checking if email id valid... 
const isEmail = (email) => {
    if (typeof email !== 'string') {
      return false;
    }
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  
    return emailRegex.test(email);
  };


router.post('/register', async (req , res) => {
try{

    const{email , password} = req.body ; 
    if(!isEmail(email)){ 
        throw new Error('Emaild must be a valid email address.') ; 
    }

    if(typeof password !== 'string') {
        throw new Error('password must be a string') ; 
    } 

    const user = new User({email , password});
    const presistedUser = await user.save() ; 

    res.status(201).json({
        title: 'User Registration Successful' , 
        detail: 'user registered' 
    }); 
}catch(err) {
    res.status(400).json({
        errors: [
          {
            title: 'Registration Error',
            detail: 'Something went wrong during registration process.',
            errorMessage: err.message,
          },
        ],
      });} 
});


router.post('/login', async(req,res) =>{
try{
const {email ,password} = req.body ; 
if(!isEmail(email)) {
return res.status(400).json({
    errors: [
        {
            title: 'bad request', 
            detail : 'Email must be valid' 
        },
    ]
});
}

if(typeof password !== 'string') {
return res.status(400).json({
    errors:[
        {
            title: 'bad request',
            detail: 'password must be a string'
        },
    ]
});
}

const user = await User.findOne({email}); 
if(!user) {
    throw new Error() ; 
}

// check password using bcrypt...
const passwordValidator = await bcrypt.compare(password , user.password);
if(!passwordValidator){
    throw new Error() ; 
}
res.status(200).json({
    title: 'login successful', 
    detail: 'user credentials were successfully validated'
});
}catch(err){
res.status(401).json({
    errors:[
        {
            title: 'invalid credentials',
            detail: 'Check email and password combination ', 
            errorMessage: err.message
        },
    ]
});

}
});


module.exports = router ;







