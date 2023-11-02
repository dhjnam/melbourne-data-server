process.env.NODE_ENV = 'test';
const dotenv = require('dotenv')
dotenv.config({
    path: __dirname + '/../config/.env'
});
dotenv.config({
    path: __dirname + `/../config/.env.${process.env.NODE_ENV}`,
    override: true

});

const ROOT = process.env.ROOT;
const PORT = process.env.PORT;

const path = require('node:path');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

const testMelbdata = require('./routes/melbdata.test.js')
const testGeojson = require('./routes/geojson.test.js')

chai.use(chaiHttp);

describe('test api', async function() {
    
    before(function(done) {
        const server = require(path.join(ROOT, 'index.js'));
        setTimeout(() => {
            done();
        }, 200);
    });
    
    after(function(done) {
        server.close();
        done();
    });

    describe('melbdata', testMelbdata);
    describe('geojson', testGeojson);
});
