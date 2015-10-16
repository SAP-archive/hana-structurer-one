/*
 * Author: Ralph Oliveira
 * Date: 5 Feb 2015
 * Description:
 *      This file loads data into the main page (mining.html)
 **/


$(function() {
	"use strict";

	$("#mining-btn").click(function(){
		removeTM();
		loadTM();
	});

	$('#MiningSearch').keypress(function(e){
		if(e.which == 13){//Enter key pressed
			$( "#MiningSearch" ).autocomplete( "close" );
			$('#mining-btn').click();//Trigger search button click event

		}
	});

	$("#MiningSearch").autocomplete({
		messages: {
			noResults: '',
			results: function() {}
		},
		source: function (request, response) {
			$(function(){
				executeTM('getSuggestedTerms', request.term).done(function(json) {
					var suggest = []
					for (var i = 0; i < json.length; i++){
						suggest.push(json[i].term);
					}
					response(suggest);
				});
			});
		}
	});

	$("[data-widget='collapse']").click(function() {
		//Find the box parent        
		var box = $(this).parents(".box").first();
		//Find the body and the footer
		var bf = box.find(".box-body, .box-footer");
		if (!box.hasClass("collapsed-box")) {
			box.addClass("collapsed-box");
			bf.slideUp();
		} else {
			box.removeClass("collapsed-box");
			bf.slideDown();
		}
	}); 


});

function loadTM(){
	var keywords = document.getElementById("MiningSearch").value;
	var i = 0;
	if (keywords){
		// Related Terms
		executeTM('getRelatedTerms', keywords).done(function(json) {
			$("#getRelatedTerms tbody").append(
					"<tr>"	+
					"<th>#</th>"	+
					"<th>Term</th>" +
					"<th>Normalized</th>" +
					"<th>Frequency</th>"+
					"<th>Score</th>"+
			"</tr>");

			for (i = 0; i < json.length; i++){
				$("#getRelatedTerms tbody").append(
						"<tr>"+
						"<td>"+(i+1)+"</td>"+
						"<td>"+json[i].term+"</td>"+
						"<td>"+json[i].termNormalized+"</td>"+
						"<td>"+json[i].frequencyTotal+"</td>"+
						"<td>"+setScore(json[i].score)+"</td>"+
				"</tr>");}

			//alert(JSON.stringify(json, null, 4));
		});

		/**
		executeTM('getRelevantTerms', keywords).done(function(json) {
			//alert(JSON.stringify(json, null, 4));
			$("#getRelevantTerms tbody").append(
					"<tr>"	+
						"<th>#</th>"	+
						"<th>Twet</th>" +
						"<th>Location</th>" +
						"<th>User</th>"+
						"<th>Score</th>"+
					"</tr>");

			for (i = 0; i < json.length; i++){
				$("#getRelevantTerms tbody").append(
						"<tr>"+
						"<td>"+(i+1)+"</td>"+
						"<td>"+json[i].Text+"</td>"+
						"<td>"+json[i].Location+"</td>"+
						"<td>"+json[i].UserName+"</td>"+
						"<td>"+setScore(json[i].score)+"</td>"+
				"</tr>");}		
			});
		 **/

		executeTM('getRelatedDocuments', keywords).done(function(json) {
			//alert(JSON.stringify(json, null, 4));
			$("#getRelatedDocuments tbody").append(
					"<tr>"	+
					"<th>#</th>"	+
					"<th>Twet</th>" +
					"<th>Location</th>" +
					"<th>User</th>"+
					"<th>Score</th>"+
			"</tr>");

			for (i = 0; i < json.length; i++){
				$("#getRelatedDocuments tbody").append(
						"<tr>"+
						"<td>"+(i+1)+"</td>"+
						"<td>"+json[i].Text+"</td>"+
						"<td>"+json[i].Location+"</td>"+
						"<td>"+json[i].UserName+"</td>"+
						"<td>"+setScore(json[i].score)+"</td>"+
				"</tr>");}
		});
	}
}

function removeTM(){
	$("#getRelatedTerms tr").remove();
	$("#getRelatedDocuments tr").remove();


}

function executeTM(cmd, kw){
	return	$.get( '../Mining/calls.xsjs?cmd='+cmd+'&kw='+kw, function() {});
};

function setScore(score){
	var ret = "";
	if(score < 0.33){
		ret = '<span class="label label-danger">'+score+'</span>';
	}else if(score < 0.66){
		ret = '<span class="label label-warning">'+score+'</span>';
	}else{
		ret = '<span class="label label-success">'+score+'</span>';
	}
	return ret;
}



