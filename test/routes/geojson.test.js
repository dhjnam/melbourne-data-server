const ROOT = process.env.ROOT;
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const SCHEME = process.env.SCHEME;

const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);

const testGeojson = () => {

    const server = `${SCHEME}://${HOST}:${PORT}`
    
    it('it GETs the geojson data and causes no errors', function(done) {
        chai.request(server)
            .get('/geojson')
            .end((err, res) => {
                expect(err).to.equal(null);
                expect(res).to.have.status(200);

                done();
            });
    });
    it('it has correct geojson', function(done) {
        chai.request(server)
            .get('/geojson')
            .end((_, res) => {
                let idx;
                const geojson = res.body;
                const features = geojson.features;
                idx = parseInt(Math.random() * features.length);
                const example = features[idx];
                const properties = example.properties;
                const geometry = example.geometry;
                const points = geometry.coordinates[0];
                idx = parseInt(Math.random() * points.length);
                const point = points[idx]
                expect(geojson).to.have.all.keys(['type', 'crs', 'features']);
                expect(example).to.have.all.keys(['geometry', 'properties', 'type']);
                expect(geometry).to.have.all.keys(['type', 'coordinates'])
                expect(geometry.type).to.equal('Polygon')
                expect(geometry.coordinates).to.lengthOf(1)
                expect(point).to.be.an('array').lengthOf(2)

                expect(properties).to.have.all.keys([
                    'SA1_CODE21', 'SA2_CODE21', 'SA3_CODE21', 'SA4_CODE21', 
                    'GCC_CODE21', 'AUS_CODE21', 'STE_CODE21',
                    'SA2_NAME21', 'SA3_NAME21', 'SA4_NAME21', 'GCC_NAME21', 
                    'STE_NAME21', 'AUS_NAME21',
                    'CHG_FLAG21', 'CHG_LBL21', 'AREASQKM21', 'LOCI_URI21'
                ]);

                done();
            });
    });
};

module.exports = testGeojson
