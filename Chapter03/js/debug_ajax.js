function debugCallback(response){
	document.querySelector("#mydiv").insertAdjacentHTML('beforeend', 'GeoJSON data: ' + JSON.stringify(response))
};

function debugAjax(){
	
	var myData;
	
	fetch("data/MegaCities.geojson")
		//conversion	
		.then(function(response){
			return response.json();
		})
		.then(function(response){
			myData = response;
			debugCallback(response);
		})

	//document.querySelector("#mydiv").insertAdjacentHTML('beforeend', 'GeoJSON data: ' + JSON.stringify(myData))
	//console.log(myData);
};

debugAjax();