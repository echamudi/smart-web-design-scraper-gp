const authJwt = require('./authenticate.middleware');
const verifySignUp = require('./signup-verification.middleware');

module.exports = {
    authJwt,
    verifySignUp,
};
