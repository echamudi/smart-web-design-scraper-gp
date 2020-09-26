// This test code tests the new /server2

const request = require('supertest')('http://localhost:4000');
const { assert } = require('chai');

const ts = Math.round((new Date()).getTime() / 100);

describe('Basic server test', () => {
    it('runs graphql server correctly', (done) => {
        request
            .get('/graphql')
            .end((err, res) => {
                assert.deepStrictEqual(res.error.text, 'GET query missing.');
                done();
            });
    });
});

describe('Sign up tests', () => {
    it('signs up correctly', (done) => {
        request
            .post('/graphql')
            .send({
                query: `mutation {
                    signup(username: "testuser${ts}", password: "testpass${ts}", email: "user${ts}@test.com") {
                      success,
                      username,
                      email
                    }
                }`,
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                const result = JSON.parse(res.text);
                assert.deepStrictEqual(result.data.signup.success, true);
                assert.deepStrictEqual(result.data.signup.username, `testuser${ts}`);
                assert.deepStrictEqual(result.data.signup.email, `user${ts}@test.com`);
                done();
            });
    });

    it('rejects same username', (done) => {
        request
            .post('/graphql')
            .send({
                query: `mutation {
                    signup(username: "testuser${ts}", password: "testpass${ts}", email: "otheruser${ts}@test.com") {
                      success,
                      username,
                      email
                    }
                }`,
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                const result = JSON.parse(res.text);
                assert.deepStrictEqual(result.data.signup, null);
                assert.deepStrictEqual(result.errors[0].message, 'username already exists');
                done();
            });
    });

    it('rejects same email', (done) => {
        request
            .post('/graphql')
            .send({
                query: `mutation {
                    signup(username: "othertestuser${ts}", password: "testpass${ts}", email: "user${ts}@test.com") {
                      success,
                      username,
                      email
                    }
                }`,
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                const result = JSON.parse(res.text);
                assert.deepStrictEqual(result.data.signup, null);
                assert.deepStrictEqual(result.errors[0].message, 'email already exists');
                done();
            });
    });
});

describe('Login tests', () => {
    let token = '';
    it('signs in correctly', (done) => {
        request
            .post('/graphql')
            .send({
                query: `{
                    login(username: "testuser${ts}", password: "testpass${ts}") {
                        success,
                        user {
                            username,
                            email,
                            roles
                        },
                        token
                    }
                }`,
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                const result = JSON.parse(res.text);
                assert.deepStrictEqual(result.data.login.success, true);
                assert.deepStrictEqual(result.data.login.user.username, `testuser${ts}`);
                assert.deepStrictEqual(result.data.login.user.email, `user${ts}@test.com`);
                assert.deepStrictEqual(result.data.login.user.roles, ['user']);
                token = result.data.login.token;
                done();
            });
    });

    it('gets user details using JWT token', (done) => {
        request
            .post('/graphql')
            .send({
                query: `{
                    getCurrentUser {
                        username
                        email
                        roles
                        isUser
                        isAdmin
                    }
                }`,
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
            .expect(200)
            .end((err, res) => {
                const result = JSON.parse(res.text);
                assert.deepStrictEqual(result.data.getCurrentUser.username, `testuser${ts}`);
                assert.deepStrictEqual(result.data.getCurrentUser.email, `user${ts}@test.com`);
                assert.deepStrictEqual(result.data.getCurrentUser.roles, ['user']);
                assert.deepStrictEqual(result.data.getCurrentUser.isUser, true);
                assert.deepStrictEqual(result.data.getCurrentUser.isAdmin, false);
                done();
            });
    });

    it('gets user returns null without invalid JWT token', (done) => {
        request
            .post('/graphql')
            .send({
                query: `{
                    getCurrentUser {
                        username
                        email
                        roles
                        isUser
                        isAdmin
                    }
                }`,
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('x-access-token', 'randomjwt')
            .expect(200)
            .end((err, res) => {
                const result = JSON.parse(res.text);
                assert.deepStrictEqual(result.data.getCurrentUser, null);
                done();
            });
    });
});
