var TM = new $.db.textmining.Session({
	        referenceTable: "SUMMIT2015:Summit15.data::tweets",
	        referenceColumn: "Text",
	    });


function returnJSON(results) {
	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(JSON.stringify(results));
	$.response.status = $.net.http.OK;
} 

function getSuggestedTerms(term){
    var termResults = TM.getSuggestedTerms ({
    							top: 15,
    							inputTermText: term});
    returnJSON(termResults);
}

function getRelatedTerms(term){
	var termResults = TM.getRelatedTerms ({
							top: 15,
							inputTermText: term});
	returnJSON(termResults);
}

function getRelevantTerms(term){
	var termResults = TM.getRelevantTerms ({
							top: 15,
							inputDocumentText: term});
	returnJSON(termResults);
}

function getRelatedDocuments(term){
	var termResults = TM.getRelatedDocuments ({
							top: 15,
							inputDocumentText: term,
							includeColumns: ["Text", "Location", "UserName"]});
	returnJSON(termResults);
}

function getRelevantDocuments(term){
	var termResults = TM.getRelevantDocuments ({
							top: 15,
							inputDocumentText: term,
							includeColumns: ["Location", "UserName"]});
	returnJSON(termResults);
}


var cmd = $.request.parameters.get('cmd');
var kw 	=	$.request.parameters.get('kw');
switch(cmd){
case "getSuggestedTerms":
	getSuggestedTerms(kw);
	break;
case "getRelatedTerms":
	getSuggestedTerms(kw);
	break;
case "getRelevantTerms":
	getRelevantTerms(kw);
	break;
case "getRelatedDocuments":
	getRelatedDocuments(kw);
	break;
case "getRelevantDocuments":
	getRelevantDocuments(kw);
	break;
	
	
default:
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody('Invalid command: '+cmd);
}

