const { expect, assert } = require('chai');
const request = require('supertest');
const app = require('../app');
const prdApiConfig = require('../shared/ProductApiConfig');

describe('Product controller', () => {
    it('Get /api/product/:id get the product by id', (done) => {
        const id = 14;
        request(app)
        .get(`/api/product/${id}`)
        .end((err, res) => {
            // console.log(JSON.stringify(res, undefined, 2));
            expect(res.statusCode).is.equal(200);
            expect(err).to.be.null;
            done();
        });
    });

    it('Get /api/product/config get the configuration', (done) => {
        request(app)
        .get('/api/product/config')
        .end((err, res) => {
            expect(res.statusCode).is.equal(200);
            expect(err).to.be.null;
            expect(res.body.soldBarrierStatusRangeConfig).to.be.not.null;
            expect(res.body.soldBarrierStatusRangeConfig.max).to.be.a('Number');
            expect(res.body.soldBarrierStatusRangeConfig.min).to.be.a('Number');
            assert(res.body.soldBarrierStatusRangeConfig.max > 0);
            done();
        });
    });

    it('Get /api/product/statsconfig get the dynamic configuration by using aggregation', (done) => {
        const field = 'price';
        request(app)
        .get(`/api/product/statsconfig/${field}`)
        .end((err, res) => {
            expect(res.statusCode).is.equal(200);
            expect(err).to.be.null;
            expect(res.aggregation).to.be.not.null;
            done();
        });
    });

    it('Post /api/product/name get products by name', (done) => {
        request(app)
        .post('/api/product/name')
        .send({ name: 'boTtle' })
        .end((err, res) => {
            // console.log(JSON.stringify(res, undefined, 2));
            expect(res.statusCode).is.equal(200);
            expect(err).to.be.null;
            done();
        });
    });

    it('Post /api/product/search search a product', (done) => {
        request(app)
        .post('/api/product/name')
        .send({ name: 'boTtle' })
        .end((err, res) => {
            // console.log(JSON.stringify(res.body, undefined, 2));
            expect(res.statusCode).is.equal(200);
            expect(err).to.be.null;
            done();
        });
    });

    it('Post /api/product/search search products by criteria (fuzziness)', (done) => {
        request(app)
        .post('/api/product/search')
        .send({
            query: {
                searchText: 'loster',
                options: prdApiConfig.enumSearchOptions.isSearchFuzzy
            }
        })
        .end((err, res) => {
            // console.log(JSON.stringify(res.body, undefined, 2));
            expect(res.statusCode).is.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.be.not.empty;
            expect(err).to.be.null;
            done();
        });
    });

    it('Post /api/product/search search products by criteria (price, active, inStock .. etc)', (done) => {
        request(app)
        .post('/api/product/search')
        .send({
            query: {
                searchText: 'wine',
                range: [0, 1000],
                isActive: true,
                isInStock: true,
                isBestSeller: true,
                options: prdApiConfig.enumSearchOptions.isSearchExactMatch
            }
        })
        .end((err, res) => {
            // console.log(JSON.stringify(res.body, undefined, 2));
            expect(res.statusCode).is.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.be.not.empty;
            expect(err).to.be.null;
            done();
        });
    });
});
