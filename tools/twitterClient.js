var Twitter = require('twitter');
const [consumerKey, consumerSecret, accessTokenKey, accessTokenSecret] = (process.env['TWITTER_KEYS'] || '').split(',');

const client = new Twitter({
  consumer_key: consumerKey,
  consumer_secret: consumerSecret,
  access_token_key: accessTokenKey,
  access_token_secret: accessTokenSecret
});

export default client;
