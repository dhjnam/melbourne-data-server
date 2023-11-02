const path = require('node:path');
const express = require('express');
const { geojson } = require(path.join(process.env.ROOT, 'loaddata.js'))

const router = express.Router();

geojson.then((geojsonData) => {
    router.get('/', (_, res) => {
        res.json(JSON.parse(geojsonData))
        res.end();
    });

})

module.exports = router;