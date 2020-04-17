const request = require('supertest')('http://localhost:3302');
const assert = require('assert');

const ts = Math.round((new Date()).getTime() / 100);

describe('Server API test', () => {
    it('runs GET / correctly', (done) => {
        request
            .get('/')
            .expect(200)
            .end((err, res) => {
                assert.deepStrictEqual(res.body, {
                    message: 'SWDS server is running!',
                });
                done();
            });
    });

    it('signs up the user correctly', (done) => {
        request
            .post('/api/auth/signup')
            .send({
                username: `testuser${ts}`,
                email: `test${ts}@test.com`,
                password: '123456789',
                roles: ['user'],
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                assert.deepStrictEqual(res.body, {
                    message: 'User was registered successfully!',
                });
                done();
            });
    });

    it('rejects sign up with the same username', (done) => {
        request
            .post('/api/auth/signup')
            .send({
                username: `testuser${ts}`,
                email: `test${ts}-otheremail@test.com`,
                password: '123456789',
                roles: ['user'],
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                assert.deepStrictEqual(res.body, {
                    message: 'Failed! Username is already in use!',
                });
                done();
            });
    });

    it('rejects sign up with the same email', (done) => {
        request
            .post('/api/auth/signup')
            .send({
                username: `testuser${ts}-otheruser`,
                email: `test${ts}@test.com`,
                password: '123456789',
                roles: ['user'],
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                assert.deepStrictEqual(res.body, {
                    message: 'Failed! Email is already in use!',
                });
                done();
            });
    });

    // After running test, remove users with db.users.remove( { username: {$regex : "testuser"}});


    // TODO add tests

    // GET /api/test/all --> must be available for public users, must response 200

    // GET /api/test/user --> for all logged in users, must response 200

    // GET /api/test/admin --> for logged in users with admin role, must return 200

    // POST /api/auth/signin --> must be able to sign in with following raw JSON
    // {
    //     "username": "someusername",
    //     "password": "somepassword"
    // }
    //
    // must return with JWT token
});
