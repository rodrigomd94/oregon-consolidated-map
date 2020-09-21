
function createCountyVoters() {
    map.addSource("county_voters_voters", { type: "geojson", data: county_voters_districts });
    //...................................................COUNTY LAYERS.........................................
    //.........................................................................................................
    map.addLayer({
        id: "county_voters_genders",
        type: "fill",
        source: "county_voters_voters",
        layout: {},

        paint: {
            "fill-color": {
                property: "male_prcnt",
                stops: [[47, "#e31a1c"], [48, "#fd8d3c"], [49, "#fecc5c"], [50, "#ffffcc"], [51, "#a1dab4"], [52, "#41b6c4"], [53, "#225ea8"]]
            },
            "fill-opacity": 0.9,
            "fill-outline-color": "black"
        }
    });
    map.addLayer({
        id: "county_voters_ages",
        type: "fill",
        source: "county_voters_voters",
        layout: {},
        paint: {
            "fill-color": {
                property: "avg_age",
                stops: [
                    [46, "#ffffcc"],
                    [48, "#c7e9b4"],
                    [50, "#7fcdbb"],
                    [52, "#41b6c4"],
                    [54, "#1d91c0"],
                    [56, "#225ea8"],
                    //[58, "#0c2c84"],
                ]
            },
            "fill-opacity": 0.8,
            "fill-outline-color": "black"
        }
    });

    map.addLayer({
        id: "county_voters_voters",
        type: "fill",
        source: "county_voters_voters",
        layout: {},
        paint: {
            "fill-color": {
                property: "voter_count",
                stops: [
                   // [1500, "#ffffd4"],
                    [2000, "#fee391"],
                    [6000, "#fec44f"],
                    [20000, "#fe9929"],
                    [80000, "#d95f0e"],
                    [300000, "#993404"],

                ]
            },
            "fill-opacity": 0.8,
            "fill-outline-color": "black"
        }
    });
    //-----------adding and filtering affiliation layers-----
    map.addLayer({
        id: "county_voters_parties",
        type: "fill",
        source: "county_voters_voters",
        layout: {},
        paint: {
            "fill-color": ["get", "party_color"],
            "fill-opacity": 0.8,
            "fill-outline-color": "black"
        }
    });

    //-----------------------------------------------



    map.setLayoutProperty("county_voters_voters", "visibility", "none");
    map.setLayoutProperty("county_voters_genders", "visibility", "none");
    map.setLayoutProperty("county_voters_parties", "visibility", "none");
    map.setLayoutProperty("county_voters_ages", "visibility", "none");

    //------------------------------------------------
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
                           <p><dt>No. of voters</dt><dd>${numberWithCommas(e.features[0].properties.voter_count)}</dd></p>
                          <dt>Average age</dt><dd>${parseInt(e.features[0].properties.avg_age)}</dd>
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

    for (item of toggle_layers) {
        map.on("click", "county_voters_" + item, function (e) {
            create_popup(e);
        });
        // Change the cursor to a pointer when the mouse is over the layer.
        map.on("mouseenter", "county_voters_" + item, function () {
            map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "county_voters_" + item, function () {
            map.getCanvas().style.cursor = "";
        });
    }

    /*----------------------------------------------------------------------------------------------------------------------------------------------------------------
  ----------------------------------------------------------------COUNTY VOTERS LEGEND--------------------------------------------------------------------------------*/
    /*------------------------------------------------------------------ 
---------------------------------voters legend ------------------*/

    var intervals_voters = ['<2000', '2,000 - 6,000', '6,000 - 20,000', '20,000 - 80,000', '80,000 - 300,000', '300,000+'];
    var colors_voters = ['#ffffd4', '#fee391', '#fec44f', '#fe9929', '#d95f0e', '#993404'];
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
        county_voters_voters_legend.appendChild(item);

    }

    /*---------------------------------ages legend ------------------*/

    var intervals_age = ['46-48', '48-50', '50-52', '52-54', '54-56', '56-58'];
    var colors_age = ['#ffffcc', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8'];
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
        county_voters_ages_legend.appendChild(item);

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
        county_voters_female_legend.appendChild(item);
    }
    //.........male.................................
    var intervals_male = ['50%', '51%', '52%', "53%"];
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
        county_voters_male_legend.appendChild(item);

    }
    //---------------- Party affiliations legend ---------------------//
    //.............Republicans ......................
    var intervals_republican = ['<34%', '36%', '38%', '40+'];
    var colors_republican = ['hsl(360,100%,90.05%)', 'hsl(360,100%,74%)', 'hsl(360,100%,69%)', 'hsl(360,100%,50%)'];
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
        county_voters_republican_legend.appendChild(item);
    }
    //.............Democrats ........................
    var intervals_democrat = ['<34%', '36%', '38%', '40+'];
    var colors_democrat = ['hsl(230,100%,90.05%)', 'hsl(230,100%,74%)', 'hsl(230,100%,69%)', 'hsl(230,100%,50%)'];
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
        county_voters_democrat_legend.appendChild(item);
    }
    //.............Nonaffiliated ....................
    var intervals_nonaffiliated = ['<34%', '36%', '38%', '40+'];
    var colors_nonaffiliated = ['hsl(60,100%,90.05%)', 'hsl(60,100%,74%)', 'hsl(60,100%,69%)', 'hsl(60,100%,50%)'];
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
        county_voters_nonaffiliated_legend.appendChild(item);
    }
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}