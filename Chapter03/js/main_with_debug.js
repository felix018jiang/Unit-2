// Add all scripts to the JS folder
var mydiv = document.getElementById("mydiv");

//initialize function called when the script loads
function initialize(){
    cities();
    addEvents();
    addColumns();

};

//function to create a table with cities and their populations
function cities(){
    //define two arrays for cities and population
    var cities = [
        'Madison',
        'Milwaukee',
        'Green Bay',
        'Superior'
    ];
    var population = [
        233209,
        594833,
        104057,
        27244
    ];
    //define an additional array for cieysize
    var citysize = [
        'Medium',
        'Large',
        'Medium',
        'Small'
    ]

    //create the table element
    var table = document.createElement("table");

    //create a header row
    var headerRow = document.createElement("tr");

    //add the "City" column
    var cityHeader = document.createElement("th");
    cityHeader.innerHTML = "City";
    headerRow.appendChild(cityHeader);

    //add the "Population" column
    var popHeader = document.createElement("th");
    popHeader.innerHTML = "Population";
    headerRow.appendChild(popHeader);

    //add the "City Size" column
    /*var sizeHeader = document.createElement("th");
    sizeHeader.innerHTML = "City Size";
    headerRow.appendChild(sizeHeader);*/

    //add the row to the table
    table.appendChild(headerRow);

    //loop to add a new row for each city
    for (var i = 0; i < cities.length; i++){
        var tr = document.createElement("tr");

        var city = document.createElement("td");
        city.innerHTML = cities[i];
        tr.appendChild(city);

        var pop = document.createElement("td");
        pop.innerHTML = population[i];
        tr.appendChild(pop);

        /*var size = document.createElement("td");
        size.innerHTML = citysize[i];
        tr.appendChild(size);*/

        table.appendChild(tr);
    };

    //add the table to the div in index.html
    var myDiv =  document.getElementById("mydiv");
    myDiv.appendChild(table);
};

//call the initialize function when the window has loaded
window.onload = initialize();


function addColumns(){
    
//define a list city and population
var cityPop = [
	{ 
		city: 'Madison',
		population: 233209
	},
	{
		city: 'Milwaukee',
		population: 594833
	},
	{
		city: 'Green Bay',
		population: 104057
	},
	{
		city: 'Superior',
		population: 27244
	}
];
    document.querySelectorAll("tr").forEach(function(row, i){

    	if (i == 0){
    		row.insertAdjacentHTML('beforeend', '<th>City Size</th>');
    	} else {

    		var citySize;
    		if (cityPop[i-1].population < 100000){
    			citySize = 'Small';

    		} else if (cityPop[i-1].population < 500000){
    			citySize = 'Medium';

    		} else {
    			citySize = 'Large';
    		};
            //console.log(citySize)
            row.insertAdjacentHTML('beforeend', '<td>' + citySize + '</td>');
    	};
    });
};

function addEvents(){

	document.querySelector("table").addEventListener("mouseover", changeColor);
		//rgb(56,78,85)
        function changeColor(){

		var color = "rgb(";

		for (var i=0; i<3; i++){

			var random = Math.round(Math.random() * 255);

			color += random;

			if (i<2){
				color += ",";
			
			} else {
				color += ")";
		};

		document.querySelector("table").style.color = color;
	};
};

	function clickme(){

		alert('Hey, you clicked me!');
	};

	document.querySelector("table").addEventListener("click", clickme);
    // window.onload = initialize();
}

function debugCallback(response){
	document.querySelector("#mydiv").insertAdjacentHTML('beforeend', 'GeoJSON data: ' + JSON.stringify(myData))
};

function debugAjax(){
	
	var myData;
	
	fetch("data/MegaCities.geojson")
		.then(function(response){
			debugCallback(response);
		})

	document.querySelector("#mydiv").insertAdjacentHTML('beforeend', 'GeoJSON data:' + JSON.stringify(myData))
};

//document.querySelector("#mydiv").insertAdjacentHTML('beforeend', 'GeoJSON data: ' + JSON.stringify(myData))

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