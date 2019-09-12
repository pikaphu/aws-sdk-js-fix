// Generated by CoffeeScript 1.12.3
(function() {
  var AWS, helpers;

  helpers = require('../helpers');

  AWS = helpers.AWS;

  describe('AWS.CloudSearchDomain', function() {
    var cds, request;
    cds = void 0;
    request = function(operation, params) {
      return cds.makeRequest(operation, params);
    };
    beforeEach(function() {
      return cds = new AWS.CloudSearchDomain({
        endpoint: 'host.region.domain'
      });
    });
    describe('constructor', function() {
      it('fails if there is no provided endpoint', function() {
        var e, err;
        err = {};
        try {
          new AWS.CloudSearchDomain;
        } catch (error) {
          e = error;
          err = e;
        }
        return expect(err.name).to.equal('InvalidEndpoint');
      });
      it('fails if the endpoint is a template', function() {
        var e, err;
        err = {};
        try {
          new AWS.CloudSearchDomain({
            endpoint: '{region}.domain'
          });
        } catch (error) {
          e = error;
          err = e;
        }
        return expect(err.name).to.equal('InvalidEndpoint');
      });
      return it('allows explicit endpoint', function() {
        return expect(function() {
          return new AWS.CloudSearchDomain({
            endpoint: 'host.domain'
          });
        }).not.to['throw']();
      });
    });
    return describe('building a request', function() {
      var build;
      build = function(operation, params) {
        return request(operation, params).build().httpRequest;
      };
      it('updates region by parsing hostname', function() {
        var params, req;
        params = {
          query: 'foo'
        };
        req = build('search', params);
        return expect(req.region).to.equal('region');
      });
      it('falls back to configured region when hostname cannot be parsed', function() {
        var params, req;
        cds.endpoint.hostname = 'host';
        params = {
          query: 'foo'
        };
        req = build('search', params);
        return expect(req.region).to.equal('mock-region');
      });
      it('does NOT sign request if credentials are NOT provided', function() {
        var params, req;
        cds.config.credentials = null;
        cds.config.credentialProvider = null;
        params = {
          query: 'foo'
        };
        req = build('search', params);
        return expect(req.headers).not.to.have.property('Authorization');
      });
      it('signs request if credentials are provided', function() {
        var params, req;
        params = {
          query: 'foo'
        };
        req = build('search', params);
        return expect(req.headers).to.have.property('Authorization');
      });
      it('converts the GET request to POST for search operation', function() {
        var params, req;
        params = {
          query: 'foo'
        };
        req = build('search', params);
        expect(req.method).to.equal('POST');
        expect(req.path.indexOf('?')).to.equal(-1);
        expect(typeof req.body).to.equal('string');
        return expect(req.headers['Content-Length']).to.equal(req.body.length);
      });
      return it('keeps the suggest operation as a GET request', function() {
        var params, req;
        params = {
          query: 'foo',
          suggester: 'bar'
        };
        req = build('suggest', params);
        expect(req.method).to.equal('GET');
        expect(req.path.split('?')[1]).to.equal('format=sdk&pretty=true&q=foo&suggester=bar');
      });
    });
  });

}).call(this);