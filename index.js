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
const port = process.env.PORT
const root = process.env.ROOT
const data_dir = process.env.DATA_DIR

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
    }).fromFile(path.join(root, data_dir, 'melb_data_orig.csv'))
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