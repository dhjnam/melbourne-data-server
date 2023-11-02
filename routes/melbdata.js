const path = require('node:path');
const express = require('express');
const { melbdata } = require(path.join(process.env.ROOT, 'loaddata.js'))

const router = express.Router();

melbdata.then((melbdataData) => {
    router.get('/', (_, res) => {
        // console.log(req.headers)
        res.json({
            features: melbdataData[0],
            data: melbdataData.slice(1, melbdataData.length)
        })
    });

})

module.exports = router;