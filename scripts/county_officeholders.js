

function createCountyOfficeholders() {

    map.addSource("county_officeholders", { type: "geojson", data: county_officeholders });                                                 //Add a map source, containing the data from the GeoJSON

    //------------------------ ADDING LAYERS ------------------------//
    map.addLayer({
        id: "county_officeholders_genders",
        type: "fill",
        source: "county_officeholders",
        layout: {},                                                                                                       //Layout properties define how the Mapbox GL renderer draws and applies data for a layer (example:visibility, line-cap. Can be removed in this case)
        filter: ["has", "avg_age"],                                                                                       //Only show the features that have the avg_age property- This could be skipped.

        paint: {
            "fill-color": {
                property: "male_prcnt",                                                                                   //Defining the fill color based on the gender ratio
                stops: [[0, "#e34a33"], [0.25, "#fc9272"], [0.5, "#f7fcb9"], [0.75, "#9ecae1"], [1, "#2b8cbe"]]           //Defining the stops for each class (0-25% males, 25-50% males, and the the complements for the females-->0-25%females, etc.)
            },
            "fill-opacity": 0.9,
            "fill-outline-color": "black"
        }
    });
    map.addLayer({
        id: "county_officeholders_ages",
        type: "fill",
        source: "county_officeholders",
        layout: {},
        filter: ["has", "avg_age"],
        paint: {
            "fill-color": {
                property: "avg_age",
                stops: [
                    [35, "#ffffcc"],
                    [40, "#c7e9b4"],
                    [45, "#7fcdbb"],
                    [50, "#41b6c4"],
                    [55, "#1d91c0"],
                    [65, "#225ea8"],
                    [75, "#0c2c84"],
                ]
            },
            "fill-opacity": 0.8,
            "fill-outline-color": "black"
        }
    });
    //-----------adding and filtering affiliation layers-----
    map.addLayer({
        id: "county_officeholders_parties",
        type: "fill",
        source: "county_officeholders",
        layout: {},
        paint: {
            "fill-color": ["get", "color"],                                                                 // In the case of color, the value is a String, so we don't need to use stops like in the other layers. Instead we use a "get" expression to get the color from the "color" property in the geoJSON
            "fill-opacity": 0.8,
            "fill-outline-color": "black"
        }
    });

    //-----------------------------------------------

    map.setLayoutProperty("county_officeholders_genders", "visibility", "none");                                                 //Disable visibility for the non active layers in the initial map load
    map.setLayoutProperty("county_officeholders_parties", "visibility", "none");
    map.setLayoutProperty("county_officeholders_ages", "visibility", "none");

    /*-----------------------------------------------------------------------
    ------------------------------Creating popups----------------------------
    -----------------------------------------------------------------------*/
    function create_popup(e) {
        var clicked_id = "popup_list" + e.features[0].properties.GEOID;                                     //Getting the ID of the clicked feature
        var name_string = "." + clicked_id;                                                                 //Saves the 

        if ($(name_string).length > 0) { //empties all previous elements with this name to avoid having duplicates (used for district parties <p> in popup)
            $(name_string)[0].remove();
        }
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(
                `<dl>
                           <h3>${e.features[0].properties.NAME}</h3>
                          <p><dt>Average age</dt><dd>${Math.round(e.features[0].properties.avg_age)}</dd></p>
                          <dt>No. of male members</dt><dd>${e.features[0].properties.males}</dd>
                          <dt>No. of female members</dt><dd>${e.features[0].properties.females}</dd>
                          <p class=${clicked_id}></p>
                          <dt>county Board Members</dt><dd>${e.features[0].properties.officeholders}</dd>
                          </dl>`
            )
            .addTo(map);

        var district_parties = JSON.parse(e.features[0].properties.parties);                              //Getting a JSON object from the 'parties' propertu of the geoJSON
        var party_keys = Object.keys(district_parties);                                                   //Getting the names of each party (the keys of the JSON)

        let popup_list = $(name_string)[0];

        for (let i = 0; i < party_keys.length; i++) {                                                    //Loop to add the party members to a list that will be added to the popup
            let party = document.createElement("dt");
            party.innerHTML = party_keys[i];
            let party_count = document.createElement("dd");
            party_count.innerHTML = district_parties[party_keys[i]];
            popup_list.appendChild(party);
            popup_list.appendChild(party_count);
        }
    }

    /* 
    ------POPUP for the ages layer ---------------
    */
    map.on("click", "county_officeholders_ages", function (e) {
        create_popup(e);
    });
    // Change the cursor to a pointer when the mouse is over the states layer.
    map.on("mouseenter", "county_officeholders_ages", function () {
        map.getCanvas().style.cursor = "pointer";
    });
    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "county_officeholders_ages", function () {
        map.getCanvas().style.cursor = "";
    });

    /* 
    ------POPUP for the genders layer ---------------
    */
    map.on("click", "county_officeholders_genders", function (e) {
        create_popup(e);
    });
    // Change the cursor to a pointer when the mouse is over the states layer.
    map.on("mouseenter", "county_officeholders_genders", function () {
        map.getCanvas().style.cursor = "pointer";
    });
    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "county_officeholders_genders", function () {
        map.getCanvas().style.cursor = "";
    });
    /* 
    ------POPUP for the parties layer ---------------
    */
    map.on("click", "county_officeholders_parties", function (e) {
        create_popup(e);

    });
    // Change the cursor to a pointer when the mouse is over the states layer.
    map.on("mouseenter", "county_officeholders_parties", function () {
        map.getCanvas().style.cursor = "pointer";
    });
    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "county_officeholders_parties", function () {
        map.getCanvas().style.cursor = "";
    });


    /*------------------------------------------------------------------ 
---------------------------------ages legend ------------------*/
    var intervals_age = ['35-39', '40-44', '45-49', '50-54', '55-69', '70-75'];           //Defining the Age groups for the legend
    var colors_age = ['#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#0c2c84'];  //Defining the corresponding colors for each group
    for (i = 0; i < intervals_age.length; i++) {
        var interval = intervals_age[i];                                                 //Store each interval
        var color = colors_age[i];                                                       //Store the color
        var item = document.createElement('div');                                        //Creating container for the colorand label
        var key = document.createElement('span');                                        //Creating the span for the color
        key.className = 'legend-key';                                                    //Adding a class name
        key.style.backgroundColor = color;                                               //Setting the color to our previously created span element

        var value = document.createElement('span');                                      //Creating the label for the color
        value.className = 'legend-value';                                                //Adding a class name
        value.innerHTML = interval;                                                      //Setting the value of the label equal to the interval
        item.appendChild(key);                                                           //Appending the color and label to the div container
        item.appendChild(value);                                                         //Appending the color and label to the div container
        county_officeholders_ages_legend.appendChild(item);                                                   //Appending the container to the legend container

    }
    //--------- gender legend----------------------------------

    //......................female............
    [[0, "#e34a33"], [0.25, "#fc9272"], [0.5, "#f7fcb9"], [0.75, "#9ecae1"], [1, "#2b8cbe"]]
    var intervals_female = ['50%', '75%', '100%'];
    var colors_female = ['#f7fcb9', '#fc9272', '#e34a33'];
    for (i = 0; i < intervals_female.length; i++) {
        var interval = intervals_female[i];
        var color = colors_female[i];
        var item = document.createElement('div');
        var key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        var value = document.createElement('span');
        value.className = 'legend-value';
        value.innerHTML = interval;
        item.appendChild(key);
        item.appendChild(value);
        county_officeholders_female_legend.appendChild(item);
    }
    //.........male.................................
    var intervals_male = ['50%', '75%', '100%'];
    var colors_male = ['#f7fcb9', '#9ecae1', '#2b8cbe'];
    for (i = 0; i < intervals_male.length; i++) {
        var interval = intervals_male[i];
        var color = colors_male[i];
        var item = document.createElement('div');
        var key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        var value = document.createElement('span');
        value.className = 'legend-value';
        value.innerHTML = interval;
        item.appendChild(key);
        item.appendChild(value);
        county_officeholders_male_legend.appendChild(item);

    }
    //---------------- Party affiliations legend ---------------------//
    //.............Republicans ......................
    var intervals_republican = ['51%', '75%', '100%'];
    var colors_republican = ['hsl(360,100%,84.3%)', 'hsl(360,100%,67.5%)', 'hsl(360,100%,50%)'];
    for (i = 0; i < intervals_republican.length; i++) {
        var interval = intervals_republican[i];
        var color = colors_republican[i];
        var item = document.createElement('div');
        var key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        var value = document.createElement('span');
        value.className = 'legend-value';
        value.innerHTML = interval;
        item.appendChild(key);
        item.appendChild(value);
        county_officeholders_republican_legend.appendChild(item);
    }
    //.............Democrats ........................
    var intervals_democrat = ['51%', '75%', '100%'];
    var colors_democrat = ['hsl(250,100%,84.3%)', 'hsl(250,100%,67.5%)', 'hsl(250,100%,50%)'];
    for (i = 0; i < intervals_democrat.length; i++) {
        var interval = intervals_democrat[i];
        var color = colors_democrat[i];
        var item = document.createElement('div');
        var key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        var value = document.createElement('span');
        value.className = 'legend-value';
        value.innerHTML = interval;
        item.appendChild(key);
        item.appendChild(value);
        county_officeholders_democrat_legend.appendChild(item);
    }
    //.............Nonaffiliated ....................
    var intervals_nonaffiliated = ['51%', '75%', '100%'];
    var colors_nonaffiliated = ['hsl(60,100%,84.3%)', 'hsl(60,100%,67.5%)', 'hsl(60,100%,50%)'];
    for (i = 0; i < intervals_nonaffiliated.length; i++) {
        var interval = intervals_nonaffiliated[i];
        var color = colors_nonaffiliated[i];
        var item = document.createElement('div');
        var key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        var value = document.createElement('span');
        value.className = 'legend-value';
        value.innerHTML = interval;
        item.appendChild(key);
        item.appendChild(value);
        county_officeholders_nonaffiliated_legend.appendChild(item);
    }
    //............-No dominance .....................
    var intervals_nodominant = ['No dominant</br>party'];
    var colors_nodominant = ['lightGrey'];
    for (i = 0; i < intervals_nodominant.length; i++) {
        var interval = intervals_nodominant[i];
        var color = colors_nodominant[i];
        var item = document.createElement('div');
        var key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        var value = document.createElement('span');
        value.className = 'legend-value';
        value.innerHTML = interval;
        item.appendChild(key);
        item.appendChild(value);
        county_officeholders_nodominant_legend.appendChild(item);
    }


}

