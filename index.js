const dotenv = require('dotenv')
dotenv.config({
    path: __dirname + '/config/.env'
});
if (process.env.NODE_ENV) {
    dotenv.config({
        path: __dirname + `/config/.env.${process.env.NODE_ENV}`,
        override: true
    })
}

const SCHEME = process.env.SCHEME
const HOST = process.env.HOST
const IP = process.env.IP
const PORT = process.env.PORT

const express = require('express');
const cors = require('cors');
const routes = require('./routes')

const origin = process.env.NODE_ENV === '' ? 
    new RegExp(`${SCHEME}:\/\/${HOST}(:[1-9]\d{0,4})?`) : [
        new RegExp(`${SCHEME}:\/\/${HOST}(:[1-9]\d{0,4})?`),
        new RegExp(`${SCHEME}:\/\/${IP}(:[1-9]\d{0,4})?`)
    ]

const app = express();
app.use(cors({ origin }));
routes(app)

server = app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

// for testing
if ( process.env.NODE_ENV === 'test' ) {
    module.exports = server;
}
