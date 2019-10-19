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

const getResentTweets = function (req, res) {
    console.log(req.query);
    console.log("Query param = ", req.query['twitter_screen_name']);
    let params = {screen_name: req.query['twitter_screen_name']};
    twitter_client.get('statuses/home_timeline', params, function (error, tweets, response) {
        if (!error) {
            console.log(tweets);
            return res.status(200).json(tweets);
        } else {
            console.log("Error ", error);
            return res.status(500).send({error: JSON.stringify(error)});
        }
    });
} 
app.get('/recent_tweets', getResentTweets);

const postTweet = function (req, res) {
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
}
app.post('/post_tweet', postTweet);

const postFavTweet = function (req, res) {
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
        }
        console.log(tweet);  // Tweet body.        console.log(tweet);  // Tweet body.

        return res.status(200).json(tweet);
    });
}
app.post('/post_favorites', postFavTweet);

const postFavDestroy = function (req, res) {
    console.log("ID for the post to mark as fav", req.params.id);

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

            console.log("Got error in post fav", error);
            return res.status(500).send({error: JSON.stringify(error)});
        }
        console.log(tweet);  // Tweet body.
        return res.status(200).json(tweet);
    });

    
}
app.post('/post_favoritesDestroy', postFavDestroy);

const getFavList = function (req, res) {

    twitter_client.get('favorites/list', {}, function (error, tweets, response) {
        if (!error) {
            console.log(tweets);
            return res.status(200).json(tweets);
        } else {
            console.log("Error ", error);
            return res.status(500).send({error: JSON.stringify(error)});
        }
    });

}
app.get('/fav_list', getFavList);

app.get('/retweets/:id', function (req, res) {
    var retweetid = req.params.id;
    console.log(req.params.id);
    twitter_client.get('statuses/retweets', {id : retweetid}, function(error, tweets, response) {
      if(error){
        console.log(error);
        return res.status(500).send({error : JSON.stringify(error)});
      }
      if (!error) {
        console.log(tweets);  
        return res.status(200).json(tweets);
      }
    });
})

app.listen(3001, function () {
    console.log('Twitter Ninjas app listening on port 3001!');
});




module.exports = {
    getResentTweets,
    postFavTweet,
    getFavList,
    postFavDestroy
}

