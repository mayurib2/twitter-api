var getResentTweets = require('../app');
let http = require('http');
var postFavTweet = require('../app');
var postFavDestroy = require('../app');
var getFavList = require('../app')

// begin a test suite of one or more tests
describe('#sum()', function() {

    // add a test hook
    beforeEach(function() {
      // ...some logic before each test is run
    });

    const mockResponse = () => {
        const res = {};
         res.status = (code) =>  {
            res.statusCode=code;
            return res;
            };

         res.json = (jsonData) => {
            res.jsonData = jsonData;
            return res;
         };
         res.send = (error) =>  {
            res.error = error;
            return res;
         };
         return res;
    };
    

    it('Should post fav tweet', function() {
        const req = http.request({});

        var res = mockResponse();
        req.body = {
            "tweet_id": "1180364204424884224"
          }
        //postFavTweet.postFavTweet(req, res);

        console.log(res);
      // add an assertion
//      expect(sum(1, 2, 3, 4, 5)).to.equal(15);
    })
    
    // ...some more tests
    
  });
