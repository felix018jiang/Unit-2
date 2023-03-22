// -----------------------

//declare map variable globally so all functions have access
var map;
var minValue;
var dataStats = {};

function createMap() {

    //create the map
    map = L.map('map', {
        center: [38, -90],
        zoom: 5
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    });
    var Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
    }).addTo(map);
    var Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    });

    //call getData function
    getData(map);
    L.Control.textbox = L.Control.extend({
        onAdd: function (map) {

            var text = L.DomUtil.create('div');
            text.id = "info_text";
            text.innerHTML = "<strong></strong>"
            return text;
        },

        onRemove: function (map) {
            // Nothing to do here
        }
    });
    L.control.textbox = function (opts) { return new L.Control.textbox(opts); }
    L.control.textbox({ position: 'bottomleft' }).addTo(map);
    // title part
    // L.Control.textbox = L.Control.extend({
    //     onAdd: function (map) {

    //         var text = L.DomUtil.create('div');
    //         text.id = "info_text";
    //         text.innerHTML = "<strong>text here</strong>"
    //         return text;
    //     },

    //     onRemove: function (map) {
    //         // Nothing to do here
    //     }
    // });
    L.control.textbox({ position: 'topleft' }).addTo(map);
    L.control.textbox = function (opts) { return new L.Control.textbox(opts); }

    // add info
    var info = L.control();
    // define what happens when control is added to map
    info.onAdd = function (map) {
        // create a div with class info
        this._div = L.DomUtil.create('div', 'title-container');
        // add some content
        this._div.innerHTML = '<h2>U.S. Cities With the Largest Economies</h2>';
        var container = L.DomUtil.create('div', 'title-container');
        // return div
        return this._div;
    };
    
    // add control to map
    info.addTo(map);
};


function calcMinValue(data) {
    //create empty array to store all data values
    var allValues = [];
    //loop through each city
    for (var city of data.features) {
        //loop through each year
        for (var year = 2012; year <= 2018; year += 1) {
            //get population for current year
            var value = city.properties["gdp_" + String(year)];
            //add value to array
            allValues.push(value);
            //console.log(value);
        }
    }
    //get minimum value of our array
    var minValue = Math.min(...allValues)

    return minValue;
}

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    var minRadius = 5;
    //Flannery Apperance Compensation formula
    var radius = 1.0083 * Math.pow(attValue / minValue, 0.5715) * minRadius
    return radius;
};

//function to convert markers to circle markers and add popups
function pointToLayer(feature, latlng, attributes) {
    //Determine which attribute to visualize with proportional symbols
    var attribute = attributes[0];
    //check
    //console.log(attribute);

    //create marker options
    var options = {
        fillColor: "#98C7F5",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string starting with city...Example 2.1 line 24
    var popupContent = "<p><b>City:</b> " + feature.properties.City + "</p>";

    //add formatted attribute to popup content string
    //var year = attribute.split("")[1];
    var year = attribute.split("_")[1];
    popupContent += "<p><b>GDP in " + year + ":</b> " + feature.properties[attribute] + " million$</p>";

    //bind the popup to the circle marker
    layer.bindPopup(popupContent, {
        offset: new L.Point(0, -options.radius)
    });

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

function createPropSymbols(data, attributes) {
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};

//Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(attribute) {
    map.eachLayer(function (layer) {
        console.log("here!");
        var year = attribute.split("_")[1];
        document.querySelector("span.year").innerHTML = year;

        if (layer.feature) {
            //access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            if (props.City == "Minneapolis, MN, USA")
                console.log

            //add city to popup content string
            var popupContent = "<p><b>City:</b> " + props.City + "</p>";

            //add formatted attribute to panel content string

            popupContent += "<p><b>GDP in " + year + ":</b> " + props[attribute] + " million$</p>";

            //update popup with new content
            popup = layer.getPopup();
            popup.setContent(popupContent).update();

        };
    });
};

function processData(data) {
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties) {
        //only take attributes with population values
        if (attribute.indexOf("gdp") > -1) {
            attributes.push(attribute);
        };
    };

    return attributes;
};

//Step 1: Create new sequence controls
function createSequenceControls(attributes) {
    //create range input element (slider)
    var slider = "<input class='range-slider' type='range'></input>";
    document.querySelector("#panel").insertAdjacentHTML('beforeend', slider);

    //set slider attributes
    document.querySelector(".range-slider").max = 6;
    document.querySelector(".range-slider").min = 0;
    document.querySelector(".range-slider").value = 0;
    document.querySelector(".range-slider").step = 1;

    //add step buttons
    document.querySelector('#panel').insertAdjacentHTML('beforeend', '<button class="step" id="reverse">Reverse</button>');
    document.querySelector('#panel').insertAdjacentHTML('beforeend', '<button class="step" id="forward">Forward</button>');

    //replace button content with images
    document.querySelector('#reverse').insertAdjacentHTML('beforeend', "<img src='img/backward.svg'>")
    document.querySelector('#forward').insertAdjacentHTML('beforeend', "<img src='img/forward.svg'>")

    var steps = document.querySelectorAll('.step');

    steps.forEach(function (step) {
        step.addEventListener("click", function () {
            var index = document.querySelector('.range-slider').value;
            //Step 6: increment or decrement depending on button clicked
            if (step.id == 'forward') {
                index++;
                //Step 7: if past the last attribute, wrap around to first attribute
                index = index > 6 ? 0 : index;
            } else if (step.id == 'reverse') {
                index--;
                //Step 7: if past the first attribute, wrap around to last attribute
                index = index < 0 ? 6 : index;
            };

            //Step 8: update slider
            document.querySelector('.range-slider').value = index;

            //Step 9: pass new attribute to update symbols
            updatePropSymbols(attributes[index]);
        })
    })

    //Step 5: input listener for slider
    document.querySelector('.range-slider').addEventListener('input', function () {
        //Step 6: get the new index value
        var index = this.value;

        //Step 9: pass new attribute to update symbols
        updatePropSymbols(attributes[index]);
    });
};

// ------- createsequencecontrol example code
function createSequenceControls(attributes) {

    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function () {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');

            //create range input element (slider)
            container.insertAdjacentHTML('beforeend', '<input class="range-slider" type="range">')

            //add skip buttons
            container.insertAdjacentHTML('beforeend', '<button class="step" id="reverse" title="Reverse"><img src="img/backward.svg"></button>');
            container.insertAdjacentHTML('beforeend', '<button class="step" id="forward" title="Forward"><img src="img/forward.svg"></button>');

            //disable any mouse event listeners for the container
            L.DomEvent.disableClickPropagation(container);


            return container;

        }
    });

    map.addControl(new SequenceControl());

    ///////add listeners after adding the control!///////
    //set slider attributes
    document.querySelector(".range-slider").max = 6;
    document.querySelector(".range-slider").min = 0;
    document.querySelector(".range-slider").value = 0;
    document.querySelector(".range-slider").step = 1;

    var steps = document.querySelectorAll('.step');

    steps.forEach(function (step) {
        step.addEventListener("click", function () {
            var index = document.querySelector('.range-slider').value;
            //Step 6: increment or decrement depending on button clicked
            if (step.id == 'forward') {
                index++;
                //Step 7: if past the last attribute, wrap around to first attribute
                index = index > 6 ? 0 : index;
            } else if (step.id == 'reverse') {
                index--;
                //Step 7: if past the first attribute, wrap around to last attribute
                index = index < 0 ? 6 : index;
            };

            //Step 8: update slider
            document.querySelector('.range-slider').value = index;

            //Step 9: pass new attribute to update symbols
            updatePropSymbols(attributes[index]);
        })
    })

    //Step 5: input listener for slider
    document.querySelector('.range-slider').addEventListener('input', function () {
        //Step 6: get the new index value
        var index = this.value;

        //Step 9: pass new attribute to update symbols
        updatePropSymbols(attributes[index]);
    });

};


function getData(map) {
    //load the data
    fetch("data/USCities.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            var attributes = processData(json);
            minValue = calcMinValue(json);
            //call function to create proportional symbols
            createPropSymbols(json, attributes);
            createSequenceControls(attributes);
            calcStats(json)
            createLegend(attributes);

        })
};

function calcStats(data) {
    //create empty array to store all data values
    var allValues = [];
    //loop through each city


    for (var city of data.features) {
        //loop through each year
        for (var year = 2012; year <= 2018; year += 1) {
            //get population for current year
            var value = city.properties["gdp_" + String(year)];
            //add value to array
            allValues.push(value);
            //console.log(value);
        }
    }
    //get min, max, mean stats for our array
    dataStats.min = Math.min(...allValues);
    dataStats.max = Math.max(...allValues);
    //calculate meanValue
    var sum = allValues.reduce(function (a, b) { return a + b; });
    dataStats.mean = sum / allValues.length;

};
// function createTitle(){
//     var TitleControl = L.Control.extend({
//         options:{
//             position: 'topleft'
//         },
//     onAdd: function(){

//     }
//     })
// };

function createLegend(attributes) {
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function () {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');

            //PUT YOUR SCRIPT TO CREATE THE TEMPORAL LEGEND HERE
            container.innerHTML = '<h3 class="temporalLegend">GDP in <span class="year".split("_")[1]>2012</span></h3>';

            //----------
            //array of circle names to base loop on  
            var circles = ["max", "mean", "min"];
            var svg = '<svg id="attribute-legend" width="170px" height="60px">';

            //Step 2: loop to add each circle and text to svg string  
            for (var i = 0; i < circles.length; i++) {
                console.log(dataStats[circles[i]])

                //Step 3: assign the r and cy attributes  
                var radius = calcPropRadius(dataStats[circles[i]]);
                var cy = 59 - radius;

                //circle string  
                svg += '<circle class="legend-circle" id="' + circles[i] + '" r="' + radius + '"cy="' + cy + '" fill="#98C7F5" fill-opacity="0.7" stroke="#000000" cx="30"/>';
                var textY = i * 20 + 20;

                //text string
                svg +=
                    '<text id="' +
                    circles[i] +
                    '-text" x="65" y="' +
                    textY +
                    '">' +
                    Math.round(dataStats[circles[i]]) +
                    " million $" +
                    "</text>";
            };

            //close svg string  
            svg += "</svg>";

            container.insertAdjacentHTML('beforeend', svg);

            return container;
        }

    });

    map.addControl(new LegendControl());

};



document.addEventListener('DOMContentLoaded', createMap);





