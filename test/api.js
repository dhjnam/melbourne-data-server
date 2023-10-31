process.env.NODE_ENV = 'test';
const dotenv = require('dotenv')
dotenv.config({
    path: __dirname + '/../config/.env'
});
dotenv.config({
    path: __dirname + `/../config/.env.${process.env.NODE_ENV}`,
    override: true

});
const root = process.env.ROOT;

const path = require('node:path');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);

describe('test melbdata', () => {

    before((done) => {
        const server = require(path.join(root, 'index.js'));
        setTimeout(() => { done(); }, 50);
    });
    
    after((done) => {
        server.close();
        done();
    });
    
    describe('/GET melbdata', () => {
        
        it('it GETs the melbdata and causes no errors', (done) => {
            chai.request(server)
                .get('/melbdata')
                .end((err, res) => {
                    expect(err).to.equal(null);
                    expect(res).to.have.status(200);
                    done();
            });
        });
        it('it has correct res body', (done) => {
            chai.request(server)
                .get('/melbdata')
                .end((_, res) => {
                    expect(res.body).to.have.all.keys(['features', 'data']);
                    expect(res.body.data).to.have.lengthOf(13580);
                    [
                        'Suburb',      'Address',  'Rooms',        'Type',
                        'Price',       'Method',   'SellerG',      'Date',
                        'Distance',    'Postcode', 'Bedroom2',     'Bathroom',
                        'Car',         'Landsize', 'BuildingArea', 'YearBuilt',
                        'CouncilArea', 'Latitude', 'Longitude',    'Regionname',
                        'Propertycount',
                    ].forEach((feature) => {
                        expect(res.body.features).to.be.an('array').that.includes(feature)
                    })
                    done();
                });
        });
 
    });

    describe('/GET geojson', () => {

        it('GETs the geojson data and causes no errors', (done) => {
            chai.request(server)
                .get('/geojson')
                .end((err, res) => {
                    expect(err).to.equal(null);
                    done();
                });
        });

    });
    it('it has correct geojson', (done) => {
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
});
