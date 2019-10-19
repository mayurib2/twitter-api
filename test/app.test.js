const expect = require('chai').expect;
const nock = require('nock');
var request = require('request');

it('Main page content', function(done) {
  request('http://localhost:3001' , function(error, response, body) {
      expect(body).to.equal('Hello World');
      done();
  });
});


it('Check the Statuscode for searchTweet API with "health" as the parameter', function(done) {
  request('http://localhost:3001/searchTweets/health' , function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
  });
});

it('Check the Statuscode for searchTweet API with "health" as the parameter', function(done) {
  request('http://localhost:3001/searchTweets/snehaninja' , function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      expect(response.text).to.equal('snehaninja')
      done();
  });
});

it('Check the Statuscode for destroyTweet API with incorrect id', function(done) {
  request('http://localhost:3001/destroyTweet/1' , function(error, response, body) {
      expect(response.statusCode).to.equal(404);
      done();
  });
});
