// require('dotenv').config();
const config = process.env.NODE_ENV === 'dev' ? require(__dirname + '/config/dev.json')
    : process.env.NODE_ENV === 'test' ? require(__dirname + '/config/test.json')
    : process.env.NODE_ENV === 'debug' ? require(__dirname + '/config/debug.json')
    : require(__dirname + '/config/default.json')

const root = config.ROOT
const port = config.PORT

const express = require('express');
const CSVtoJSON = require('csvtojson');
const csvParser = require('csv-parse');
const bodyParser = require('body-parser');
const fs = require('node:fs/promises');
const path = require('node:path');
const hdf5 = require('jsfive');

const app = express();

app.get('/melbdata', async (req, res) => {
    const melbdata = await CSVtoJSON({
        noheader: true,
        output: "csv",
    }).fromFile(root + '/data/melb_data_orig.csv')
    res.json({
        features: melbdata[0],
        data: melbdata.slice(1, melbdata.length)
    })
});

app.get('/shape', (req, res) => {
    res.end();
});

server = app.listen(port, () => console.log(`Server listening on port ${port}`));

 // for testing
if ( process.env.NODE_ENV === 'test' ) {
    module.exports = server;
}