// const GeoJSON = require('geojson');
// const csvParser = require('csv-parse');
// const hdf5 = require('jsfive');

const fs = require('node:fs/promises');
const path = require('node:path');
const CSVtoJSON = require('csvtojson');

const ROOT = process.env.ROOT
const DATA_DIR = process.env.DATA_DIR

const path_to_melbdata = path.join(ROOT, DATA_DIR, 'melb_data_orig.csv')
const path_to_geojson = path.join(ROOT, DATA_DIR, 'prepared/melbourne_sa.geojson')

module.exports = {
    melbdata: CSVtoJSON({
        noheader: true,
        output: "csv",
    }).fromFile(path_to_melbdata).then(data => {
        return {
            features: data[0],
            data: data.slice(1, data.length)
        }
    }),
    geojson: fs.readFile(path_to_geojson)
}