function loadLastTweets(uri, boxId, records, start){

	$.get( uri+'&$top='+records, function() {
		// if success do something
	})
	.done(function(json) {		

		for (var i=0;i<json.d.results.length;i++){
			var image = json.d.results[i].ProfileImg;
			var link = 'http://twitter.com/'+json.d.results[i].UserName;
			var tweet = link+'/status/'+ json.d.results[i].Id;
			var username = json.d.results[i].UserName;
			var text = json.d.results[i].Text;
			var location = json.d.results[i].Location;

			if (lastId == json.d.results[i].Id){
				break;
			}else

				var lastTweet = '<div id ="tweet" class="item">'+
								'<img src='+ image +' alt="user image" class="online">' +
								'<p class="message">'+
								'<a class="name" target="_blank" href='+tweet+'>' +
								'<small class="text-muted pull-right"><i class="fa fa-clock-o"></i>'+ location+'</small>'+'</a>'+
								'<a class="name" target="_blank" href='+link+'>'+ '@'+username+'</a> - '+ text+
								'</p>'+
								'</div>';

				if(start){
					$(boxId).append(lastTweet);
				}else{
					$(lastTweet).hide().prependTo(boxId).fadeIn("slow");
				}
		}
		lastId = json.d.results[0].Id;
	})

	.fail(function() {
		$("#tweet-box").append('ERROR');	
	});
}

function loadDonut(uri,records){
	var jsonArr = [];
	$.get(uri+'&$top='+records, function() {
		// if success do something
	})
	.done(function(json) {
		//alert(JSON.stringify(json.d.results, null, 4));
		
		for (var i = 0; i < json.d.results.length; i++) {
			var item = {	label: json.d.results[i].SUBJECT, 
				value:json.d.results[i].MENTIONS};

				jsonArr.push(item);
			}

			var donut = new Morris.Donut({
				element: 'donut-chart',
				resize: true,
				colors: ["#3c8dbc", "#8A0CE8","#FE9A2E", "#00a65a", "#A901DB", "#00F5A0", "#f56954"],
				data: jsonArr,
				hideHover: 'auto'
			});
		})
	
	.fail(function() {
		console.log("Error loading Donut chart");	

	});

};

function loadMap(uri){
	
	//Load Map
	var item = {}; 

	$.get(uri, function() {
		// if success do something
	})
	.done(function(json) {
		//alert(JSON.stringify(json.d.results, null, 4));
		for (var i = 0; i < json.d.results.length; i++) {

			//Some country codes are null
			if (json.d.results[i].LOCATION != null){
				item[json.d.results[i].LOCATION] = json.d.results[i].MENTIONS;
			}
			
		}
		
	    //World map by jvectormap
	    $('#world-map').vectorMap({
	    	map: 'world_mill_en',
	    	backgroundColor: "#fff",
	    	regionStyle: {
	    		initial: {
	    			fill: '#e4e4e4',
	    			"fill-opacity": 1,
	    			stroke: 'none',
	    			"stroke-width": 0,
	    			"stroke-opacity": 1
	    		}
	    	},
	    	series: {
	    		regions: [{
	    			values: item,
	                    scale: ["#3c8dbc", "#2D79A6"],
	                    normalizeFunction: 'polynomial'
	                }]
	            },
	            onRegionLabelShow: function(e, el, code) {
	            	if (typeof item[code] != "undefined")
	            		el.html(el.html() + ': ' + item[code] + ' Tweet');
	            }
	        });


	})

	.fail(function() {
		console.log("Error loading MAP");	
	});

}



function loadBarChart1(uri, records, divId){	
	//Bar chart 1 value on X
	var jsonArr = [];
	$.get( uri+'&$top='+records, function() {
		// if success do something
	})
	.done(function(json) {
		for (var i = 0; i < json.d.results.length; i++) {
			var item = {	x: json.d.results[i].ELEMENT, 
				ya:json.d.results[i].MENTIONS};
				jsonArr.push(item);
			}

			var bar = new Morris.Bar({
				element: divId,
				resize: true,
				data: jsonArr,
				barColors: ['#FE9A2E'],
				xkey: 'x',
				ykeys: ['ya'],
				labels: ["Impact"],
				hideHover: 'auto'
			}); 
		})
	
	.fail(function() {
		console.log("Error loading Bar Chart");	

	});
	
}