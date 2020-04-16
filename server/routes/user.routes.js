const { authJwt } = require('../middleware');
const controller = require('../controllers/user.controller');

module.exports = function (app) {
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
        );
        next();
    });

    app.get('/api/test/all', controller.publicContent);

    app.get('/api/test/user', [authJwt.verifyToken], controller.userContent);

    app.get(
        '/api/test/admin',
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminContent,
    );
};
