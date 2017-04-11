//Load Twitter node Libraries
var util    = require('util'),
    twitter = require('twitter'),
    prompt  = require('prompt'),
    hdb     = require('hdb');

var toFile = false;
var keyword = '#iMiniServer'; // Only applicable if toFile = true


//Log on twitter
var twit = new twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
});

//Create Hana Client
var client = hdb.createClient({
    host     : 'hanab1',
    port     : 30015,
    user     : 'SYSTEM',
    password : 'manager'
});  


// Start Application
if(toFile){
    streamTweets(keyword)
}else{
    //start();
    streamTweets(keyword)

}

//Stream tweets in real time;
function streamTweets(keyword){


    if(!toFile){
        console.log('--============================================');
        console.log('--STREAMING TWEETS FOR: ' + keyword);
        console.log('--============================================');
    }
    
    //connectHdb(false);


    twit.stream('statuses/filter',{track: keyword}, function(stream) {
        stream.on('data', function(data) {
            var id_str = util.inspect(data.id_str);
            var screen_name = util.inspect(data.user.screen_name);
            var text = util.inspect(data.text);
            var profile_image_url = util.inspect(data.user.profile_image_url);              
            var created_at = util.inspect(data.created_at);
            var followers_count = util.inspect(data.user.followers_count);
            var lang = util.inspect(data.lang);
            var location = util.inspect(data.user.location);
            var geo = util.inspect(data.geo);
            var coordinates = util.inspect(data.coordinates);
            
            text = text.replace(/'/g, " ");
            text = "'"+text.trim()+"'";
        //  var t = JSON.stringify(data);
        //  wstream.write(data);

            if(!toFile){
                console.log('Tweet ID: ' + id_str);
                console.log('User: @' + screen_name);
                console.log('Text: '+ text);
                console.log('Profile Pic: '+ profile_image_url);
                console.log('Date: '+ formatDate(created_at));
                console.log('Followers: '+ followers_count);
                console.log('Language: '+ lang);
                console.log('Location: '+ location);
                console.log('Geo: '+ geo);
                console.log('Coordinates: '+ coordinates);
                console.log('---------------------------');
            }

            // Exclude retweets
            if (text.search("RT @")== -1){
              saveTweet(id_str, screen_name, profile_image_url, followers_count, text,keyword, lang, location, formatDate(created_at));
            }           
        });
        stream.on('error', function(err){
        console.log(err);
        });
    });
};


function saveTweet(id, user, pic, followers, text, kw, lang, loca, date){

    

    var sql = 'INSERT INTO "SUMMIT2015"."Summit15.data::alexatweets" values(';

    sql = sql.concat(id,',');
    sql = sql.concat(user,',');
    sql = sql.concat(pic,',');
    sql = sql.concat(followers,',');
    sql = sql.concat(text,',');
    sql = sql.concat("'",kw,"'",',');
    sql = sql.concat(lang,',');
    sql = sql.concat(loca,',');
    sql = sql.concat("'",date,"'",')');
    
    if (toFile){
        console.log(sql+';'); 
        return;      
    }
        
    
    
    connectHdb(false);
    
    client.exec(sql, function (err, affectedRows) {  

        if (err) {  
            return console.error('ERROR: ', err);  
        } 

        console.log('Tweet ' + id+ ' Inserted with success!'); 
        connectHdb(true); 
    });
    
    
    count = 0;
    sql = '';
    

};


function start(){
    prompt.start();
    prompt.get(['hashtag'], function (err, result) {
        if (err) { return onErr(err); }
        keyword = result.hashtag;
        streamTweets(keyword);
    });

};

function connectHdb(disconnect){

    if(disconnect){
        client.end();  
        return;
    }

    client.connect(function(err) {  
        if (err)   
            return console.error('Connect error', err);

    });  
    console.log("HDB Connected!");
};


function formatDate(strdate){
    // Return date with YYYY-MM-DD
    // Twitter date example 'Mon Jan 19 16:17:07 +0000 2015'
    // 'Mon Jan 19 16:17:07 +0000 2015'
    
    var day = strdate.substring(9,11);
    var month = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(strdate.substring(5,8)) / 3 + 1; 
    var year  = strdate.substring(strdate.length-5,strdate.length-1);
    
    /*  
    console.log(year);
    console.log(month);
    console.log(day);
    **/
    
    return(year+"-"+month+"-"+day);
}
