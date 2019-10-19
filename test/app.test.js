const expect = require('chai').expect;
const nock = require('nock');
var request = require('request');

const axios = require('axios'); // for simplified post requests

require("../app.js")

it('Main page content', function (done) {
  request('http://localhost:3001', function (error, response, body) {
    expect(body).to.equal('Hello World');
    done();
  });
});


it('Check the Statuscode for searchTweet API with "health" as the parameter', function (done) {
  request('http://localhost:3001/searchTweets/health', function (error, response, body) {
    expect(response.statusCode).to.equal(200);
    done();
  });
});

it('Check the Statuscode for searchTweet API with "snehaninja" as the parameter', function (done) {
  request('http://localhost:3001/searchTweets/snehaninja', function (error, response, body) {
    //console.log(response.body);
    expect(response.statusCode).to.equal(200);

    const bodyJson = JSON.parse(response.body)

    expect(bodyJson.length).to.be.above(0);
    expect(bodyJson[0].text).to.equal('snehaninja');
    done();
  });
});

it('Check the Statuscode for destroyTweet API with incorrect id', function (done) {
  request('http://localhost:3001/destroyTweet/1', function (error, response, body) {
    expect(response.statusCode).to.equal(404);
    done();
  });
});



it('Check the Statuscode for post Fav API as Bad And Invalid ID', function (done) {

  var objJson = {
    tweet_id: 123456
  }
  var options = {
    method: 'POST',
    body: JSON.stringify(objJson)
  }

  request('http://localhost:3001/post_favorites', options, function (error, response, body) {
    expect(response.statusCode).to.equal(400);
    //console.log(response)
    const responseText = response.body
    expect(responseText).to.equal('Bad Request: Invalid Post ID');
    done();
  });
});


it('Check the Statuscode for post Fav API as Valid ID', function (done) {

  axios.post('http://localhost:3001/post_favorites', {
    "tweet_id": "1182801873054552064"
  })
    .then((res) => {
      console.log(`statusCode: ${res.statusCode}`)
      console.log(res)
      expect(res.statusCode).to.equal(200);
      done();
    })
    .catch((error) => {
      console.error(error)
      done();
    })

});


