var urlRootMapgis = "/mapgis";
var ttlToken = 0;
var TokenAnt = null;

function mostrarLoad() {
	$("#divLoading").css("display", "block");
}

function ocultarLoad() {
	$("#divLoading").css("display", "none");
}

function scrollActive(id,num){
	$(id).parent().parent().scrollLeft(num);
}


function consultarToken() {
	var token = null;
	if (TokenAnt==null || (new Date()).getTime() - ttlToken > 10000) {
		ttlToken = (new Date()).getTime();
		var token = null;
		var url = urlRootMapgis+"/validacionToken.do";
		$.ajax({
			"url": url,
			"type": "POST",
			"async": false,
			"success": function(data) {
				if (data && data != "" && data != "Sin autenticacion") {
					token = data;
				}
			},
			"error": function(xhr, status, err) {}
		});
		TokenAnt = token;
	} else {
		token = TokenAnt;
	}
	return token;
}