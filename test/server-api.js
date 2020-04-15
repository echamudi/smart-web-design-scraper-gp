const request = require('supertest')('http://localhost:3302');
const assert = require('assert');

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
});
