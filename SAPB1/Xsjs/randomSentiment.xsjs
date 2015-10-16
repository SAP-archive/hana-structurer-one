var conn = null, pstmt = null, rs = null;
var query = 
	' DISTINCT "UserName" , "ProfileImg", "Location", "Text", "Type", "Id"' + 
	'FROM "_SYS_BIC"."Summit15.SAPB1.Models/SAP_AN_TWEET"' + 
	'WHERE "Type" IN ('+ "'WeakNegativeSentiment', 'WeakPositiveSentiment', 'StrongNegativeSentiment','StrongPositiveSentiment') ";
 
function showData(query){
	conn = $.db.getConnection();
	pstmt = conn.prepareStatement(query);
	rs = pstmt.executeQuery();

	$.response.contentType = "application/json"; // Specify output

	if (!rs.next()) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	} else {
		var result = {};
		var counter = 0;
		result.data = [ {
			UserName : rs.getString(1), //Attribute 2
			ProfileImg : rs.getString(2),	//Attribute 2
			Location : rs.getString(3),	//Attribute 3
			Text : rs.getString(4),	//Attribute 4
			Type : rs.getString(5),	//Attribute 4
			Id	 : rs.getString(6)



		} ];

		while (rs.next()) {
			counter++;
			result.data[counter] = {
					UserName : rs.getString(1), //Attribute 2
					ProfileImg : rs.getString(2),	//Attribute 2
					Location : rs.getString(3),	//Attribute 3
					Text : rs.getString(4),	//Attribute 4
					Type : rs.getString(5),	//Attribute 4
					Id	 : rs.getString(6)
			};
		}
		
		$.response.setBody(JSON.stringify(result));
		$.response.status = $.net.http.OK;
	}
	rs.close();
	pstmt.close();
	conn.close();
	
}


function randomTweet(top){
	query ='SELECT TOP '+ top + query + 'ORDER BY RAND()';
	showData(query);
}

function lastTweet(top){
	query ='SELECT TOP '+ top + query + 'ORDER BY "Id" desc';
	showData(query);
}


var cmd = $.request.parameters.get('cmd');
var top 	=	$.request.parameters.get('top');

switch(cmd){
	case "random":
		randomTweet(top);
		break;
	case "last":
		lastTweet(top);
		break;
default:
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody('Invalid command: '+cmd);
}

