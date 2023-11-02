const path = require('node:path');
const express = require('express');
const _ = require('lodash');
const { melbdata } = require(path.join(process.env.ROOT, 'loaddata.js'))

const router = express.Router();

melbdata.then(melbdata => {
    router.get(
        '/', 
        getFeatures(melbdata), 
        getData(melbdata),
        sendJson
    );

})

// middleware
const getFeatures = melbdata => function(req, res, next) {
    req.app.locals.features = _.isEmpty(req.query) ? 
        melbdata.features :
        req.query['features'].split(',')
    next();
};

const getData = melbdata => function(req, res, next) {
    const featureIdxes = req.app.locals.features.map(
        feature => melbdata.features.indexOf(feature)
    );
    req.app.locals.data = melbdata.data.map(record => _.at(record, featureIdxes) )
    next();
}

const sendJson = function(req, res) {
    res.json({
        features: req.app.locals.features,
        data: req.app.locals.data
    });
}

module.exports = router;