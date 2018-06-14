/*
 * Author: Ralph Oliveira
 * Date: 5 Feb 2015
 * Description:
 *      This file loads data into the main page (index.html)
 **/


$(function() {
    "use strict";

    loadBoxes();
    setInterval("loadBoxes();",3000); 

	loadDonut('amazon');
    loadDonut('bestbuy');
    loadDonut('starbucks');
    loadDonut('target');
    loadLastTweets('Positive');
    loadLastTweets('Negative');


    
    //Make the dashboard widgets sortable Using jquery UI
    $(".connectedSortable").sortable({
        placeholder: "sort-highlight",
        connectWith: ".connectedSortable",
        handle: ".box-header, .nav-tabs",
        forcePlaceholderSize: true,
        zIndex: 999999
    }).disableSelection();
    $(".box-header, .nav-tabs").css("cursor","move");    

    //bootstrap WYSIHTML5 - text editor
    $(".textarea").wysihtml5();
});

function loadBoxes(){
	
	var tweets = 0;
	
	// Box1
	$.get( '../Odata/counts.xsodata/Tweetsb/$count', function() {
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
	$.get( '../Odata/counts.xsodata/Sentiments?&$format=json', function() {
		// if success do something
	})
	.done(function(json) {
		for (var i=0;i<json.d.results.length;i++){
			tweets+= parseInt(json.d.results[i].COUNTS);
		}
		
		refreshBox("#box2",tweets);

				
	})

	.fail(function() {
		$("#box2").append(
				'ERROR');	
	});
	
	// Box3
	// 
	$.get( '../Odata/counts.xsodata/Sentiments?&$format=json&$'+
			'filter=SENTIMENT%20eq%20%27WeakPositiveSentiment%27%20or%20SENTIMENT%20eq%20%27StrongPositiveSentiment%27', function() {
		// if success do something
	})
	.done(function(json) {
		var total = 0;
		for (var i=0;i<json.d.results.length;i++){
			total+= parseInt(json.d.results[i].COUNTS);
		}
		//total = total/tweets*100;
		//total = Math.round(total);
		refreshBox("#box3",total);
	})

	.fail(function() {
		$("#box3").append(
				'ERROR');	
	});
	
	// Box4
	$.get( '../Odata/counts.xsodata/Sentiments?&$format=json&$'+
			'filter=SENTIMENT%20eq%20%27WeakNegativeSentiment%27%20or%20SENTIMENT%20eq%20%27StrongNegativeSentiment%27', function() {
		// if success do something
	})
	.done(function(json) {
		var total = 0;
		for (var i=0;i<json.d.results.length;i++){
			total+= parseInt(json.d.results[i].COUNTS);
		}
		//total = total/tweets*100;
		//total = Math.round(total);
		refreshBox("#box4",total);

	})

	.fail(function() {
		$("#box4").append(
				'ERROR');	
	});
}

function loadDonut(brand){
	//Bar chart 2
	var jsonArr = [];
	var total = 0;
	
	$.get( '../Odata/counts.xsodata/Sentiments?&$format=json&$' + 
			'filter=SENTIMENT%20ne%20%27Sentiment%27%20and%20BRAND%20eq%20%27@'+brand+'%27', function() {
		// if success do something
	})
	.done(function(json) {
		//alert(JSON.stringify(json.d.results, null, 4));
		for (var i = 0; i < json.d.results.length; i++) {
	    	total += parseInt(json.d.results[i].COUNTS);
		}
		
		for (var i = 0; i < json.d.results.length; i++) {
		    var perc = Math.round(parseInt(json.d.results[i].COUNTS)/total *100);	
			var item = {	label: json.d.results[i].SENTIMENT, 
		    					value:perc};
			
			jsonArr.push(item);
		}

	    var donut = new Morris.Donut({
	        element: 'donut-'+json.d.results[0].BRAND,
	        resize: true,
	        colors: ["#3c8dbc", "#f56954","#FE9A2E", "#A901DB", "#00a65a" ],
	        data: jsonArr,
	        hideHover: 'auto'
	    });
	})
	
	.fail(function() {
		console.log("Error loading Donut chart");	
	
	});
	
	

};

function loadLastTweets(Sentiment){
	
	var records = 20;
	/** Non Amazon tweets **/
	
	//TM
	//$.get( '../Odata/tab.xsodata/Mentions?&$top='+records+
	//		'&$format=json&$filter=Keyword%20ne%20%27@Amazon%27%20and%20Type%20eq%20%27Strong'+Sentiment+'Sentiment%27', function() {
		// if success do something
	
	//TM
		$.get( '../Odata/tab.xsodata/Mentions?&$top='+records+
				'&$format=json&$filter=Type%20eq%20%27Strong'+Sentiment+'Sentiment%27'+
				'&$orderby=SAP_AT_LOCATION_Id desc', function() {
	})
	.done(function(json) {		
	//	alert(JSON.stringify(json.d.results.length));
		
		var prevText = ''; //TM
		
		for (var i=0;i<json.d.results.length;i++){
			var image = json.d.results[i].ProfileImg;
			var link = 'http://twitter.com/'+json.d.results[i].UserName;
			var tweet = link+'/status/'+ json.d.results[i].Id;
			var username = json.d.results[i].UserName;
			var text = json.d.results[i].Text;
			var location = json.d.results[i].Location;
			
			if (location == null) {		//TM
				location = 'Disabled';
			};
			
			if (prevText != text) {	//TM
				prevText = text;	//TM
				
			$("#"+Sentiment+"-box").append(
					
				'<div class="item">'+
	                '<img src='+ image +' alt="user image" class="online">' +
	                '<p class="message">'+
	                  '<a class="name" href='+tweet+'>' +
	                  '<small class="text-muted pull-right"><i class="fa fa-clock-o"></i>'+ location+'</small>'+'</a>'+
	                  '<a class="name" href='+link+'>'+ '@'+username+'</a> - '+ text+
	                 '</p>'+
	              '</div>'
	         );
			}; //TM
		}	
	})

	.fail(function() {
		$("#tweet-box").append(
				'ERROR');	
	});
}

function refreshLastTweets(Sentiment){
	
	$("#"+Sentiment+"-box").fadeOut('slow', function() {
		$("#"+Sentiment+"-box").empty();
		loadLastTweets(Sentiment);	
		$("#"+Sentiment+"-box").fadeIn('slow');
	});
}

function refreshBox(boxId, json){
	
	var actValue =  $(boxId).text();

	console.log('actValue = ' + actValue);
	
	if (actValue == json){
		return;
	}

	$(boxId).fadeOut('slow', function() {
		$(boxId).empty();
		$(boxId).append(
				json);	
		$(boxId).fadeIn('slow');
	});
	
	//TM
	if (boxId=="#box3"){
		refreshLastTweets('Positive');
	};
		
	if (boxId=="#box4"){
			refreshLastTweets('Negative');
	};
}	
