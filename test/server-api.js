const request = require('supertest')('http://localhost:3302');
const assert = require('assert');
const { expect } = require('chai');

const ts = Math.round((new Date()).getTime() / 100);

describe('Basic server test', () => {
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

    it('allows public to use public api (/api/test/all)', (done) => {
        request.get('/api/test/all')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            // .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe('Sign up tests', () => {
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
});

describe('Login tests', () => {
    let token = '';
    it('signs in correctly', (done) => {
        request
            .post('/api/auth/signin')
            .send({
                username: `testuser${ts}`,
                password: '123456789',
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('username');
                expect(res.body).to.have.property('email');
                expect(res.body).to.have.property('roles');
                expect(res.body).to.have.property('accessToken');
                token = res.body.accessToken;
                done();
                // assert.deepStrictEqual(res.body , {
                //     id: '5e9e43d40642fa08019db5ba',
                //     username: 'testuser15874303563',
                //     email: 'test15874303563@test.com',
                //     roles: [
                //     'ROLE_USER'
                //  ],
                //     accessToken: '',
                // });
            });
    });

    it('authenticates user using a JWT token', (done) => {
        request.get('/api/test/user')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .expect(200, done);
    });

    it('denies user content if no token is provided', (done) => {
        request.get('/api/test/user')
            .expect(403)
            .end((err, res) => {
                assert.deepStrictEqual(res.body, {
                    message: 'No token provided!',
                });
                done();
            });
    });
});

// After running test, remove users with db.users.remove( { username: {$regex : "testuser"}});
