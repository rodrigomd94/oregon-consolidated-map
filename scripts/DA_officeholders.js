

function createDAOfficeholders() {

    map.addSource("DA_officeholders", { type: "geojson", data: DA_officeholders });                                                 //Add a map source, containing the data from the GeoJSON

    //------------------------ ADDING LAYERS ------------------------//
    map.addLayer({
        id: "DA_officeholders_genders",
        type: "fill",
        source: "DA_officeholders",
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
        id: "DA_officeholders_ages",
        type: "fill",
        source: "DA_officeholders",
        layout: {},
        //filter: ["has", "avg_age"],
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
                ]
            },
            "fill-opacity": 0.8,
            "fill-outline-color": "black"
        }
    });
    //-----------adding and filtering affiliation layers-----
    map.addLayer({
        id: "DA_officeholders_parties",
        type: "fill",
        source: "DA_officeholders",
        layout: {},
        paint: {
            "fill-color": ["get", "color"],                                                                 // In the case of color, the value is a String, so we don't need to use stops like in the other layers. Instead we use a "get" expression to get the color from the "color" property in the geoJSON
            "fill-opacity": 0.8,
            "fill-outline-color": "black"
        }
    });

    //-----------------------------------------------

    map.setLayoutProperty("DA_officeholders_genders", "visibility", "none");                                                 //Disable visibility for the non active layers in the initial map load
    map.setLayoutProperty("DA_officeholders_parties", "visibility", "none");
    map.setLayoutProperty("DA_officeholders_ages", "visibility", "none");

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
                          <dt>District Attorney</dt><dd>${e.features[0].properties.officeholders}</dd>
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
    map.on("click", "DA_officeholders_ages", function (e) {
        create_popup(e);
    });
    // Change the cursor to a pointer when the mouse is over the states layer.
    map.on("mouseenter", "DA_officeholders_ages", function () {
        map.getCanvas().style.cursor = "pointer";
    });
    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "DA_officeholders_ages", function () {
        map.getCanvas().style.cursor = "";
    });

    /* 
    ------POPUP for the genders layer ---------------
    */
    map.on("click", "DA_officeholders_genders", function (e) {
        create_popup(e);
    });
    // Change the cursor to a pointer when the mouse is over the states layer.
    map.on("mouseenter", "DA_officeholders_genders", function () {
        map.getCanvas().style.cursor = "pointer";
    });
    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "DA_officeholders_genders", function () {
        map.getCanvas().style.cursor = "";
    });
    /* 
    ------POPUP for the parties layer ---------------
    */
    map.on("click", "DA_officeholders_parties", function (e) {
        create_popup(e);

    });
    // Change the cursor to a pointer when the mouse is over the states layer.
    map.on("mouseenter", "DA_officeholders_parties", function () {
        map.getCanvas().style.cursor = "pointer";
    });
    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "DA_officeholders_parties", function () {
        map.getCanvas().style.cursor = "";
    });


    /*------------------------------------------------------------------ 
---------------------------------ages legend ------------------*/
    var intervals_age = ['29-39', '40-44', '45-49', '50-54', '55-69', 'Not specified'];           //Defining the Age groups for the legend
    var colors_age = ['#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', 'black'];  //Defining the corresponding colors for each group
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
        DA_officeholders_ages_legend.appendChild(item);                                                   //Appending the container to the legend container

    }
    //--------- gender legend----------------------------------

    var intervals_gender = ['Male', 'Female'];
    var colors_gender = ['#2b8cbe','#e34a33'];
    for (i = 0; i < intervals_gender.length; i++) {
        var interval = intervals_gender[i];
        var color = colors_gender[i];
        var item = document.createElement('div');
        var key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        var value = document.createElement('span');
        value.className = 'legend-value';
        value.innerHTML = interval;
        item.appendChild(key);
        item.appendChild(value);
        DA_officeholders_genders_legend.appendChild(item);
    }

    //---------------- Party affiliations legend ---------------------//
    var intervals_parties = ['Democrat', 'Republican', 'Nonaffiliated','Independent'];
    var colors_parties = ['hsl(250,100%,50%)', 'hsl(360,100%,50%)','hsl(60,100%,50%)','black'];
    for (i = 0; i < intervals_parties.length; i++) {
        var interval = intervals_parties[i];
        var color = colors_parties[i];
        var item = document.createElement('div');
        var key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        var value = document.createElement('span');
        value.className = 'legend-value';
        value.innerHTML = interval;
        item.appendChild(key);
        item.appendChild(value);
        DA_officeholders_parties_legend.appendChild(item);
    }

}

