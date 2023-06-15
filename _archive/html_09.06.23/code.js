// ---------Responsive-navbar-active-animation-----------
function test(){
	var tabsNewAnim = $('#navbarSupportedContent');
	var selectorNewAnim = $('#navbarSupportedContent').find('li').length;
	var activeItemNewAnim = tabsNewAnim.find('.active');
	var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
	var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
	var itemPosNewAnimTop = activeItemNewAnim.position();
	var itemPosNewAnimLeft = activeItemNewAnim.position();
	$(".hori-selector").css({
		"top":itemPosNewAnimTop.top + "px",
		"left":itemPosNewAnimLeft.left + "px",
		"height": activeWidthNewAnimHeight + "px",
		"width": activeWidthNewAnimWidth + "px"
	});
	$("#navbarSupportedContent").on("click","li",function(e){
		$('#navbarSupportedContent ul li').removeClass("active");
		$(this).addClass('active');
		var activeWidthNewAnimHeight = $(this).innerHeight();
		var activeWidthNewAnimWidth = $(this).innerWidth();
		var itemPosNewAnimTop = $(this).position();
		var itemPosNewAnimLeft = $(this).position();
		$(".hori-selector").css({
			"top":itemPosNewAnimTop.top + "px",
			"left":itemPosNewAnimLeft.left + "px",
			"height": activeWidthNewAnimHeight + "px",
			"width": activeWidthNewAnimWidth + "px"
		});
	});
}
$(document).ready(function(){
	setTimeout(function(){ test(); });
});
$(window).on('resize', function(){
	setTimeout(function(){ test(); }, 500);
});
//$(".navbar-toggler").click(function(){
//	$(".navbar-collapse").slideToggle(300);
//	setTimeout(function(){ test(); });
//});

// --------------add active class-on another-page move----------
jQuery(document).ready(function($){
	// Get current path and find target link
	var path = window.location.pathname.split("/").pop();

	// Account for home page with empty path
	if ( path == '' ) {
		path = 'index.html';
	}

	var target = $('#navbarSupportedContent ul li a[href="'+path+'"]');
	// Add active class to target link
	target.parent().addClass('active');
});


var myJ;
var thresholds;
var data_arr = [];

//charts ------------------
var myRadChart = null;
var myThermikChart = null;
var myAirChart = null;
var myAnalyseChart = null;

//data --------------------
var airqualityDataArr = null;
var radiationDataArr = null;
var thermikDataArr = null;

var airqualityDataJson = null;
var radiationDataJson = null;
var thermikDataJson = null;

main();


async function getThresholds(){
	return await fetch('https://www.bioklima.org:8443/measurementsthresholds/1', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
            mode: 'cors',
            credentials: 'same-origin'
        })
        .then((response) => response.json())
	.then((resJ)=>{return resJ});
}

async function setThresholds(){
	return await fetch('https://www.bioklima.org:8443/measurementsthresholds/1', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            mode: 'cors',
            credentials: 'same-origin',
            body: JSON.stringify(thresholds)
        });
}

async function caller(){
	this.thresholds = await getThresholds();
}

function main() {
    caller()
    ul(0);
}

async function getJSONRadiation(){
	return await fetch('https://www.bioklima.org:8443/radiation', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
            mode: 'cors',
            credentials: 'same-origin'
        })
        .then((response) => response.json())
	.then((resJ)=>{return resJ});
}
async function getJSONThermik(){
	return await fetch('https://www.bioklima.org:8443/thermik', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
            mode: 'cors',
            credentials: 'same-origin'
        })
        .then((response) => response.json())
	.then((resJ)=>{return resJ});
}

async function getJSONAirquality(){
	return await fetch('https://www.bioklima.org:8443/airquality', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
            mode: 'cors',
            credentials: 'same-origin'
        })
        .then((response) => response.json())
	.then((resJ)=>{return resJ});
}



async function initDatePicker() {
    //initialize the min and max values the user can pick with the datepicker
    var datepicker_s = document.getElementById("startdate");
    var datepicker_e = document.getElementById("enddate");

    var response = await getKlimaanalyse("date");

    var startdatum = response[0].date // first recorded date
    var enddatum = response[response.length-1].date // last recorded date
    datepicker_s.min = startdatum.substring(0, 4) + "-" + startdatum.substring(4, 6) + "-" + startdatum.substring(6, 8);
    datepicker_s.max = enddatum.substring(0, 4) + "-" + enddatum.substring(4, 6) + "-" + enddatum.substring(6, 8);
    datepicker_e.min = startdatum.substring(0, 4) + "-" + startdatum.substring(4, 6) + "-" + startdatum.substring(6, 8);
    datepicker_e.max = enddatum.substring(0, 4) + "-" + enddatum.substring(4, 6) + "-" + enddatum.substring(6, 8);
}

//switching pages
async function ul(index) {
    switch (index) {
        case 0:
            if(airqualityDataJson == null){
                airqualityDataJson = await getJSONAirquality()
                airqualityDataArr = jsonToArray(airqualityDataJson)
            }


            localStorage.setItem("currentPage", 0);
            document.getElementById("content").innerHTML =
                `
                <div class="chartBig">
                    <canvas id="chartAirQual"></canvas>
                    <button onclick="time_span_airquality('day')">Last Day</button>
                    <button onclick="time_span_airquality('week')">Last Week</button>
                    <button onclick="time_span_airquality('month')">Last Month</button>
                    <button onclick="time_span_airquality('year')">Last Year</button>
                    <br>
                    <br>
                    <div >
                        <button onclick="stackedMain('airChart')">Thresholds</button>
                    </div>
                </div>

            `;
            airquality_chart();



            break;
        case 1:
            if(radiationDataJson == null){
                radiationDataJson = await getJSONRadiation()
                radiationDataArr = jsonToArray(radiationDataJson)
            }

            localStorage.setItem("currentPage", 1);
            document.getElementById("content").innerHTML =
                `
                <div class="chartBig">
                    <canvas id="chartRadiation"></canvas>
                    <button onclick="time_span_radiation('day')">Last Day</button>
                    <button onclick="time_span_radiation('week')">Last Week</button>
                    <button onclick="time_span_radiation('month')">Last Month</button>
                    <button onclick="time_span_radiation('year')">Last Year</button>
                    <br>
                    <br>
                    <div>
                        <button onclick="stackedMain('radChart')">Thresholds</button>
                    </div>
                </div>
            `;
            radiation_chart();
            break;
        case 2:
            if(thermikDataJson == null){
                thermikDataJson = await getJSONThermik()
                thermikDataArr = jsonToArray(thermikDataJson)
            }

            localStorage.setItem("currentPage", 2);
            document.getElementById("content").innerHTML =
                `
                <div class="chartBig">
                    <canvas id="chartThermik"></canvas>
                    <button onclick="time_span_thermik('day')">Last Day</button>
                    <button onclick="time_span_thermik('week')">Last Week</button>
                    <button onclick="time_span_thermik('month')">Last Month</button>
                    <button onclick="time_span_thermik('year')">Last Year</button>
                    <br>
                    <br>
                    <div >
                        <button onclick="stackedMain('therChart')">Thresholds</button>
                    </div>
                </div>
            `;
            thermik_chart();
            break;
        case 3:
            localStorage.setItem("currentPage", 3);
            document.getElementById("content").innerHTML =
                `
                <div class="chartBig">
                    <canvas id="chartKlimaanalyse"></canvas>
                    <select name="selects" id="sel1"></select>
                    <select name="selects" id="sel2"></select>
                    <select name="selects" id="sel3"></select>
                    <select name="selects" id="sel4"></select>
                    <select name="selects" id="sel5"></select>
                    <br>
                    <div>
                       <div style="margin:5px">
                        <label for="startdate">Start date:</label>
                        <input type="date" id="startdate" name="startdate">
                       </div>

                       <div style="margin:5px">
                        <label for="enddate">End date:</label>
                        <input type="date" id="enddate" name="enddate">
                       </div>

                       <button style="font-size: 20px;" onclick="setDate()">Confirm</button>
                       <br>
                       <br>
                       <div >
                           <button onclick="stackedMain('klimaChart')">Thresholds</button>
                       </div>

                    </div>
                     <button id="close-dialog" onclick="csvDownload()">CSV download</button>

                </div>
            `;
            initDatePicker();
            analyse_chart();
            selectInit();
            break;
        case 4:
            localStorage.setItem("currentPage", 4);
            document.getElementById("content").innerHTML =
                `
                <div>
                    <table id="tablecontent">
                    </table>
                    <br>
                    <button style="font-size: 20px;" onclick="setThresholdsInit()">Confirm Thresholds</button>
                </div>
            `;
            initThresholds();
            break;
        case 5:
            localStorage.setItem("currentPage", 5);
            document.getElementById("content").innerHTML =
                `
                <div style="text-align:center;">
                    <h1>Impressum - Legal Notice</h1>
                    <p>Angaben gem. § 5 TMG</p>
                    <h3>Betreiber und Kontakt:</h3>

                    <p>Othmar Kyas</p>
                    <p>1. Vorsitzender Nordsee-Kurpark e.V.</p>
                    <p>Vereinsregister Amtsgericht Flensburg, VR 3170 FL</p>
                    <p>Fasanenweg 4</p>
                    <p>25039 Wyk</p>
                    <p>Telefonnummer: +49 4681 7473835</p>
                    <p>E-Mail-Adresse: ok@nordsee-kurpark.org</p>

                    <h3>Bioklimatische Messungen im Nordsee-Kurpark</h3>
                    <div style="text-align: justify;margin:0% 20%">
                        <p>
                            Bioklimatische Messungen, also die Ermittlung von Wetter- und Luftqualitätsdaten mit Auswirkung auf den Organismus sind dort am sinnvollsten, wo sich Menschen (längere) Zeit aufhalten.
                            Deshalb werden solche Messungen nicht nur an stark befahrenen Kreuzungen sondern mittlerweile auch in Grünanlagen, Parks und Sportstätten durchgeführt.
                            Dies hatte vor mehr als hundert Jahren schon Dr. Karl Gmelin, der Begründer des Nordsee-Sanatoriums und des Nordsee-Kurparks erkannt und bereits in der ersten Kursaison 1899 begonnen mit mobilen Messgeräten das Bioklima des Parks zu messen.
                            Auf Basis der Messergebnisse wurden den Kurgästen klimatherapeutische Anwendungen wie Luftkuren verschrieben.
                            Mit unserer bioklimatischen Mess-Station führen wir die Arbeit von Dr. Gmelin und der später von ihm gegründeten Bioklimatischen Forschungsanstalt fort und bieten Parkbesuchern die Möglichkeit ihren Aufenthalt im Kurpark bewußt auf die Bedürfnisse ihres Körpers abzustimmen.
                        </p>
                     </div>

                </div>
            `;
            break;
    }

    var underlines = document.querySelectorAll(".underline");

    for (var i = 0; i < underlines.length; i++) {
        underlines[i].style.transform = 'translate3d(' + index * 100 + '%,0,0)';
    }
}

function csvDownload(){
    var textToSave = `date,time,`;

    myAnalyseChart.data.datasets.forEach(element => textToSave+=element.label+",")
    textToSave = textToSave.slice(0, -1);
    textToSave+="\n";

    if(myAnalyseChart.data.datasets.length > 0){
        for(let p = 0; p < myAnalyseChart.data.datasets[0].data.length; p++){
            textToSave += new Date(myAnalyseChart.data.datasets[0].data[p].x).toLocaleDateString() + ","
                + new Date(myAnalyseChart.data.datasets[0].data[p].x).toLocaleTimeString() + ","

            for(let x = 0; x < myAnalyseChart.data.datasets.length ; x++){
                textToSave += myAnalyseChart.data.datasets[x].data[p].y + ","
            }
            textToSave = textToSave.slice(0, -1);
            textToSave+="\n";
        }
    }
    textToSave = textToSave.slice(0, -1);
    saveAs(new Blob([textToSave], {type: "text/plain;charset=utf-8"}), "weatherdata.csv");
}

function setThresholdsInit(){
    for(var i = 0; i < Object.keys(thresholds).length-1; i++){
        for(var key in thresholds){
            if(key == Object.keys(thresholds)[i]){
                thresholds[key] = document.getElementById(Object.keys(thresholds)[i]).value;
            }
        }
    }
    setThresholds();
}

function initThresholds(){
    var tablehtml = `<tr><th>Parameter</th><th>MIN-Thresholds</th><th>MAX-Thresholds</th></tr>`;

    for(var i = 0; i < Object.keys(thresholds).length; i++){
        var name = Object.keys(thresholds)[i];
        tablehtml = tablehtml + "<tr><td>" + name.slice(0,-3) + "</td><td><input type='number' id='" + name.slice(0,-3) + "min'></input></td><td><input type='number' id='" + name + "'></input></td></tr>";
        i++;
    }
    document.getElementById("tablecontent").innerHTML = tablehtml;

    for(var i = 0; i < Object.keys(thresholds).length; i++){
        document.getElementById(Object.keys(thresholds)[i]).value = Object.values(thresholds)[i];
    }

}

async function setDate() {
    var datepicker_s = document.getElementById("startdate").value;
    var datepicker_e = document.getElementById("enddate").value;

    var data = await handleKlimaanalyseRequest();

    if (datepicker_s == datepicker_e) {
        time_span_klimaanalyse_span(datepicker_s.replaceAll('-', ''), datepicker_e.replaceAll('-', ''), data)
    } else if (parseInt(datepicker_e.replaceAll('-', '')) < parseInt(datepicker_s.replaceAll('-', ''))) {
        alert("Error, Enddate muss später sein als Startdate")
    } else if (parseInt(datepicker_e.replaceAll('-', '')) > parseInt(datepicker_s.replaceAll('-', ''))) {
        time_span_klimaanalyse_span(datepicker_s.replaceAll('-', ''), datepicker_e.replaceAll('-', ''), data)
    } else {
        alert("Error, invalides Datum")
    }

}

var klimaanalyse_data = null;

async function getKlimaanalyse(fields){
	klimaanalyse_data = await fetch('https://www.bioklima.org:8443/klimaanalyse/?fields=' + fields, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
            mode: 'cors',
            credentials: 'same-origin'
        })
        .then((response) => response.json())
	.then((resJ)=>{return resJ});
	return klimaanalyse_data;
}

async function handleKlimaanalyseRequest(){
   var select = document.getElementsByName("selects");
   var fields = "date,timehhmmss,"

   select.forEach(function(element) {
       if(element.value==""){return;}
       fields += DB_MAPPINGS[element.value].toLowerCase() + ","
//       fields += element.value.toLowerCase() + ","
   })

   fields=fields.slice(0,-1);

   var jsondata = await getKlimaanalyse(fields);

   return klimaanalyse_callmakeArr(jsondata)
}

function klimaanalyse_callmakeArr(json){
    var arraydata = jsonToArray(json)
    return arraydata;
}




function selectInit() {
    var select = document.getElementsByName("selects");

    var options = db_features.slice(0); //slice(0) copies array and does not use just the reference

    options.forEach(function(element) {
        if (isNaN(db_features_1st_row[db_features.indexOf(element)])) {
            options.splice((options.indexOf(element)), 1)
        }
    })
    options = options.slice(1);
    //options.unshift("");

    options = options.filter(e => e !== 'date')
    options = options.filter(e => e !== 'timehhmmss')

    var mapped_options = [];

    options.forEach(function(option){
        mapped_options.push(getKeyByValue(DB_MAPPINGS, option))
    });
    mapped_options.unshift("");

    select.forEach(function(element) {
        for (var i = 0; i < mapped_options.length; i++) {
            var opt = mapped_options[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            element.appendChild(el);
        }
    })
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function time_span_klimaanalyse_span(startdate, enddate, data) {
    var start,ende;

    var processData = [];
    var resultData = [];

    var dateIndex = data[0].indexOf("date")+1
    var timeIndex = data[0].indexOf("timehhmmss")+1

    start = data[dateIndex].indexOf(startdate.toString())
    ende = data[dateIndex].lastIndexOf(enddate.toString()) + 1

    processData.push(data[0])
    for(let i = 1; i<data.length;i++){
        processData.push(data[i].slice(start,ende))
    }

    var daten = []

    for(let x = 0; x<processData[0].length; x++){
        daten.push([])
    }

    for (let i = 0; i < processData[dateIndex].length; i++) {
        const year = processData[dateIndex][i].slice(0, 4);
        const month = parseInt(processData[dateIndex][i].slice(4, 6)) - 1; // month is zero-indexed in Date object
        const day = processData[dateIndex][i].slice(6, 8);

        const hours = processData[timeIndex][i].slice(0, 2);
        const minutes = processData[timeIndex][i].slice(2, 4);
        const seconds = processData[timeIndex][i].slice(4, 6);

        const dateObj = new Date(year, month, day, hours, minutes, seconds);

        for(let x =0; x<processData[0].length; x++){
            daten[x].push({x: dateObj.getTime(), y: parseFloat(processData[x+1][i])});
        }


    }

    for (let x = 0; x < daten.length; x++) {
    //deduplicate and sort
        var vals = [];
        Object.values(daten[x]).forEach(elem => {
            vals.push(elem["x"])
        })
        vals = [...vals]
        ohnedup = [...(new Set(vals))]
        const toFindDuplicates = vals => vals.filter((item, index, arr) => arr.indexOf(item) !== index);
        var duplicateElements = toFindDuplicates(vals);
        Object.values(daten[x]).forEach(elem => {
            if (duplicateElements.includes(elem["x"])){
                daten[x].splice(daten[x].indexOf(elem), 1)
            }
        })
        daten[x].sort((a, b) => a.x - b.x);
    }

    myAnalyseChart.data.datasets = []

    for(let p = 0; p<daten.length; p++){
        if((p != dateIndex-1 || p != timeIndex-1)){
            if(processData[0][p] != "date" && processData[0][p] != "timehhmmss"){
                myAnalyseChart.data.datasets.push({data:  daten[p],
                                                   pointRadius: 1,
                                                   label: processData[0][p]})

            }
        }
    }

    myAnalyseChart.update()
}

function analyse_chart() {

    myAnalyseChart = new Chart("chartKlimaanalyse", {
        type: "line",
        data: {
            labels: [],
            datasets: []
        },
        options: {
        parsing: false,
        animation: false,
        scales: {
              x: {
                 type: 'time',
                 title: {
                     display: true,
                     text: 'Date',
                     font: {
                         size: 18
                     }
                 },
                 time: {
                     displayFormats: {
                         day: 'd. MMM h a',
                         hour: 'd. MMM h a',
                         month: 'd. MMM h a',
                         quarter: 'd. MMM h a',
                         year: 'd. MMM h a',
                     }
                 }
             }
            },
            responsive: true,
            plugins: {
                 decimation: {
                     enabled: true,
                     algorithm: 'lttb',
                     samples: 100,
                     threshold: 300
                 },
                legend: {
                    display: true
                },
            },
            maintainAspectRatio: false,
        }
    });
}


function time_span_airquality(zeit){
    daten = [[],[],[],[],[],[],[],[],[],[]]
    var airqualityDataSliced = airqualityDataArr;

    switch (zeit) {
        case "day":
            airqualityDataSliced = airqualityDataSliced.map(innerArray => innerArray.slice(-144)); //144 observations per day
            break;
        case "week":
            airqualityDataSliced = airqualityDataSliced.map(innerArray => innerArray.slice(-1008)); //1008 observations per week (7 days)
            break;
        case "month":
            airqualityDataSliced = airqualityDataSliced.map(innerArray => innerArray.slice(-4320)); //4320 observations per month (30 days)
            break;
        case "year":
            airqualityDataSliced = airqualityDataSliced.map(innerArray => innerArray.slice(-52560)); //52560 observations per year (365 days)
            break;
    }


    for (let i = 0; i < airqualityDataSliced[2].length; i++) {
        const year = airqualityDataSliced[2][i].slice(0, 4);
        const month = parseInt(airqualityDataSliced[2][i].slice(4, 6)) - 1; // month is zero-indexed in Date object
        const day = airqualityDataSliced[2][i].slice(6, 8);

        const hours = airqualityDataSliced[1][i].slice(0, 2);
        const minutes = airqualityDataSliced[1][i].slice(2, 4);
        const seconds = airqualityDataSliced[1][i].slice(4, 6);

        const dateObj = new Date(year, month, day, hours, minutes, seconds);

        const pm1 = {x: dateObj.getTime(), y: parseFloat(airqualityDataSliced[3][i])};
        const pm10 = {x: dateObj.getTime(), y: parseFloat(airqualityDataSliced[4][i])};
        const pm2_5 = {x: dateObj.getTime(), y: parseFloat(airqualityDataSliced[5][i])};
        const o3 = {x: dateObj.getTime(), y: parseFloat(airqualityDataSliced[6][i])};
        const no2 = {x: dateObj.getTime(), y: parseFloat(airqualityDataSliced[7][i])};
        const so2 = {x: dateObj.getTime(), y: parseFloat(airqualityDataSliced[8][i])};
        const co = {x: dateObj.getTime(), y: parseFloat(airqualityDataSliced[9][i])};
        const h2s = {x: dateObj.getTime(), y: parseFloat(airqualityDataSliced[10][i])};
        const no = {x: dateObj.getTime(), y: parseFloat(airqualityDataSliced[11][i])};
        const airqual = {x: dateObj.getTime(), y: parseFloat(airqualityDataSliced[12][i])};

        daten[0].push(pm1);
        daten[1].push(pm10);
        daten[2].push(pm2_5);
        daten[3].push(o3);
        daten[4].push(no2);
        daten[5].push(so2);
        daten[6].push(co);
        daten[7].push(h2s);
        daten[8].push(no);
        daten[9].push(airqual);
    }


    for (let x = 0; x < daten.length; x++) {
    //deduplicate and sort
        var vals = [];
        Object.values(daten[x]).forEach(elem => {
            vals.push(elem["x"])
        })
        vals = [...vals]
        ohnedup = [...(new Set(vals))]
        const toFindDuplicates = vals => vals.filter((item, index, arr) => arr.indexOf(item) !== index);
        var duplicateElements = toFindDuplicates(vals);
        Object.values(daten[x]).forEach(elem => {
            if (duplicateElements.includes(elem["x"])){
                daten[x].splice(daten[x].indexOf(elem), 1)
            }
        })
        daten[x].sort((a, b) => a.x - b.x);
    }

    myAirChart.data.datasets[0].data = daten[0]
    myAirChart.data.datasets[1].data = daten[1]
    myAirChart.data.datasets[2].data = daten[2]
    myAirChart.data.datasets[3].data = daten[3]
    myAirChart.data.datasets[4].data = daten[4]
    myAirChart.data.datasets[5].data = daten[5]
    myAirChart.data.datasets[6].data = daten[6]
    myAirChart.data.datasets[7].data = daten[7]
    myAirChart.data.datasets[8].data = daten[8]
    myAirChart.data.datasets[9].data = daten[9]

    myAirChart.update()
}

function airquality_chart() {
    var temp_arr = [];

    myAirChart = new Chart("chartAirQual", {
        type: "line",
        data: {
            labels: temp_arr[0],
            datasets: [{
                    data: [],
                    pointRadius: 1,
                    label: "PM 1",
                    yAxisID: 'B',
                    borderColor: "rgba(255, 0, 0, 1)",
                    backgroundColor: "rgba(255, 0, 0, 1)"
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "PM 2.5",
                    yAxisID: 'C',
                    borderColor: "rgba(255, 150, 0, 1)",
                    backgroundColor: "rgba(255, 150, 0, 1)",
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "PM 10",
                    yAxisID: 'B',
                    borderColor: "rgba(255, 255, 0, 1)",
                    backgroundColor: "rgba(255, 255, 0, 1)",
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "O3",
                    yAxisID: 'C',
                    borderColor: "rgba(0, 180, 0, 1)",
                    backgroundColor: "rgba(0, 180, 0, 1)",
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "NO2",
                    yAxisID: 'C',
                    borderColor: "rgba(0, 255, 255, 1)",
                    backgroundColor: "rgba(0, 255, 255, 1)",
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "SO2",
                    yAxisID: 'B',
                    borderColor: "rgba(0, 0, 255, 1)",
                    backgroundColor: "rgba(0, 0, 255, 1)",
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "CO",
                    yAxisID: 'B',
                    borderColor: "rgba(140, 140, 140, 1)",
                    backgroundColor: "rgba(140, 140, 140, 1)"
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "H2S",
                    yAxisID: 'B',
                    borderColor: "rgba(200, 0, 200, 1)",
                    backgroundColor: "rgba(200, 0, 200, 1)"
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "NO",
                    yAxisID: 'C',
                    borderColor: "rgba(200, 60, 1)",
                    backgroundColor: "rgba(200, 60, 1)"
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Air-Quality-Index",
                    yAxisID: 'D',
                    borderColor: "rgba(0, 0, 0, 1)",
                    backgroundColor: "rgba(0, 0, 0, 1)"
                }
            ]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            maintainAspectRatio: false,
            scales: {
                B: {
                    position: 'right',
                    title: {
                        display: true,
                        text: 'µg/m³',
                        font: {
                            size: 18
                        },
                    }
                },
                C: {
                    position: 'right',
                    title: {
                        display: true,
                        text: 'µg/m³',
                        font: {
                            size: 18
                        }
                    }
                },
                D: {
                    ticks: {
                        color: 'black'
                    },
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Air-Quality-Index',
                        font: {
                            size: 18
                        },
                        color: 'black'
                    }
                },
               x: {
                   type: 'time',
                   title: {
                       display: true,
                       text: 'Date',
                       font: {
                           size: 18
                       }
                   },
                    time: {
                        displayFormats: {
                            day: 'd. MMM h a',
                            hour: 'd. MMM h a',
                            month: 'd. MMM h a',
                            quarter: 'd. MMM h a',
                            year: 'd. MMM h a',
                        }
                    }
               }
            },
            parsing: false,
            animation: false,
            plugins: {
                decimation: {
                    enabled: true,
                    algorithm: 'lttb',
                    samples: 100,
                    threshold: 300
                },
//                zoom: {
//
//                    pan: {
//                        enabled: true,
//                        mode: 'xy',
//                      },
//                      zoom: {
//                        wheel: {
//                          enabled: true,
//                        },
//                        pinch: {
//                          enabled: true
//                        },
//                        mode: 'xy',
//                        onZoomComplete({chart}) {
//                          // This update is needed to display up to date zoom level in the title.
//                          // Without this, previous zoom level is displayed.
//                          // The reason is: title uses the same beforeUpdate hook, and is evaluated before zoom.
//                          chart.update('none');
//                        }
//                      }
//
//                },
                legend: {
                    display: true
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.formattedValue + ((context.dataset.label.includes("Air-Quality-Index") ? ('') : (' µg/m³')));
                        },
                    }
                }
            },
        }
    });

    time_span_airquality("day");
}


function jsonToArray(json){
    var newData = [];
    const dataJson = json;

    newData.push([])

    //labels
    for (var val in dataJson[0]){
        newData[0].push(val)
    }
    //make array ?places? for each label
    for(let x = 0; x < newData[0].length; x++){
        newData.push([]);
    }
    //fill data
    for (let i = 0; i < dataJson.length; i++){
        c = 0
        for (var val in dataJson[i]){
            c++
            newData[c].push(dataJson[i][val])
        }

    }
    return newData;
}


function time_span_radiation(zeit){
    daten = [[],[],[]]
    var radiationDataSliced = radiationDataArr;

    switch (zeit) {
        case "day":
            radiationDataSliced = radiationDataSliced.map(innerArray => innerArray.slice(-144)); //144 observations per day
            break;
        case "week":
            radiationDataSliced = radiationDataSliced.map(innerArray => innerArray.slice(-1008)); //1008 observations per week
            break;
        case "month":
             radiationDataSliced = radiationDataSliced.map(innerArray => innerArray.slice(-4320)); //4320 observations per month (30 days)
            break;
        case "year":
            radiationDataSliced = radiationDataSliced.map(innerArray => innerArray.slice(-52560)); //52560 observations per year (365 days)
            break;
    }


    for (let i = 0; i < radiationDataSliced[2].length; i++) {
        const year = radiationDataSliced[2][i].slice(0, 4);
        const month = parseInt(radiationDataSliced[2][i].slice(4, 6)) - 1; // month is zero-indexed in Date object
        const day = radiationDataSliced[2][i].slice(6, 8);

        const hours = radiationDataSliced[1][i].slice(0, 2);
        const minutes = radiationDataSliced[1][i].slice(2, 4);
        const seconds = radiationDataSliced[1][i].slice(4, 6);

        const dateObj = new Date(year, month, day, hours, minutes, seconds);

        const uv = {x: dateObj.getTime(), y: parseFloat(radiationDataSliced[3][i])};
        const rad = {x: dateObj.getTime(), y: parseFloat(radiationDataSliced[4][i])};
        const bright = {x: dateObj.getTime(), y: parseFloat(radiationDataSliced[5][i])};

        daten[0].push(uv);
        daten[1].push(rad);
        daten[2].push(bright);
    }


    for (let x = 0; x < daten.length; x++) {
    //deduplicate and sort
        var vals = [];
        Object.values(daten[x]).forEach(elem => {
            vals.push(elem["x"])
        })
        vals = [...vals]
        ohnedup = [...(new Set(vals))]
        const toFindDuplicates = vals => vals.filter((item, index, arr) => arr.indexOf(item) !== index);
        var duplicateElements = toFindDuplicates(vals);
        Object.values(daten[x]).forEach(elem => {
            if (duplicateElements.includes(elem["x"])){
                daten[x].splice(daten[x].indexOf(elem), 1)
            }
        })
        daten[x].sort((a, b) => a.x - b.x);
    }

    myRadChart.data.datasets[0].data = daten[0]
    myRadChart.data.datasets[1].data = daten[1]
    myRadChart.data.datasets[2].data = daten[2]

    myRadChart.update()

}


function radiation_chart() {
    var temp_arr = [];

    myRadChart = new Chart("chartRadiation", {
        type: "line",
        data: {
            labels: [],
            datasets: [
            {
                    data: [],
                    pointRadius: 1,
                    label: "UV Index",
                    yAxisID: 'A',
                    borderColor: "rgba(36, 47, 255, 1)",
                    backgroundColor: "rgba(36, 47, 255, 1)"
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Solar Radiation",
                    yAxisID: 'B',
                    borderColor: "rgba(255, 10, 10, 1)",
                    backgroundColor: "rgba(255, 10, 10, 1)"
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Brightness",
                    yAxisID: 'C',
                    borderColor: "rgba(255, 180, 31, 1)",
                    backgroundColor: "rgba(255, 180, 31, 1)",
                }
            ]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            maintainAspectRatio: false,
            scales: {
                A: {
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        max: 1,
                        min: 0,
                        color: 'blue'
                    },
                    title: {
                        display: true,
                        text: 'UV',
                        font: {
                            size: 18,

                        },
                        color: "blue"
                    }
                },
                B: {
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        color: 'red'
                    },
                    title: {
                        display: true,
                        text: 'Solar Radiation',
                        font: {
                            size: 18,

                        },
                        color: "red"
                    }
                },
                C: {
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        color: 'orange'
                    },
                    title: {
                        display: true,
                        text: 'Helligkeit',
                        font: {
                            size: 18,

                        },
                        color: "orange"
                    }
                },
                x: {
                    type: 'time',
//                    time: {unit:'day',},
                    title: {
                        display: true,
                        text: 'Date',
                        font: {
                            size: 18
                        }
                    },
                    time: {
                        displayFormats: {
                            day: 'd. MMM h a',
                            hour: 'd. MMM h a',
                            month: 'd. MMM h a',
                            quarter: 'd. MMM h a',
                            year: 'd. MMM h a',
                        }
                    }
                }
            },
            parsing: false,
            animation: false,
            plugins: {
                decimation: {
                        enabled: true,
                        algorithm: 'lttb',
                        samples: 150,
                        threshold: 300
//                        algorithm: 'min-max',
                },
                legend: {
                    display: true
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.formattedValue + ((context.dataset.label.includes("Solar")) ? (' W/m²') : ((context.dataset.label.includes("Helligkeit") ? (' Lux') : (''))));
                        },
                    }
                }
           }
        }
    });

  time_span_radiation("day");

  myRadChart.update();
}


function time_span_thermik(zeit){
    daten = [[],[],[],[],[],[]]

    var thermikDataSliced = thermikDataArr;

    switch (zeit) {
        case "day":
            thermikDataSliced = thermikDataSliced.map(innerArray => innerArray.slice(-144)); //144 observations per day
            break;
        case "week":
            thermikDataSliced = thermikDataSliced.map(innerArray => innerArray.slice(-1008)); //1008 observations per week
            break;
        case "month":
             thermikDataSliced = thermikDataSliced.map(innerArray => innerArray.slice(-4320)); //4320 observations per month (30 days)
            break;
        case "year":
            thermikDataSliced = thermikDataSliced.map(innerArray => innerArray.slice(-52560)); //52560 observations per year (365 days)
            break;
    }


    for (let i = 0; i < thermikDataSliced[2].length; i++) {
        const year = thermikDataSliced[2][i].slice(0, 4);
        const month = parseInt(thermikDataSliced[2][i].slice(4, 6)) - 1; // month is zero-indexed in Date object
        const day = thermikDataSliced[2][i].slice(6, 8);

        const hours = thermikDataSliced[1][i].slice(0, 2);
        const minutes = thermikDataSliced[1][i].slice(2, 4);
        const seconds = thermikDataSliced[1][i].slice(4, 6);

        const dateObj = new Date(year, month, day, hours, minutes, seconds);

        const wspeed = {x: dateObj.getTime(), y: parseFloat(thermikDataSliced[3][i])};
        const bearing = {x: dateObj.getTime(), y: parseFloat(thermikDataSliced[4][i])};
        const temp = {x: dateObj.getTime(), y: parseFloat(thermikDataSliced[5][i])};
        const hum = {x: dateObj.getTime(), y: parseFloat(thermikDataSliced[6][i])};
        const press = {x: dateObj.getTime(), y: parseFloat(thermikDataSliced[7][i])};
        const rrate = {x: dateObj.getTime(), y: parseFloat(thermikDataSliced[8][i])};

        daten[0].push(wspeed);
        daten[1].push(bearing);
        daten[2].push(temp);
        daten[3].push(hum);
        daten[4].push(press);
        daten[5].push(rrate);
    }


    for (let x = 0; x < daten.length; x++) {
    //deduplicate and sort
        var vals = [];
        Object.values(daten[x]).forEach(elem => {
            vals.push(elem["x"])
        })
        vals = [...vals]
        ohnedup = [...(new Set(vals))]
        const toFindDuplicates = vals => vals.filter((item, index, arr) => arr.indexOf(item) !== index);
        var duplicateElements = toFindDuplicates(vals);
        Object.values(daten[x]).forEach(elem => {
            if (duplicateElements.includes(elem["x"])){
                daten[x].splice(daten[x].indexOf(elem), 1)
            }
        })
        daten[x].sort((a, b) => a.x - b.x);
    }

    myThermikChart.data.datasets[0].data = daten[0]
    myThermikChart.data.datasets[1].data = daten[1]
    myThermikChart.data.datasets[2].data = daten[2]
    myThermikChart.data.datasets[3].data = daten[3]
    myThermikChart.data.datasets[4].data = daten[4]
    myThermikChart.data.datasets[5].data = daten[5]

    myThermikChart.update()
}

function thermik_chart() {
    var temp_arr = [];

    myThermikChart = new Chart("chartThermik", {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                    data: [],
                    pointRadius: 1,
                    label: "Wind Speed",
                    yAxisID: 'B',
                    borderColor: "rgba(100, 130, 255, 1)",
                    backgroundColor: "rgba(100, 130, 255, 1)",
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Wind Direction",
                    yAxisID: 'A',
                    borderColor: "rgba(255, 120, 0, 1)",
                    backgroundColor: "rgba(255, 120, 0, 1)",
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Temperature",
                    yAxisID: 'B',
                    borderColor: "rgba(255, 25, 25, 1)",
                    backgroundColor: "rgba(255, 25, 25, 1)",

                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Humidity",
                    yAxisID: 'P',
                    borderColor: "rgba(100, 255, 100, 1)",
                    backgroundColor: "rgba(100, 255, 100, 1)",
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Air Pressure",
                    yAxisID: 'A',
                    borderColor: "rgba(255, 255, 10, 1)",
                    backgroundColor: "rgba(255, 255, 10, 1)",
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Rainfall Rate",
                    yAxisID: 'I',
                    borderColor: "rgba(0, 255, 255, 1)",
                    backgroundColor: "rgba(0, 255, 255, 1)",
                }
            ]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            maintainAspectRatio: false,
            scales: {
                A: {
                    type: 'linear',
                    position: 'left',
                },
                P: {
                    position: 'right',
                    ticks: {
                        color: "rgba(0, 210, 0, 1)",
                        callback: function(val) {
                            return (Math.round(val * 10) / 10) + " %";
                        },
                    },
                },
                I: {
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        color: "rgba(0, 210, 210, 1)",
                    }
                },
                B: {
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        color: '#e65c00'
                    },
                },
                x: {
                    type: 'time',
                    title: {
                        display: true,
                        text: 'Date',
                        font: {
                            size: 18
                        }
                    },
                    time: {
                        displayFormats: {
                            day: 'd. MMM h a',
                            hour: 'd. MMM h a',
                            month: 'd. MMM h a',
                            quarter: 'd. MMM h a',
                            year: 'd. MMM h a',
                        }
                    }
                }
            },
            parsing: false,
            animation: false,
            plugins: {
                decimation: {
                    enabled: true,
                    algorithm: 'lttb',
                    samples: 100,
                    threshold: 300
                },
                legend: {
                    display: true
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            var unit = "";
                            switch (context.dataset.label) {
                                case "Wind Speed":
                                    unit = " m/s";
                                    break;

                                case "Wind Direction":
                                    unit = " °";
                                    break;

                                case "Temperature":
                                    unit = " °C";
                                    break;

                                case "Humidity":
                                    unit = " %";
                                    break;

                                case "Air Pressure":
                                    unit = " hPa";
                                    break;

                                case "Rainfall Rate":
                                    unit = " mm/h";
                                    break;

                                default:
                                    unit = "";
                            }
                            return context.dataset.label + ': ' + context.formattedValue + unit;
                        },
                    }
                }
            }
        }
    });

    time_span_thermik("day");
}