const bcrypt = require('bcrypt')

const auth = require('../../../auth')
const error = require('../../../utils/error')

const TABLE = 'auth'

module.exports = (store = require('../../../store/dummy')) => {

    async function login(username, password) {
        const data = await store.query(TABLE, {username: username})
        if (!bcrypt.compare(password, data.password)) {
            throw error('Invalid username or password', 400)
        }
        return auth.sign({...data})
    }

    async function upsert(data) {
        const authData = {
            id: data.id,
        }

        if (data.username) {
            authData.username = data.username
        }
        if (data.password) {
            authData.password = await bcrypt.hash(data.password, 5)
        }
        return store.upsert(TABLE, authData)
    }

    return {
        login,
        upsert,
    }
}