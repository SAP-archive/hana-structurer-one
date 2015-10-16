/*
 * Author: Ralph Oliveira
 * Date: 5 Feb 2015
 * Description:
 *      This file loads data into the b1 page (sapb1.html)
 **/

var lastId;
var	lastSentId;

var lasTweetsURI = '../SAPB1/Odata/counts.xsodata/Tweets?&$format=json&$orderby=Id%20desc';
var	donutURI = '../SAPB1/Odata/tops.xsodata/Topic?&$format=json&$orderby=MENTIONS%20desc';
var mapURI = '../SAPB1/Odata/tops.xsodata/Location?&$format=json';
var bar1URI = '../SAPB1/Odata/tops.xsodata/People?$format=json&$orderby=MENTIONS%20desc' // 1 Dimension





$(document).ready(function(){  
	// Connect Button (on modal window)

	$("#tweetDetails").click(function(){
 		var tweetId = $(this).data('id');
 		getTweetDetails(tweetId);
	});

	$("#lastTweetDetails").click(function(){
 		var tweetId = $(this).data('id');
 		getTweetDetails(tweetId);
	});

});

 $(function() {
 	"use strict";

    //If window is small enough, enable sidebar push menu
    if ($(window).width() <= 992) {
        $('.row-offcanvas').toggleClass('active');
        $('.left-side').removeClass("collapse-left");
        $(".right-side").removeClass("strech");
        $('.row-offcanvas').toggleClass("relative");
    } else {
        //Else, enable content streching
        $('.left-side').toggleClass("collapse-left");
        $(".right-side").toggleClass("strech");
    }

 	loadBoxes();
 	setInterval("loadBoxes();",3000); 

 	loadDonut(donutURI,14);
    loadBarChart1(bar1URI, 40, 'bar-chart');
    loadMap(mapURI);

    loadRandomTweet();
   	setInterval("loadRandomTweet();",8000); 

   	loadLastTweet();
   	setInterval("loadLastTweet();",3000); 




    $('#tweet-box').slimScroll({
        height: '300px'
    });


    loadLastTweets(lasTweetsURI, "#tweet-box", 8, true);
    setInterval("loadLastTweets('"+lasTweetsURI+"','#tweet-box',1,false);",750); 

    
    //Make the dashboard widgets sortable Using jquery UI
    $(".connectedSortable").sortable({
    	placeholder: "sort-highlight",
    	connectWith: ".connectedSortable",
    	handle: ".box-header, .nav-tabs",
    	forcePlaceholderSize: true,
    	zIndex: 999999
    }).disableSelection();
    $(".box-header, .nav-tabs").css("cursor","move");    

});

function loadBoxes(){


	// Box1
	$.get( '../SAPB1/Odata/counts.xsodata/Tweets/$count', function() {
		// if success do something
	})
	
	.done(function(json) {		
		refreshBox("#box1",json);
	})

	.fail(function() {
		$("#box1").append(
			'ERROR');	
	});

	// Box2
	$.get( '../SAPB1/Odata/counts.xsodata/Sentiments?&$format=json', function() {
		// if success do something
	})
	
	.done(function(json) {
		var sentiments = 0;

		for (var i=0;i<json.d.results.length;i++){
			sentiments+= parseInt(json.d.results[i].COUNTS);
		}

		refreshBox("#box2",sentiments);
	})

	.fail(function() {
		$("#box2").append(
			'ERROR');	
	});
	
	// Box3
	$.get( '../SAPB1/Odata/tops.xsodata/Location/$count', function() {
		// if success do something
	})
	
	.done(function(json) {		
		refreshBox("#box3",json);
	})

	.fail(function() {
		$("#box3").append('ERROR');	
	});
	
	// Box4
		$.get( '../SAPB1/Odata/counts.xsodata/Users?&$format=json', function() {
		// if success do something
	})
	
	.done(function(json) {
		refreshBox("#box4",json.d.results[0].COUNTS);
	})


	.fail(function() {
		$("#box4").append('ERROR');	
	});

}


function loadRandomTweet()
{	
	//Bar chart 2
	var jsonArr = [];
	var records = 10;
	var i = 0;

	var randomTweet = "";
	var id;


	$.get( '../SAPB1/Xsjs/b1Sentiment.xsjs?cmd=random&top=1', function(json) {
		
		var image = json.data[i].ProfileImg;
		var link = 'http://twitter.com/'+json.data[i].UserName;
		var tweet = link+'/status/'+ json.data[i].Id;
		var username = json.data[i].UserName;
		var text = json.data[i].Text;
		var location = json.data[i].Location;
		var type = json.data[i].Type;
		var	color = "green";
		id = json.data[i].Id;

		if (type.indexOf("Negative")>=0){
			color = "red"
		}

		randomTweet = 
				'<img src="'+image+'" alt="user image" class="img-circle">' + 
                    '<p class="lead message">' + 
                        '<a href="'+tweet+'" class="name" target="_blank">' + 
                            '<small class="text-muted pull-right"><i class="fa fa-map-marker"></i> '+location+'</small></a>'+
                            '<a href="'+link+'" class="name">' + 
                            username+'</a>'+text+'</p>'+ 
                    '<p class="lead pull-right"> '+type+ 
                        ' <i class="fa fa-square text-'+color+'"></i>'+
                    '</p>' 
                   

		})
	.done(function(json) {
		refreshRandom("#randomSentiment", randomTweet, id, "#tweetDetails");
	})
	
	.fail(function() {
		console.log("Error loading randomSentiment");	

	});
	
}

function loadLastTweet()
{	
	//Bar chart 2
	var jsonArr = [];
	var records = 10;
	var i = 0;

	var randomTweet = "";
	var id;


	$.get( '../SAPB1/Xsjs/b1Sentiment.xsjs?cmd=last&top=1', function(json) {
		
		var image = json.data[i].ProfileImg;
		var link = 'http://twitter.com/'+json.data[i].UserName;
		var tweet = link+'/status/'+ json.data[i].Id;
		var username = json.data[i].UserName;
		var text = json.data[i].Text;
		var location = json.data[i].Location;
		var type = json.data[i].Type;
		var	color = "green";
		id = json.data[i].Id;

		if (type.indexOf("Negative")>=0){
			color = "red"
		}

		randomTweet = 
				'<img src="'+image+'" alt="user image" class="img-circle">' + 
                    '<p class="lead message">' + 
                        '<a href="'+tweet+'" class="name" target="_blank">' + 
                            '<small class="text-muted pull-right"><i class="fa fa-map-marker"></i> '+location+'</small></a>'+
                            '<a href="'+link+'" class="name">' + 
                            username+'</a>'+text+'</p>'+ 
                    '<p class="lead pull-right"> '+type+ 
                        ' <i class="fa fa-square text-'+color+'"></i>'+
                    '</p>' 
                   

		})
	.done(function(json) {
		if (id != lastSentId){
			refreshRandom("#lastSentiment", randomTweet, id, "#lastTweetDetails");
		}
		lastSentId = id;

	})
	
	.fail(function() {
		console.log("Error loading randomSentiment");	

	});
	
}


function refreshBox(boxId, json){
	
	var actValue =  $(boxId).text();
	
	if (actValue == json){
		return;
	}

	$(boxId).fadeOut('slow', function() {
		$(boxId).empty();
		$(boxId).prepend(json);
		$(boxId).fadeIn('slow');
	});
}

function refreshRandom(boxId, json, tweetId, buttonId){
	
	var actValue =  $(boxId).text();
	
	if (actValue == json){
		return;
	}

	$(boxId).fadeOut('slow', function() {
		$(boxId).contents(':not(button)').remove();
		$(boxId).prepend(
			json);
		
		$(buttonId).data('id', tweetId);
		$(boxId).fadeIn('slow');
	});
}


function getTweetDetails(tweetID){

	var tbody = "";

	var jsonArr = [];
	$.get('../SAPB1/Xsjs/b1TA.xsjs?Id='+tweetID, function(json) {
	})
	.done(function(json) {
		$('#tablebody').find("tr").remove();


		for (var i = 0; i < json.data.length; i++) {
			tbody += 
				"<tr>"+
				"<td>"+(i+1)+"</td>"+
				"<td>"+json.data[i].TA_TOKEN+"</td>"+
				"<td>"+json.data[i].TA_TYPE+"</td>"+
				"</tr>";
		}

		$("#tweetDetailsTable tbody").append(tbody);
		$('#tweetDetailsModal').modal('show');

	})
	
	.fail(function() {
		tbody = "Error loading Donut chart";	
	});

	return(tbody);

}






