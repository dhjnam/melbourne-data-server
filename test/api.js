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
const port = process.env.PORT;

const path = require('node:path');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);

describe('test melbdata', () => {

    before((done) => {
        const server = require(path.join(root, 'index.js'));
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