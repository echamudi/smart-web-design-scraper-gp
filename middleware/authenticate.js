const Session = require('../models/session');

const authenticate = async(req , res , next) => {
try{
    const { token } = req.cookies;
    console.log(token); 
    console.log(req.cookies); 
    if(!token || typeof token !== 'string') {
    // if the token is not a string, we know the session token was not set by the server and is therefore invalid
    console.log('not a string...');    
    throw new Error('Request cookie is invalid.') ; 
         

    }
    // if the a session is not found with the provided token, clear the cookie
    // e.g. user session expired on server, but the browser still has the cookie
    const session = await Session.findOne({ token, status: 'valid' });
    if(!session){

        res.clearCookie('token');
        throw new Error('your session has expired. you need to log in.') ; 
    }
    // setting the session from the db on the req 
    req.session = session ; 

    // continues the request-response cycle  
      next() ; 

}catch(err) {
res.status(401).json({
    errors:[
        {
            title : 'Unauthorized' ,
            detail: 'Authentication credentials invalid' , 
            errorMessage: err.message
        }
    ]
});
} 
}


module.exports = { authenticate };