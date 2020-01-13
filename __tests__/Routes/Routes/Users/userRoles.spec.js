const request = require('supertest');
const server = require('../../api/server');

describe('Should be able to make requests for user data and roles from Auth0.', () => {

    const user = { sub: "github|26471655" }
    const metaData = {
        "app_metadata": {
            "role": "admin"
        }
    }

    describe('Should be able to retrieve user data', () => {
        test('should be able to retrieve full user schema object from Auth0',
            () => request(server).post(`/api/users/`).send({ "sub": user.sub })
                .then(result => {
                    const data = result.body
                    // console.log('LOGGING', result, data)

                    expect(!!data.app_metadata.role).toBe(true)
                    expect(typeof data).toBe('object')
                    expect(result.status).toBe(200)
                })
        )

        test('should be able update & retrieve full user schema object from Auth0',
            () => request(server).put(`/api/users/${user.sub}`).send(metaData)
                .then(result => {
                    const data = result.body
                    // console.log('LOGGING', result, data)

                    expect(!!data.app_metadata.role).toBe(true)
                    expect(typeof data).toBe('object')
                    expect(result.status).toBe(200)
                })
        )
    })
})