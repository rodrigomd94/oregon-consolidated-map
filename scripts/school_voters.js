function createSchoolVoters() {
    map.addSource("voters", { type: "geojson", data: school_voters_districts });

    map.addLayer({
        id: "school_voters_genders",
        type: "fill",
        source: "voters",
        layout: {},
        filter: ["has", "avg_age"],

        paint: {
            "fill-color": {
                property: "male_prcnt",
                stops: [[47, "#e31a1c"], [48, "#fd8d3c"], [49, "#fecc5c"], [50, "#ffffcc"], [53, "#a1dab4"], [56, "#41b6c4"], [60, "#225ea8"]]
            },
            "fill-opacity": 0.9,
            "fill-outline-color": "black"
        }
    });
    map.addLayer({
        id: "school_voters_ages",
        type: "fill",
        source: "voters",
        layout: {},
        filter: ["has", "avg_age"],
        paint: {
            "fill-color": {
                property: "avg_age",
                stops: [
                    [42, "#ffffcc"],
                    [46, "#c7e9b4"],
                    [50, "#7fcdbb"],
                    [54, "#41b6c4"],
                    [58, "#1d91c0"],
                    [62, "#225ea8"],
                    [66, "#0c2c84"],
                ]
            },
            "fill-opacity": 0.8,
            "fill-outline-color": "black"
        }
    });

    map.addLayer({
        id: "school_voters_voters",
        type: "fill",
        source: "voters",
        layout: {},
        filter: ["has", "avg_age"],
        paint: {
            "fill-color": {
                property: "voter_count",
                stops: [
                    [500, "#feedde"],
                    [2000, "#fdd0a2"],
                    [5000, "#fdae6b"],
                    [10000, "#fd8d3c"],
                    [30000, "#f16913"],
                    [50000, "#d94801"],
                    [100000, "#8c2d04"],
                ]
            },
            "fill-opacity": 0.8,
            "fill-outline-color": "black"
        }
    });
    //-----------adding and filtering affiliation layers-----
    map.addLayer({
        id: "school_voters_parties",
        type: "fill",
        source: "voters",
        layout: {},
        paint: {
            "fill-color": ["get", "party_color"],
            "fill-opacity": 0.8,
            "fill-outline-color": "black"
        }
    });


    //---------------------------------------------------------

    map.setLayoutProperty("school_voters_genders", "visibility", "none");
    map.setLayoutProperty("school_voters_parties", "visibility", "none");
    map.setLayoutProperty("school_voters_voters", "visibility", "none");
    map.setLayoutProperty("school_voters_ages", "visibility", "none");

    /*-----------------------------------------------------------------------
    ------------------------------Creating popups----------------------------
    -----------------------------------------------------------------------*/
    function create_popup(e) {
        var clicked_id = "popup_list" + e.features[0].properties.GEOID;
        var name_string = "." + clicked_id;

        if ($(name_string).length > 0) { //empties all previous elements with this name to avoid having duplicates (used for district parties <p> in popup)
            $(name_string)[0].remove();
        }
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(
                `<dl>
                       <h3>${e.features[0].properties.NAME}</h3>
                       <p><dt>No. of voters</dt><dd>${e.features[0].properties.voter_count}</dd></p>
                      <dt>Average age</dt><dd>${parseFloat(e.features[0].properties.avg_age).toFixed(2)}</dd>
                      <p></p>
                      <dt>% of male voters</dt><dd>${e.features[0].properties.male_prcnt.toFixed(2)}</dd>
                      <dt>% of female voters</dt><dd>${e.features[0].properties.fem_prcnt.toFixed(2)}</dd>
                      <p class=${clicked_id}></p>
                      </dl>`

            )
            .addTo(map);
        //var district_parties = JSON.parse(e.features[0].properties.parties);
        var party_keys = ['constitution', 'democrat', 'independent', 'libertarian', 'nonaffiliated', 'other', 'pacific_green', 'progressive', 'republican', 'wfp'];
        var keys_formatted = ['Constitution', 'Democrat', 'Independent', 'Libertarian', 'Non-affiliated', 'Other', 'Pacific Green', 'Progressive', 'Republican', 'Working Families Party'];

        let popup_list = $(name_string)[0];

        for (let i = 0; i < party_keys.length; i++) {
            if (e.features[0].properties[party_keys[i]] != 0) {
                let party = document.createElement("dt");
                party.innerHTML = keys_formatted[i];
                let party_count = document.createElement("dd");
                party_count.innerHTML = e.features[0].properties[party_keys[i]] + " <strong>(" + e.features[0].properties[party_keys[i] + "_prcnt"].toFixed(2) + "%)</strong>";
                popup_list.appendChild(party);
                popup_list.appendChild(party_count);
            }

        }
    }


    /* 
    ------POPUP for the voters layer ---------------
    */


    for (item of toggle_layers) {
        map.on("click", "school_voters_" + item, function (e) {
            create_popup(e);
        });
        // Change the cursor to a pointer when the mouse is over the layer.
        map.on("mouseenter", "school_voters_" + item, function () {
            map.getCanvas().style.cursor = "pointer";
        });

        // Change it back to a pointer when it leaves.
        map.on("mouseleave", "school_voters_" + item, function () {
            map.getCanvas().style.cursor = "";
        });


    }


    /*------------------------------------------------------------------ 
    ---------------------------------voters legend ------------------*/
    var intervals_voters = ['<500', '2,000', '5,000', '10,000', '30,000', '50,000', '100,000+'];
    var colors_voters = ['#feedde', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#d94801'];
    for (i = 0; i < intervals_voters.length; i++) {
        var interval = intervals_voters[i];
        var color = colors_voters[i];
        var item = document.createElement('div');
        var key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        var value = document.createElement('span');
        value.className = 'legend-value';
        value.innerHTML = interval;
        item.appendChild(key);
        item.appendChild(value);
        school_voters_voters_legend.appendChild(item);

    }

    /*---------------------------------ages legend ------------------*/
    var intervals_age = ['42-45', '46-49', '50-53', '54-57', '58-61', '62-66'];
    var colors_age = ['#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#0c2c84'];
    for (i = 0; i < intervals_age.length; i++) {
        var interval = intervals_age[i];
        var color = colors_age[i];
        var item = document.createElement('div');
        var key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        var value = document.createElement('span');
        value.className = 'legend-value';
        value.innerHTML = interval;
        item.appendChild(key);
        item.appendChild(value);
        school_voters_ages_legend.appendChild(item);

    }
    //--------- gender legend----------------------------------

    //......................female............
    var intervals_female = ['50%', '51%', '52%', '53%'];
    var colors_female = ['"#ffffcc"', '#fecc5c', '#fd8d3c', '#e31a1c'];
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
        school_voters_female_legend.appendChild(item);
    }
    //.........male.................................
    var intervals_male = ['50%', '53%', '56%', "60%"];
    var colors_male = ['#ffffcc', '#a1dab4', '#41b6c4', '#225ea8'];
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
        school_voters_male_legend.appendChild(item);

    }
    //---------------- Party affiliations legend ---------------------//
    //.............Republicans ......................
    var intervals_republican = ['<35%', '45%', '55%', '60+'];
    var colors_republican = ['hsl(360,100%,83.45%)', 'hsl(360,100%,70.15%)', 'hsl(360,100%,56.85%)', 'hsl(360,100%,50%)'];
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
        school_voters_republican_legend.appendChild(item);
    }
    //.............Democrats ........................
    var intervals_democrat = ['<35%', '45%', '55%', '60+'];
    var colors_democrat = ['hsl(230,100%,83.45%)', 'hsl(230,100%,70.15%)', 'hsl(230,100%,56.85%)', 'hsl(230,100%,50%)'];
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
        school_voters_democrat_legend.appendChild(item);
    }
    //.............Nonaffiliated ....................
    var intervals_nonaffiliated = ['<35%', '45%', '55%', '60+'];
    var colors_nonaffiliated = ['hsl(60,100%,83.45%)', 'hsl(60,100%,70.15%)', 'hsl(60,100%,56.85%)', 'hsl(60,100%,50%)'];
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
        school_voters_nonaffiliated_legend.appendChild(item);
    }

}