

var prefix = 'school_officeholders_';          //Setting the initial prefix to toggle between school district boundaries and county districts. Default is school boundaries;
var previous_bound = 'school_officeholders_';  //Used to deactivate the previously selected boundaries when toggling between boundaries

var boundaryOption = document.getElementById("bound_select");


var selected_value = 'ages'; //setting initial selected value. In this case the layer that loads by default is the voters layer;
//var active_layer = "school_voters_ages";

boundaryOption.addEventListener('change', function (e) {
    prefix = this.value + '_';
    console.log(prefix);
    document.getElementById(previous_bound + 'radio-container').style.display = 'none';
    map.setLayoutProperty(previous_bound + "ages", "visibility", "none");
    map.setLayoutProperty(previous_bound + selected_value, "visibility", "none");
    document.getElementById(previous_bound + selected_value + "_legend").setAttribute("style", "display:none;");
    document.getElementById(previous_bound + "ages_legend").setAttribute("style", "display:none;");
    document.getElementById(previous_bound + "map-title").setAttribute("style", "display:none;");
    document.getElementById(previous_bound + "description").setAttribute("style", "display:none;");

    document.getElementById(prefix + "ages" + '-filter').checked = 'checked';
    document.getElementById(prefix + 'radio-container').style.display = '';
    map.setLayoutProperty(prefix + "ages", "visibility", "visible");
    document.getElementById(prefix + "legend").setAttribute("style", "display:;");
    document.getElementById(prefix + "ages_legend").setAttribute("style", "display:;");
    document.getElementById(prefix + "map-title").setAttribute("style", "display:;");
    document.getElementById(prefix + "description").setAttribute("style", "display:;");
    
    previous_bound = prefix;
})


//------filtering layers with radio buttons---------------------
radioOption = document.getElementsByClassName("form-check-input");
console.log(radioOption);


var toggle_layers = ["genders", "ages", "parties", "voters"];
var map_prefixes = ["school_voters", "school_officeholders", "county_voters"]
//for (map_prefix of map_prefixes) {

for (element of radioOption) {
    element.addEventListener("click", function (e) {
        selected_value = this.value;
        var active_layer = prefix + this.value;
        console.log(active_layer);
        for (item of toggle_layers) {
            var legend_id = prefix + item + "_legend";
            item = prefix + item;
            if (active_layer == "none") {
                map.setLayoutProperty(item, "visibility", "none");
            } else {
                if (active_layer == item) {
                    map.setLayoutProperty(item, "visibility", "visible");
                    document.getElementById(legend_id).setAttribute("style", "display:;");
                    console.log(legend_id);
                } else {
                    try {
                        map.setLayoutProperty(item, "visibility", "none");
                        document.getElementById(legend_id).setAttribute("style", "display:none;");
                    } catch (error) {
                        console.log(error);
                    }

                }
            }
        }
    });

};

//}


//---------------------------------------------------------------------------------

mapboxgl.accessToken =
    "pk.eyJ1IjoiamltY3VwcCIsImEiOiJjazVsZnRjdjYwb21iM25vMWd3a3VxNTcwIn0.GgP8sFpvsmSe7fGppUOcTQ";
var bounds = [
    [-124.9, 41.83],
    [-116.0, 46.6]
];
var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/jimcupp/ckar6ha461jpu1ilbtugeai99",
    center: [-120.6, 44.0],
    maxBounds: [
        [-130.9, 34.83],
        [-110.0, 52.6]
    ]
});
map.fitBounds(bounds);

var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    countries: 'us',
    flyto: false,
    placeholder: 'Enter address here',
    bbox: [-124.9, 41.83, -116.0, 46.6],
    mapboxgl: mapboxgl
});
geocoder.setFlyTo(false);
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

map.on("load", function () {
    addGeocoder();
    createSchoolVoters()
    createSchoolOfficeholders();
    createCountyOfficeholders()
    createCountyVoters()
    createDAOfficeholders()
   
});



function addGeocoder() {

    geocoder.on('result', function (ev) {
        var result_coords = ev.result.geometry.coordinates;
        map.fire('click', { lngLat: result_coords, point: map.project(result_coords), originalEvent: {} });
    });
    //-------adding popup when using geolocation
    var geolocate = new mapboxgl.GeolocateControl({ fitBoundsOptions: { maxZoom: 7 } });

    map.addControl(geolocate);

    geolocate.on('geolocate', function (e) {
        var lon = e.coords.longitude;
        var lat = e.coords.latitude
        var position = [lon, lat];
        map.fire('click', { lngLat: position, point: map.project(position), originalEvent: {} });
    });
}
//----Functions to open and close sidebar-----
function openNav() {
    document.getElementById("mySidenav").style.width = "295px";
    document.getElementById("infoButton").style.visibility = "hidden";
}
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("infoButton").style.visibility = "visible";
}
