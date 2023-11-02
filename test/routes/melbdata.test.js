const ROOT = process.env.ROOT;
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const SCHEME = process.env.SCHEME;

const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);

const testMelbdata = function() {

    const server = `${SCHEME}://${HOST}:${PORT}`
    
    it('it GETs the melbdata and causes no errors', function(done) {
        chai.request(server)
            .get('/melbdata')
            .end((err, res) => {
                expect(err).to.equal(null);
                expect(res).to.have.status(200);
                done();
        });
    });
    it('it has correct res body', function(done) {
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
    it('it allows only desired origins', function(done) {
        // this.skip();
        chai.request(server)
            .get('/melbdata')
            .set('origin', `${SCHEME}://${HOST}:12345`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(err).to.equal(null);
                done();
            })
    });
    it('it disallows undesired origins', function(done) {
        this.skip();
        chai.request(server)
            .get('/melbdata')
            .set({
                origin: 'http://disallowed.origin:12345/',
                host: `${HOST}:${PORT}`,
                connection: 'keep-alive',
                'sec-ch-ua': '"Chromium";v="118", "Brave";v="118", "Not=A?Brand";v="99"',
                accept: 'application/json, text/plain, */*',
                'sec-ch-ua-mobile': '?0',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
                'sec-ch-ua-platform': '"macOS"',
                'sec-gpc': '1',
                'accept-language': 'en-GB,en',
                'sec-fetch-site': 'same-site',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                referer: 'http://localhost:5173/',
                'accept-encoding': 'gzip, deflate, br',
            })
            .end((err, res) => {
                expect(res).not.to.have.status(200);
                done();
            })
    });

};

module.exports = testMelbdata