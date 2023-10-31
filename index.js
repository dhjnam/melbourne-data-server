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

const fs = require('node:fs/promises');
const path = require('node:path');
const express = require('express');
const CSVtoJSON = require('csvtojson');
const GeoJSON = require('geojson');
const csvParser = require('csv-parse');
const bodyParser = require('body-parser');
const hdf5 = require('jsfive');

const path_to_melbdata = path.join(root, data_dir, 'melb_data_orig.csv')
const path_to_geojson = path.join(root, data_dir, 'prepared/melbourne_sa.geojson')

const app = express();

const loadData = [
    CSVtoJSON({
        noheader: true,
        output: "csv",
    }).fromFile(path_to_melbdata),
    fs.readFile(path_to_geojson)
]

Promise.all(loadData).then((data) => {
    [melbdata, geojson] = data;
    app.get('/melbdata', (_, res) => {
        res.json({
            features: melbdata[0],
            data: melbdata.slice(1, melbdata.length)
        })
    });
    
    app.get('/geojson', (_, res) => {
        res.json(JSON.parse(geojson))
        res.end();
    });


    server = app.listen(port, () => console.log(`Server listening on port ${port}`));

    // for testing
    if ( process.env.NODE_ENV === 'test' ) {
        module.exports = server;
    }
})
