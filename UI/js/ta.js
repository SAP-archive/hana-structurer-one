/*
 * Author: Ralph Oliveira
 * Date: 5 Feb 2015
 * Description:
 *      This file loads data into the main page (index.html)
 **/

var bar;
var lastId = "";

var lasTweetsURI = '../Odata/counts.xsodata/Tweets?&$format=json&$orderby=Id%20desc'
var	donutURI = '../Odata/tops.xsodata/Subject?$format=json&$orderby=IMPACT%20desc';
var mapURI = '../Odata/tops.xsodata/Location?&$format=json';
var bar1URI = '../Odata/tops.xsodata/Companies?&$format=json&$orderby=MENTIONS%20desc'


 $(function() {
 	"use strict";

 	loadBoxes();
 	setInterval("loadBoxes();",3000); 
 	loadDonut(donutURI,7);
    loadMap(mapURI);
    loadBarChart1(bar1URI,15,'bar-chart2');
    loadBarChart2(bar1URI,15,'bar-chart2');



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
	$.get( '../Odata/counts.xsodata/Tweets/$count', function() {
		// if success do something
	})
	.done(function(json) {	
		refreshBox("#box1",json);
	})

	.fail(function() {
		$("#box1").append('ERROR');	
	});
	
	// Box2
	$.get( '../Odata/counts.xsodata/Users?&$format=json', function() {
		// if success do something
	})
	.done(function(json) {
		refreshBox("#box2",json.d.results[0].COUNTS);
	})

	.fail(function() {
		$("#box2").append('ERROR');	
	});
	
	// Box3
	$.get( '../Odata/counts.xsodata/Companies?&$format=json', function() {
		// if success do something
	})
	.done(function(json) {
		refreshBox("#box3",json.d.results[0].COUNTS);
	})

	.fail(function() {
		$("#box3").append('ERROR');	
	});
	
	// Box4
	$.get( '../Odata/counts.xsodata/People?&$format=json', function() {
		// if success do something
	})
	.done(function(json) {
		refreshBox("#box4",json.d.results[0].COUNTS);
	})

	.fail(function() {
		$("#box4").append(
			'ERROR');	
	});
}

function loadBarChart2(){	
	//Bar chart 2 x
	var jsonArr = [];
	var records = 10;
	$.get( '../Odata/tops.xsodata/People?&$top='+records+'&$format=json&$orderby=MENTIONS%20desc', function() {
		// if success do something
	})
	.done(function(json) {
		//alert(JSON.stringify(json.d.results, null, 4));
		for (var i = 0; i < json.d.results.length; i++) {
			var item = {	x: json.d.results[i].ELEMENT, 
				ya:json.d.results[i].MENTIONS,
				yb:json.d.results[i].IMPACT/5};
				
				jsonArr.push(item);
			}

			bar = new Morris.Bar({
				element: 'bar-chart',
				resize: true,
				data: jsonArr,
				barColors: ['#00a65a', '#f56954'],
				xkey: 'x',
				ykeys: ['ya', 'yb'],
				labels: ['Mentions', "Impact"],
				hideHover: 'auto'
			}); 
		})
	
	.fail(function() {
		console.log("Error loading Bar Chart");	
		
	});
	
}


function refreshBox(boxId, json){
	
	var actValue =  $(boxId).text();

	//console.log('actValue = ' + actValue);
	
	if (actValue == json){
		return;
	}

	$(boxId).fadeOut('slow', function() {
		$(boxId).empty();
		$(boxId).append(
			json);	
		$(boxId).fadeIn('slow');
	});
}

