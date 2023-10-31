let chai = require('chai');
let chaiHttp = require('chai-http');
// let should = chai.should();
let { expect } = chai;

const config = require(__dirname + '/../config/test.json');
const root = config.ROOT;
const port = config.PORT;

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);

describe('test melbdata', () => {

    before((done) => {
        const server = require(root + '/index.js');
        done();
    });
    
    after((done) => {
        server.close();
        done();
    });
    
    describe('/GET melbdata', () => {
        
        it('it should GET the melbdata and cause no errors', (done) => {
            chai.request(server)
                .get('/melbdata')
                .end((err, res) => {
                    expect(err).to.equal(null);
                    expect(res).to.have.status(200);
                    done();
            });
        });
        it('it should have correct res body', (done) => {
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
});