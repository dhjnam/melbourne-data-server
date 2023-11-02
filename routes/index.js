const melbdata = require('./melbdata')
const geojson = require('./geojson')

module.exports = function(app) {

    app.use('/melbdata', melbdata)
    app.use('/geojson', geojson)

}
