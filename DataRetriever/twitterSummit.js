//Load Twitter node Libraries
var util = require("util"),
	twitter = require('twitter-stream-channels'),
	hdb = require('hdb');

//Twitter credentials
var credentials = {
	consumer_key: process.env.TWITTER_KEY || "< Your Consumer Key > ",
	consumer_secret: process.env.TWITTER_SECRET || "< Your Consumer Secret > ",
	access_token: process.env.TWITTER_TOKEN || "< Your Token> ",
	access_token_secret: process.env.TWITTER_TOKEN_SECRET || "< Your Token Secret KEY> "
}

//Twitter Search Channels
var channels = {
	"news": ['#news', '#noticias', '#nouvelles'],
	"brands": ['@Starbucks', '@Amazon', '@Target', '@BestBuy'],
	"erp": ['#SAPBusinessOne','SAPB1'],
	"alexa": ['iMiniServer'],
};

var twit = new twitter(credentials);

//Create Hana Client
var client = hdb.createClient({
	host: process.env.HDB_ADDR || '< Your HDB ADDRESS >',
	port: process.env.HDB_PORT || '< Your HDB PORT >',
	user: process.env.HDB_USER || '< Your HDB USER >',
	password: process.env.HDB_PSWD || '< Your HDB PASSWORD >'
});



var stream = twit.streamChannels({ track: channels });

connectHdb(false, function () {
	// Only stream if HANA is available
	stream.on('channels', function (tweet) {
		saveTweet(tweet)
	});
});

process.stdin.resume()

process.on('exit', exitHandler.bind());
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind());
// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind());
process.on('SIGUSR2', exitHandler.bind());

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind());

function exitHandler(options, err) {

	console.log('clean')
	stream.close()
	connectHdb(false);
}

function saveTweet(tweet) {

	if (tweet.text.search("RT @") != -1) {
		console.log("Retweet Ignored")
		return
	} else {

		var values = '';
		var channel = Object.keys(tweet["$channels"])

		//Format some values
		channel = channel[0]
		tweet.text = tweet.text.replace(/'/g, " ");
		tweet.created_at = formatDate(tweet.created_at)

		values = values.concat(util.inspect(tweet.id_str), ',');
		values = values.concat(util.inspect(tweet.user.screen_name), ',');
		values = values.concat(util.inspect(tweet.user.profile_image_url), ',');
		values = values.concat(tweet.user.followers_count, ',');
		values = values.concat(util.inspect(tweet.text), ',');
		if (channel == "brands"){
			var brand = tweet['$keywords'][0]
			brand = brand.toLowerCase()
			values = values.concat(util.inspect(brand), ',');	
		}else{
			values = values.concat(util.inspect(channel), ',');
		}
		
		
		values = values.concat(util.inspect(tweet.lang), ',');
		values = values.concat(util.inspect(tweet.user.location), ',');
		values = values.concat(util.inspect(tweet.created_at), ')');

		console.log('>' + channel, tweet.user.screen_name);
		console.log('>' + channel, tweet.text);

		var sql = 'INSERT INTO "SUMMIT2015"."Summit15.data::'

		switch (channel) {
			case "news":
				sql += "tweets"
				break
			case "brands":
				sql += "tweetsb"
				break
			case "erp":
				sql += "sapb1tweets"
				break
			case "alexa":
				sql += "alexatweets"
				break
			default:
				console.error("No Channel Found, tweet ignored")
				return;

		}

		sql += '" values(' + values

		client.exec(sql, function (err, affectedRows) {

			if (err) {
				return console.error('ERROR: ', err);
			}
			console.log('Tweet Inserted with success!');
		});
	};
}


function connectHdb(disconnect, callback) {

	if (disconnect) {
		client.end();
	} else {
		client.connect(function (err) {
			if (err) {
				console.error('Connect error', err);
			} else {
				callback()
			}
		});
		console.log("HDB Connected!");
	}
};

function formatDate(strdate) {
	// Return date with YYYY-MM-DD
	// Twitter date example 'Mon Jan 19 16:17:07 +0000 2015'
	// 'Mon Jan 19 16:17:07 +0000 2015'
	var day = strdate.substring(9, 11);
	if (day < 10) { day = "0" + day }
	var month = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(strdate.substring(4, 7)) / 3 + 1;
	if (month < 10) { month = "0" + month }
	var year = strdate.substring(strdate.length - 4, strdate.length);
	var date = year + "-" + month + "-" + day
	return date.trim();
}
