var conn = null, pstmt = null, rs = null;
var query = 	'select top 10  "Id", "TA_TOKEN", "TA_TYPE" from "SUMMIT2015"."$TA_SAPB1TWEETS"';
var query2;
 
function showData(){
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
			Id : rs.getNString(1), //Attribute 2
			TA_TOKEN : rs.getNString(2),	//Attribute 2
			TA_TYPE : rs.getNString(3)	//Attribute 3
			


		} ];

		while (rs.next()) {
			counter++;
			result.data[counter] = {
					Id : rs.getNString(1), //Attribute 2
					TA_TOKEN : rs.getNString(2),	//Attribute 2
					TA_TYPE : rs.getNString(3),	//Attribute 3
					query : query2
			};
		}
		
		$.response.setBody(JSON.stringify(result));
		$.response.status = $.net.http.OK;
	}
	rs.close();
	pstmt.close();
	conn.close();
	
}



var Id = $.request.parameters.get('Id');
//Id = "590722305891926017";

	query = query +  'where "Id" = '+ Id;
	showData();
	





