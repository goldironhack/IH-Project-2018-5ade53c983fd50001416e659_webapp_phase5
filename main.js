const neighborhoodNamesGIS = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
const NYDistrictsGeoshapes = "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
const CrimesInNY = "https://data.cityofnewyork.us/resource/9s4h-37hy.json";
const NYCityHousing = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";

const NYCityMuseums = "https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json?accessType=DOWNLOAD";
const NYCityPopulation = "https://data.cityofnewyork.us/api/views/37cg-gxjd/rows.json?accessType=DOWNLOAD";

var centroidsData;
var crimesData;
var housingData;
var museumsData;
var populationData;

function getDataFromCentroids() {
    var data = $.getJSON(neighborhoodNamesGIS, function () {
        console.log("Success Data from Centroids");
    })
        .done(function () {
            centroidsData = data.responseJSON.data;
        })
        .fail(function (error) {
            console.error("Erro! Data from Centroids: " + error);
        });
}

function getDataFromCrimes() {
    var data = $.getJSON(CrimesInNY, function () {
        console.log("Success Data from Crimes");
    })
        .done(function () {
            // Success
            crimesData = data.responseJSON;
        })
        .fail(function (error) {
            console.error("Error Data from Crimes: " + error);
        });
}

function getDataFromHousing() {
    var data = $.getJSON(NYCityHousing, function () {
        console.log("Success Data from Housing");
    })
        .done(function () {
            housingData = data.responseJSON.data;
        })
        .fail(function (error) {
            console.error("Error Data from Housing: " + error);
        })
}

function getDataFromMuseums() {
    var data = $.getJSON(NYCityMuseums, function () {
        console.log("Success Data from Museums");
    })
        .done(function () {
            museumsData = data.responseJSON.data;
        })
        .fail(function (error) {
            console.error("Error Data from Museums: " + error);
        });
}

function getDataFromPopulation() {
    var data = $.getJSON(NYCityPopulation, function () {
        console.log("Success Data from Population");
    })
        .done(function () {
            // initMetrics();
            populationData = data.responseJSON.data;
        })
        .fail(function (error) {
            console.error("Error Data from Population: " + error);
        });
}


function initMap() {

    var options = {
        zoom: 13,
        center: { lat: 40.7291, lng: -73.9965 } // NYU
    };

    var optionsMarker = {
        position: NYU_Stern,
        map: map,
        animation: google.maps.Animation.BOUNCE,
        title: "New York University Stern School of Business"
    };

    var NYU_Stern = { lat: 40.729100, lng: -73.996500 };
    var map = new google.maps.Map(document.getElementById('map'), options);
    // https://developers.google.com/maps/documentation/javascript/markers
    var marker = new google.maps.Marker({
        position: NYU_Stern,
        map: map,
        animation: google.maps.Animation.BOUNCE,
        title: "New York University Stern School of Business"
    });

    var contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h3>New York University</h3>' +
        '<div id="bodyContent">' +
        '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
        'sandstone rock formation in the southern part of the </p>' +
        '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
        'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
        '(last visited June 22, 2009).</p>' +
        '</div>' +
        '</div>';


    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });


    // Las siguientes funciones salen de este link:
    // https://developers.google.com/maps/documentation/javascript/datalayer?hl=es-419
    // Graficar los distritos:
    map.data.loadGeoJson(NYDistrictsGeoshapes);
    // Estilo del mapa, color, grosor
    map.data.setStyle({
        fillColor: 'white',     // color poligono
        strokeWeight: 1,        // grosor borde
        strokeColor: 'grey'     // color borde
    });
    // Cambia color mientras el cursor esté sobre el area
    map.data.addListener('mouseover', function (event) {
        map.data.overrideStyle(event.feature, { fillColor: 'red', strokeWeight: 2 });
    });
    // Cambia color cuando el cursor sale del Area
    map.data.addListener('mouseout', function (event) {
        // map.data.overrideStyle(event.feature, { fillColor: 'white', strokeWeight: 1  });
        map.data.revertStyle();
    });


    //Si se oprime el boton de Housing
    document.getElementById("houseButton").addEventListener("click", function () {
        for (var w = 0; w < housingData.length; w++) {
            var latiHous = parseFloat(housingData[w][23]);
            var longiHous = parseFloat(housingData[w][24]);
            //Agregar marcador
            var marker = new google.maps.Marker({
                position: { lat: latiHous, lng: longiHous },
                icon: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678085-house-32.png',
                map: map
            });
        }
    });


    //Si se oprime el boton de Museums
    document.getElementById("museumsButton").addEventListener("click", function () {
        for (var a = 0; a < museumsData.length; a++) {
            var arrLong = museumsData[a][8].substr(7, 19);
            var arrLat = museumsData[a][8].substr('26', '45');
            var arrLati = arrLat.split(")");
            var longit = parseFloat(arrLong);
            var latit = parseFloat(arrLati[0]);
            //Agregar marcador museos
            var marker = new google.maps.Marker({
                position: { lat: latit, lng: longit },
                icon: 'https://cdn2.iconfinder.com/data/icons/bitsies/128/Bank-32.png',
                map: map
            });
        }
    });

    //Si se oprime el boton de Clear
    document.getElementById("clearBtn").addEventListener("click", function () {
        map = new google.maps.Map(document.getElementById('map'), options);
        // https://developers.google.com/maps/documentation/javascript/markers
        var marker = new google.maps.Marker({
            position: NYU_Stern,
            map: map,
            animation: google.maps.Animation.BOUNCE,
            title: "New York University Stern School of Business"
        });
    });


} // Fin initMap


function updateAllDatasets() {
    for (var stateID of statesIDs) {
        var URL = DATASET_QUERY_FORMAT + stateID;
        getDataFromURL(URL);
    }
    // getDataFromURL(URL_NY_BD);
}

function updateTable() {
    tableReference = $("#mainTableBody")[0];
    var newRow, co2Amount, state;

    for (var statesID of statesIDs) {
        newRow = tableReference.insertRow(tableReference.rows.length);
        state = newRow.insertCell(0);
        co2Amount = newRow.insertCell(1);
        state.innerHTML = DATASETS_API_SERIES_ID[statesID][0]
        co2Amount.innerHTML = DATASETS_API_SERIES_ID[statesID][2][0][1];
    }
}


function updateCoord() {
    var NYU_Stern = { lat: 40.729100, lng: -73.996500 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: NYU_Stern
    });
    // https://developers.google.com/maps/documentation/javascript/markers
    for (var w = 0; w < housingData.length; w++) {
        var latiHous = parseFloat(housingData[w][23]);
        var longiHous = parseFloat(housingData[w][24]);

        //Agreger marcador
        var marker = new google.maps.Marker({
            position: { lat: latiHous, lng: longiHous },     //lat long NYU Stern School of Business
            icon: 'http://maps.google.com/mapfiles/kml/pal2/icon10.png',
            map: map
        });
    }
}


$(document).ready(function () {
    getDataFromCrimes();
    getDataFromHousing();
    getDataFromCentroids();
    getDataFromMuseums();
    getDataFromPopulation();
    $("#getDataButton").on("click", updateAllDatasets);
    $("#updateTableButton").on("click", updateTable);
})