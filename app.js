//This repo is now being tracked with jenkins
//Another Change to test this
//One more time

let express = require('express');
let cors = require('cors');
require('dotenv').config();
const app = express();
let Twitter = require('twitter');


const twitter_client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_API_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_API_SECRET_KEY,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}); 
 
app.use(express.json());
app.use(cors())
//Define request response in root URL (/)
app.get('/', function (req, res) {
    res.send('Hello World')
})

//Mayuri Bhise
//To get the recent tweets
app.get('/recent_tweets', function (req, res) {
    console.log(req.query);
    console.log("Query param = ", req.query['twitter_screen_name']);
    let params = {screen_name: req.query['twitter_screen_name']};
    twitter_client.get('statuses/home_timeline', params, function (error, tweets, response) {
        if (!error) {
            //console.log(tweets);
            return res.status(200).json(tweets);
        } else {
            console.log("Error ", error);
            return res.status(500).send({error: JSON.stringify(error)});
        }
    });
});

//Mayuri Bhise
//To post a tweet
app.post('/post_tweet', function (req, res) {
    console.log("REQUEST BODY ", req.body);
    if (!req.body || !req.body.hasOwnProperty('tweet_text')) {
        return res.status(400).send({error_message: "tweet_text missing in body"});
    } else if (req.body.tweet_text == null || req.body.tweet_text == undefined || req.body.tweet_text.length === 0)
        return res.status(400).send({error_message: "tweet_text cannot be empty"});

    twitter_client.post('statuses/update', {status: req.body.tweet_text}, function (error, tweet, response) {
        if (error) {
            return res.status(500).send({error: JSON.stringify(error)});
        }
        console.log(tweet);  // Tweet body.
        return res.status(200).json(tweet);
    });
});

//Rashmi Sarode
//post_favorites api will like the tweet
app.post('/post_favorites', function (req, res) {
    //console.log("ID for the post to mark as fav", req.params.id);

    var postID = req.body;

    if (postID.tweet_id == null || postID.tweet_id == undefined ) {
        return res.status(400).send("Bad Request: Invalid Post ID");
    } else  if (!postID || !postID.hasOwnProperty('tweet_id')) {
        return res.status(400).send({error_message: "tweet_id missing in body"});
    }

    twitter_client.post('favorites/create', {id: postID.tweet_id}, function (error, tweet, response) {
//        console.log('Response', response);
        if (error) {
            if(error.length>0) {
                var errorObj = error[0];
                if (errorObj.code == 139) {
                    return res.status(200).send("Already Liked "+errorObj.message);                    
                }    
            }

            console.log("Got error in post fav", error);
            return res.status(500).send({error: JSON.stringify(error)});
        } else {
            // Tweet body.
            return res.status(200).json(tweet);    
        }
    });

    
});


//Rashmi Sarode
//post_favoritesDestroy api will unlike the tweet
app.post('/post_favoritesDestroy', function (req, res) {
    //console.log("ID for the post to mark as fav", req.params.id);

    var postID = req.body;
    if (postID.tweet_id == null || postID.tweet_id == undefined ) {
        return res.status(400).send("Bad Request: Invalid Post ID");
    } else  if (!postID || !postID.hasOwnProperty('tweet_id')) {
        return res.status(400).send({error_message: "tweet_id missing in body"});
    }

    twitter_client.post('favorites/destroy', {id: postID.tweet_id}, function (error, tweet, response) {
//        console.log('Response', response);
        if (error) {
            if(error.length>0) {
                var errorObj = error[0];
                if (errorObj.code == 139) {
                    return res.status(200).send("Already Disliked "+errorObj.message);                    
                }    
            }

            //console.log("Got error in post fav", error);
            return res.status(500).send({error: JSON.stringify(error)});
        }
        //console.log(tweet);  // Tweet body.
        return res.status(200).json(tweet);
    });

    
});

//Rashmi Sarode
//To get the count of tweet likes
app.get('/fav_list', function (req, res) {

    twitter_client.get('favorites/list', {}, function (error, tweets, response) {
        if (!error) {
            //console.log(tweets);
            return res.status(200).json(tweets);
        } else {
            //console.log("Error ", error);
            return res.status(500).send({error: JSON.stringify(error)});
        }
    });

});

//Sneha Patil
//To search the tweets based on user input
app.get('/searchTweets/:query', function (req, res) {
    var params = req.params.query;
    console.log(params);
    twitter_client.get('search/tweets', {q: params}, function(error, tweets, response) {
      if(error){
        console.log(error);
        return res.status(500).send({error : JSON.stringify(error)});
      }
      if (!error) {
        //console.log(tweets.statuses);
        return res.status(200).json(tweets.statuses);
      }
    });
  })

//Sneha Patil
//To get the specific tweet by TweetId
app.get('/tweet', function (req, res) {
      var id = req.query.id;
      console.log(req.query.id);
      twitter_client.get('statuses/show/'+ id, function(error, tweets, response) {
        if(error){
          console.log(error);
          return res.status(500).send({error : JSON.stringify(error)});
        }
        if (!error) {
          return res.status(200).json(tweets);
        }
      });
})
  
  
//Sneha Patil
//To delete the tweet  
app.post('/destroyTweet/:id', function (req, res) {
    const id= req.params.id;
    if (id == null || id == undefined ) {
      return res.status(400).send("Bad Request: Invalid Tweet Id");
    }
    twitter_client.post('statuses/destroy/'+ id, function(error, tweets, response) {
      if(error){
        console.log(error);
        return res.status(500).send({error : JSON.stringify(error)});
      }
      if (!error) {
        return res.status(200).json(tweets);
      }
    });
})
  
  
 //Indrayani Bhalerao
 //To Retweet a tweet
 app.post('/retweet/:id', function (req, res) {
    const id= req.params.id;
    twitter_client.post('statuses/retweet/'+ id, function(error, tweets, response) {
    if(error){
        console.log(error);
        return res.status(500).send({error : JSON.stringify(error)});
      }
      if (!error) {
        return res.status(200).json(tweets);
      } 
    });
})

//Indrayani Bhalerao
//To Unretweet a tweet
app.post('/unretweet/:id', function (req, res) {
    const id= req.params.id;
    twitter_client.post('statuses/unretweet/'+ id, function(error, tweets, response) {
      if(error){
        console.log(error);
        return res.status(500).send({error : JSON.stringify(error)});
      }
      if (!error) {
        return res.status(200).json(tweets);
      }
    });
})

//Indrayani Bhalerao
//To get most recent retweets of the tweet specified by id
app.get('/retweets/:id', function (req, res) {
    var retweetid = req.params.id;
    console.log(req.params.id);
    twitter_client.get('statuses/retweets', {id:retweetid}, function(error, tweets, response) {
      if(error){
        console.log(error);
        return res.status(500).send({error : JSON.stringify(error)});
      }
      if (!error) {
        //console.log(tweets);  
        return res.status(200).json(tweets);
      }
    });
  })



app.listen(3001, function () {
    console.log('Twitter Ninjas app listening on port 3001!');
});




