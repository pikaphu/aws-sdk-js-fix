// Generated by CoffeeScript 1.12.3
(function() {
  var AWS, formatData, helpers, inputCase, outputCase, protocols, setupTests, sortQS, tests, util;

  helpers = require('../helpers');

  AWS = helpers.AWS;

  util = AWS.util;

  sortQS = function(body) {
    return util.queryParamsToString(AWS.util.queryStringParse(body));
  };

  protocols = {
    ec2: {
      input: require('../fixtures/protocol/input/ec2'),
      output: require('../fixtures/protocol/output/ec2')
    },
    json: {
      input: require('../fixtures/protocol/input/json'),
      output: require('../fixtures/protocol/output/json')
    },
    query: {
      input: require('../fixtures/protocol/input/query'),
      output: require('../fixtures/protocol/output/query')
    },
    'rest-json': {
      input: require('../fixtures/protocol/input/rest-json'),
      output: require('../fixtures/protocol/output/rest-json')
    },
    'rest-xml': {
      input: require('../fixtures/protocol/input/rest-xml'),
      output: require('../fixtures/protocol/output/rest-xml')
    }
  };

  tests = function(svcName) {
    setupTests(svcName, 'input');
    return setupTests(svcName, 'output');
  };

  setupTests = function(svcName, type) {
    beforeEach(function() {
      return helpers.spyOn(AWS.util.uuid, 'v4').andReturn('00000000-0000-4000-8000-000000000000');
    });
    return describe(svcName, function() {
      return describe(type, function() {
        var values;
        values = protocols[svcName][type];
        return values.forEach(function(group) {
          return describe(group.description, function() {
            var api, svc;
            api = {
              metadata: group.metadata,
              operations: [],
              shapes: group.shapes
            };
            group.cases.forEach(function(_case, i) {
              _case.op = 'case' + (i + 1);
              return api.operations[_case.op] = _case.given;
            });
            svc = new AWS.Service({
              endpoint: group.clientEndpoint || 'http://localhost',
              apiConfig: api
            });
            return group.cases.forEach(function(_case, i) {
              return it(_case.op, function() {
                if (type === 'input') {
                  return inputCase(svc, _case, i);
                } else {
                  return outputCase(svc, _case, i);
                }
              });
            });
          });
        });
      });
    });
  };

  inputCase = function(svc, _case, i, done) {
    var data, dataUrl, k, params, ref, req, reqUrl, results, v;
    params = formatData(_case.params, svc.api.operations[_case.op].input);
    req = svc[_case.op](params);
    req.build();
    data = _case.serialized;
    reqUrl = util.urlParse(req.httpRequest.path);
    dataUrl = util.urlParse(data.uri);
    expect(reqUrl.pathname).to.equal(dataUrl.pathname);
    expect(util.queryStringParse(reqUrl.query)).to.eql(util.queryStringParse(dataUrl.query));
    if (svc.api.protocol === 'query' || svc.api.protocol === 'ec2') {
      expect(sortQS(req.httpRequest.body)).to.equal(sortQS(data.body));
    } else if (svc.api.protocol.match(/(json|xml)/)) {
      if (req.httpRequest.body === '{}') {
        req.httpRequest.body = '';
      }
      if (data.body === undefined) {
        data.body = '';
      }
      expect(req.httpRequest.body.replace(/\s+/g, '')).to.equal(data.body.replace(/\s+/g, ''));
    } else {
      expect(req.httpRequest.body).to.equal(data.body);
    }
    if (data.headers) {
      ref = data.headers;
      results = [];
      for (k in ref) {
        v = ref[k];
        results.push(expect(req.httpRequest.headers[k]).to.eql(v));
      }
      return results;
    }
    if (data.host) {
      expect(req.httpRequest.endpoint.hostname).to.equal(data.host);
    }
  };

  outputCase = function(svc, _case, i, done) {
    var expectedData, k, req, resp, resultData, results, v;
    resp = _case.response;
    helpers.mockHttpResponse(resp.status_code, resp.headers || {}, resp.body);
    req = svc[_case.op](_case.params);
    req.send();
    expectedData = formatData(_case.result, svc.api.operations[_case.op].output);
    resultData = formatData(req.response.data, svc.api.operations[_case.op].output);
    results = [];
    for (k in expectedData) {
      v = expectedData[k];
      results.push(expect(resultData[k]).to.eql(v));
    }
    return results;
  };

  formatData = function(data, shape) {
    var item, j, key, len, member, params, result, value;
    if (data === null || data === void 0) {
      return data;
    }
    if (shape.type === 'structure') {
      params = {};
      for (key in data) {
        value = data[key];
        member = shape.members[key];
        if (member) {
          result = formatData(value, member);
          if (result !== void 0) {
            params[key] = result;
          }
        }
      }
      return params;
    } else if (shape.type === 'list') {
      params = [];
      for (j = 0, len = data.length; j < len; j++) {
        item = data[j];
        result = formatData(item, shape.member);
        if (result !== void 0) {
          params.push(result);
        }
      }
      return params;
    } else if (shape.type === 'map') {
      params = {};
      for (key in data) {
        result = formatData(data[key], shape.value);
        if (result !== void 0) {
          params[key] = result;
        }
      }
      return params;
    } else if (shape.type === 'binary') {
      return data.toString();
    } else if (shape.type === 'timestamp') {
      return shape.toType(data);
    } else if (shape.type === 'integer') {
      return shape.toType(data);
    } else if (shape.type === 'float') {
      return shape.toType(data);
    } else if (shape.type === 'boolean') {
      return shape.toType(data);
    } else {
      return data;
    }
  };

  describe('AWS protocol support', function() {
    tests('ec2');
    tests('query');
    tests('json');
    tests('rest-json');
    tests('rest-xml');
  });

}).call(this);
