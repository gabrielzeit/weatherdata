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


// Add active class on another page linked
// ==========================================
// $(window).on('load',function () {
//     var current = location.pathname;
//     console.log(current);
//     $('#navbarSupportedContent ul li a').each(function(){
//         var $this = $(this);
//         // if the current path is like this link, make it active
//         if($this.attr('href').indexOf(current) !== -1){
//             $this.parent().addClass('active');
//             $this.parents('.menu-submenu').addClass('show-dropdown');
//             $this.parents('.menu-submenu').parent().addClass('active');
//         }else{
//             $this.parent().removeClass('active');
//         }
//     })
// });

var myJ;
var thresholds;
var data_arr = [];

//charts ------------------
var myRadChart = null;
var myThermikChart = null;
var myAirChart = null;
var myAnalyseChart = null;

//data --------------------
var airqualityData = null;
var radiationData = null;
var thermikData = null;

main();

async function getJSON(){
	return await fetch('http://85.214.154.12:8080/measurements', {
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

async function getThresholds(){
	return await fetch('http://85.214.154.12:8080/measurementsthresholds/1', {
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
	return await fetch('http://85.214.154.12:8080/measurementsthresholds/1', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            mode: 'cors',
            credentials: 'same-origin',
            body: thresholds
        });
}

async function caller(){
	myJ = await getJSON();
	thresholds = await getThresholds();
	data_transform(myJ, thresholds);
}

function main() {

//    alert("Loading data started. Please wait...")
//    caller()

    data_transform();
    ul(0);
}

function data_transform(myJ, thresholds) {
    var data_all = data.split("\n");

    for (let i = 0; i < data_all.length; i++) {
        var data_row = data_all[i].split(",");
        data_arr.push(data_row);
    }

    this.thresholds = JSON.parse(thres)
//    this.thresholds = thresholds
    //console.log(Object.values(this.thresholds[0]))

//    var newData = [];
//        const dataJson = myJ
//        //JSON.parse(myJ)
//        newData.push([])
//        for (var val in dataJson[0]){
//            newData[0].push(val)
//        }
//        for (let i = 0; i < dataJson.length; i++){
//            newData.push([])
//            for (var val in dataJson[i]){
//                newData[i+1].push(dataJson[i][val])
//            }
//        }
//        newData.push([''])
//    data_arr=newData
//alert("Data loaded successfully")
}


async function getJSONRadiation(){
	return await fetch('http://85.214.154.12:8080/radiation', {
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
	return await fetch('http://85.214.154.12:8080/thermik', {
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
	return await fetch('http://85.214.154.12:8080/airquality', {
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

//function initDatePicker(){
//    //initialize the min and max values the user can pick with the datepicker
//    	var datepicker = document.getElementById("temp_day_hour");
//    	var startdatum = data_arr[1][13].toString();
//    	var enddatum = data_arr[data_arr.length -2][13].toString();
//        datepicker.min = startdatum.substring(0,4) + "-" + startdatum.substring(4,6) + "-" + startdatum.substring(6,8);
//        datepicker.max = enddatum.substring(0,4) + "-" + enddatum.substring(4,6) + "-" + enddatum.substring(6,8);
//}

function initDatePicker() {
    //initialize the min and max values the user can pick with the datepicker
    var datepicker_s = document.getElementById("startdate");
    var datepicker_e = document.getElementById("enddate");
    var startdatum = data_arr[1][13].toString();
    var enddatum = data_arr[data_arr.length - 2][13].toString();
    datepicker_s.min = startdatum.substring(0, 4) + "-" + startdatum.substring(4, 6) + "-" + startdatum.substring(6, 8);
    datepicker_s.max = enddatum.substring(0, 4) + "-" + enddatum.substring(4, 6) + "-" + enddatum.substring(6, 8);
    datepicker_e.min = startdatum.substring(0, 4) + "-" + startdatum.substring(4, 6) + "-" + startdatum.substring(6, 8);
    datepicker_e.max = enddatum.substring(0, 4) + "-" + enddatum.substring(4, 6) + "-" + enddatum.substring(6, 8);
}

//switching pages
async function ul(index) {
    switch (index) {
        case 0:
            if(airqualityData == null){
                json = await getJSONAirquality()
                airqualityData = jsonToArray(json)
            }


            localStorage.setItem("currentPage", 0);
            document.getElementById("content").innerHTML =
                `
                <div class="chartBig"><canvas id="chartAirQual"></canvas>
                    <button onclick="time_span_airquality('day')">Last Day</button>
                    <button onclick="time_span_airquality('week')">Last Week</button>
                    <button onclick="time_span_airquality('month')">Last Month</button>
                    <button onclick="time_span_airquality('year')">Last Year</button>
                    <!-- <br><button>Show threshold transgressions</button> --!>

                </div>

            `;
            airquality_chart();
            break;
        case 1:
            if(radiationData == null){
                json = await getJSONRadiation()
                radiationData = jsonToArray(json)
            }

            localStorage.setItem("currentPage", 1);
            document.getElementById("content").innerHTML =
                `
                <div class="chartBig"><canvas id="chartRadiation"></canvas>
                    <button onclick="time_span_radiation('day')">Last Day</button>
                    <button onclick="time_span_radiation('week')">Last Week</button>
                    <button onclick="time_span_radiation('month')">Last Month</button>
                    <button onclick="time_span_radiation('year')">Last Year</button>
                </div>
            `;
            radiation_chart();
            break;
        case 2:
            if(thermikData == null){
                json = await getJSONThermik()
                thermikData = jsonToArray(json)
            }

            localStorage.setItem("currentPage", 2);
            document.getElementById("content").innerHTML =
                `
                <div class="chartBig"><canvas id="chartThermik"></canvas>
                    <button onclick="time_span_thermik('day')">Last Day</button>
                    <button onclick="time_span_thermik('week')">Last Week</button>
                    <button onclick="time_span_thermik('month')">Last Month</button>
                    <button onclick="time_span_thermik('year')">Last Year</button>
                </div>
            `;
            thermik_chart();
            break;
        case 3:
            localStorage.setItem("currentPage", 3);
            document.getElementById("content").innerHTML =
                `
                <div class="chartBig"><canvas id="chartKlimaanalyse"></canvas>
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

                        <button onclick="setDate()">Datum bestätigen</button>
                    </div>
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

                        <!--<tr>
                            <td>Wert</td>
                            <td><input></input></td>
                            <td><input></input></td>
                        </tr>
                        <tr>
                            <td>Wert2</td>
                            <td><input></input></td>
                            <td><input></input></td>
                        </tr>
                        <tr>
                            <td>Wert3</td>
                            <td><input></input></td>
                            <td><input></input></td>
                        </tr>--!>
                    </table>
                    <button onclick="setThresholds()">Schwellenwerte bestätigen</button>
                </div>
            `;
            initThresholds();
            break;
        default:
    }

    var underlines = document.querySelectorAll(".underline");

    for (var i = 0; i < underlines.length; i++) {
        underlines[i].style.transform = 'translate3d(' + index * 100 + '%,0,0)';
    }
}

function setThresholds(){
    for(var i = 0; i < Object.keys(thresholds[0]).length-1; i++){
        for(var key in thresholds[0]){
            if(key == Object.keys(thresholds[0])[i]){
                thresholds[0][key] = document.getElementById(Object.keys(thresholds[0])[i]).value;
            }
        }
    }
    setThresholds();
}

function initThresholds(){
    var tablehtml = `<tr><th>Parameter</th><th>MIN-Schwellwert</th><th>MAX-Schwellwert</th></tr>`;
    for(var i = 0; i < Object.keys(thresholds[0]).length-1; i++){
        var name = Object.keys(thresholds[0])[i];
        tablehtml = tablehtml + "<tr><td>" + name.slice(0,-3) + "</td><td><input type='number' id='" + name.slice(0,-3) + "MIN'></input></td><td><input type='number' id='" + name + "'></input></td></tr>";
        i++;
    }
    document.getElementById("tablecontent").innerHTML = tablehtml;

    for(var i = 0; i < Object.keys(thresholds[0]).length-1; i++){
        document.getElementById(Object.keys(thresholds[0])[i]).value = Object.values(thresholds[0])[i];
    }

}

function setDate() {
    var datepicker_s = document.getElementById("startdate").value;
    var datepicker_e = document.getElementById("enddate").value;

    if (datepicker_s == datepicker_e) {
        time_span_klimaanalyse_day(datepicker_s.replaceAll('-', ''));
    } else if (parseInt(datepicker_e.replaceAll('-', '')) < parseInt(datepicker_s.replaceAll('-', ''))) {
        console.log("Error, Enddate muss später sein als Startdate")
    } else if (parseInt(datepicker_e.replaceAll('-', '')) > parseInt(datepicker_s.replaceAll('-', ''))) {
        time_span_klimaanalyse_span(datepicker_s.replaceAll('-', ''), datepicker_e.replaceAll('-', ''))
    } else {
        console.log("Error, invalides Datum")
    }
}

function selectInit() {
    var select = document.getElementsByName("selects");
    var options = data_arr[0].slice(0); //slice(0) copies array and does not use just the reference
    options.forEach(function(element) {
        if (isNaN(data_arr[1][data_arr[0].indexOf(element)])) {
            options.splice((options.indexOf(element)), 1)
        }
    })
    options = options.slice(1);
    options.unshift("");

    select.forEach(function(element) {
        for (var i = 0; i < options.length; i++) {
            var opt = options[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            element.appendChild(el);
        }
    })
}

function time_span_klimaanalyse_span(startdate, enddate) {
    document.getElementById("sel1").removeEventListener('change', event);
    document.getElementById("sel2").removeEventListener('change', event);
    document.getElementById("sel3").removeEventListener('change', event);
    document.getElementById("sel4").removeEventListener('change', event);
    document.getElementById("sel5").removeEventListener('change', event);

    var span_data = [];
    var arr = [
        [],
        [],
        [],
        [],
        [],
        []
    ];

    myAnalyseChart.data.labels = arr[0];
    myAnalyseChart.data.datasets[0].data = arr[1];
    myAnalyseChart.data.datasets[1].data = arr[2];
    myAnalyseChart.data.datasets[2].data = arr[3];
    myAnalyseChart.data.datasets[3].data = arr[4];
    myAnalyseChart.data.datasets[4].data = arr[5];
    myAnalyseChart.data.datasets[0].label = "";
    myAnalyseChart.data.datasets[1].label = "";
    myAnalyseChart.data.datasets[2].label = "";
    myAnalyseChart.data.datasets[3].label = "";
    myAnalyseChart.data.datasets[4].label = "";

    myAnalyseChart.update();

    //x axis timestamp
    for (let x = 1; x < data_arr.length; x++) {
            if (data_arr[x][13] === undefined) {
                break;
            }
            while (parseInt(data_arr[x][13]) >= parseInt(startdate) && parseInt(data_arr[x][13]) <= parseInt(enddate)) {
                //time
                var zeit = data_arr[x][14].toString();
                while (zeit.length < 6) {
                    zeit = "0" + zeit;
                }
                zeit = (zeit.replace(/.{2}/g, '$&:')).slice(0, -4);
                //date
                var dateString = data_arr[x][13];
                var year = dateString.substring(0, 4);
                var month = dateString.substring(4, 6);
                var day = dateString.substring(6, 8);
                var datum = new Date(year + "-" + month + "-" + day);
                datum = datum.toISOString().substring(0, 10);

                arr[0].push((datum + " " + zeit))
                x++;
            }
        }
    myAnalyseChart.data.labels = arr[0];

    document.getElementById("sel1").addEventListener('change', (event) => {
        arr[1] = [];
        if (event.target.value != null) {
            for (let x = 1; x < data_arr.length; x++) {
                if (data_arr[x][13] === undefined) {
                    break;
                }
                while (parseInt(data_arr[x][13]) >= parseInt(startdate) && parseInt(data_arr[x][13]) <= parseInt(enddate)) {
                    arr[1].push(data_arr[x][data_arr[0].indexOf(event.target.value)]);
                    break;
                }
            }
        }


        myAnalyseChart.data.datasets[0].data = arr[1];
        myAnalyseChart.data.datasets[0].label = event.target.value;
        myAnalyseChart.update();
    });
    document.getElementById("sel1").dispatchEvent(new Event("change"));

    document.getElementById("sel2").addEventListener('change', (event) => {
        arr[2] = [];
        if (event.target.value != null) {
            for (let x = 1; x < data_arr.length; x++) {
                if (data_arr[x][13] === undefined) {
                    break;
                }
                while (parseInt(data_arr[x][13]) >= parseInt(startdate) && parseInt(data_arr[x][13]) <= parseInt(enddate)) {
                    arr[2].push(data_arr[x][data_arr[0].indexOf(event.target.value)]);
                    break;
                }
            }
        }
        myAnalyseChart.data.datasets[1].data = arr[2];
        myAnalyseChart.data.datasets[1].label = event.target.value;
        myAnalyseChart.update();
    });
    document.getElementById("sel2").dispatchEvent(new Event("change"));

    document.getElementById("sel3").addEventListener('change', (event) => {
        arr[3] = [];
        if (event.target.value != null) {
            for (let x = 1; x < data_arr.length; x++) {
                if (data_arr[x][13] === undefined) {
                    break;
                }
                while (parseInt(data_arr[x][13]) >= parseInt(startdate) && parseInt(data_arr[x][13]) <= parseInt(enddate)) {
                    arr[3].push(data_arr[x][data_arr[0].indexOf(event.target.value)]);
                    break;
                }
            }
        }
        myAnalyseChart.data.datasets[2].data = arr[3];
        myAnalyseChart.data.datasets[2].label = event.target.value;
        myAnalyseChart.update();
    });
    document.getElementById("sel3").dispatchEvent(new Event("change"));

    document.getElementById("sel4").addEventListener('change', (event) => {
        arr[4] = [];
        if (event.target.value != null) {
            for (let x = 1; x < data_arr.length; x++) {
                if (data_arr[x][13] === undefined) {
                    break;
                }
                while (parseInt(data_arr[x][13]) >= parseInt(startdate) && parseInt(data_arr[x][13]) <= parseInt(enddate)) {
                    arr[4].push(data_arr[x][data_arr[0].indexOf(event.target.value)]);
                    break;
                }
            }
        }
        myAnalyseChart.data.datasets[3].data = arr[4];
        myAnalyseChart.data.datasets[3].label = event.target.value;
        myAnalyseChart.update();
    });
    document.getElementById("sel4").dispatchEvent(new Event("change"));

    document.getElementById("sel5").addEventListener('change', (event) => {
        arr[5] = [];
        if (event.target.value != null) {
            for (let x = 1; x < data_arr.length; x++) {
                if (data_arr[x][13] === undefined) {
                    break;
                }
                while (parseInt(data_arr[x][13]) >= parseInt(startdate) && parseInt(data_arr[x][13]) <= parseInt(enddate)) {
                    arr[5].push(data_arr[x][data_arr[0].indexOf(event.target.value)]);
                    break;
                }
            }
        }
        myAnalyseChart.data.datasets[4].data = arr[5];
        myAnalyseChart.data.datasets[4].label = event.target.value;
        myAnalyseChart.update();
    });
    document.getElementById("sel5").dispatchEvent(new Event("change"));

}

function time_span_klimaanalyse_day(chosen_day) {
    document.getElementById("sel1").removeEventListener('change', event);
    document.getElementById("sel2").removeEventListener('change', event);
    document.getElementById("sel3").removeEventListener('change', event);
    document.getElementById("sel4").removeEventListener('change', event);
    document.getElementById("sel5").removeEventListener('change', event);

    var arr = [
        [],
        [],
        [],
        [],
        [],
        []
    ];
    var today = chosen_day;
    for (let x = 1; x < data_arr.length; x++) {
        if (data_arr[x][13] === undefined) {
            break;
        }
        while (data_arr[x][13] == today) {
            var zeit = data_arr[x][14].toString();
            while (zeit.length < 6) {
                zeit = "0" + zeit;
            }
            zeit = (zeit.replace(/.{2}/g, '$&:')).slice(0, -4);
            arr[0].push(zeit);
            break;
        }
    }
    myAnalyseChart.data.labels = arr[0];
    myAnalyseChart.update();

    document.getElementById("sel1").addEventListener('change', (event) => {
        arr[1] = [];
        if (event.target.value != null) {
            for (let x = 1; x < data_arr.length; x++) {
                if (data_arr[x][13] === undefined) {
                    break;
                }
                while (data_arr[x][13] == today) {
                    arr[1].push(data_arr[x][data_arr[0].indexOf(event.target.value)]);
                    break;
                }
            }
        }
        myAnalyseChart.data.datasets[0].data = arr[1];
        myAnalyseChart.data.datasets[0].label = event.target.value;
        myAnalyseChart.update();
    });
    document.getElementById("sel1").dispatchEvent(new Event("change"));

    document.getElementById("sel2").addEventListener('change', (event) => {
        arr[2] = [];
        if (event.target.value != null) {
            for (let x = 1; x < data_arr.length; x++) {
                if (data_arr[x][13] === undefined) {
                    break;
                }
                while (data_arr[x][13] == today) {
                    arr[2].push(data_arr[x][data_arr[0].indexOf(event.target.value)]);
                    break;
                }
            }
        }
        myAnalyseChart.data.datasets[1].data = arr[2];
        myAnalyseChart.data.datasets[1].label = event.target.value;
        myAnalyseChart.update();
    });
    document.getElementById("sel2").dispatchEvent(new Event("change"));

    document.getElementById("sel3").addEventListener('change', (event) => {
        arr[3] = [];
        if (event.target.value != null) {
            for (let x = 1; x < data_arr.length; x++) {
                if (data_arr[x][13] === undefined) {
                    break;
                }
                while (data_arr[x][13] == today) {
                    arr[3].push(data_arr[x][data_arr[0].indexOf(event.target.value)]);
                    break;
                }
            }
        }
        myAnalyseChart.data.datasets[2].data = arr[3];
        myAnalyseChart.data.datasets[2].label = event.target.value;
        myAnalyseChart.update();
    });
    document.getElementById("sel3").dispatchEvent(new Event("change"));

    document.getElementById("sel4").addEventListener('change', (event) => {
        arr[4] = [];
        if (event.target.value != null) {
            for (let x = 1; x < data_arr.length; x++) {
                if (data_arr[x][13] === undefined) {
                    break;
                }
                while (data_arr[x][13] == today) {
                    arr[4].push(data_arr[x][data_arr[0].indexOf(event.target.value)]);
                    break;
                }
            }
        }
        myAnalyseChart.data.datasets[3].data = arr[4];
        myAnalyseChart.data.datasets[3].label = event.target.value;
        myAnalyseChart.update();
    });
    document.getElementById("sel4").dispatchEvent(new Event("change"));

    document.getElementById("sel5").addEventListener('change', (event) => {
        arr[5] = [];
        if (event.target.value != null) {
            for (let x = 1; x < data_arr.length; x++) {
                if (data_arr[x][13] === undefined) {
                    break;
                }
                while (data_arr[x][13] == today) {
                    arr[5].push(data_arr[x][data_arr[0].indexOf(event.target.value)]);
                    break;
                }
            }
        }
        myAnalyseChart.data.datasets[4].data = arr[5];
        myAnalyseChart.data.datasets[4].label = event.target.value;
        myAnalyseChart.update();
    });
    document.getElementById("sel5").dispatchEvent(new Event("change"));
}

function time_span_klimaanalyse() {
    var arr = [
        [],
        [],
        [],
        [],
        [],
        []
    ];
    var today = "" + date.getFullYear() + ((date.getMonth()+1).toString().length == 1 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + (date.getDate().toString().length == 1 ? "0" + date.getDate() : date.getDate())
   // var today = "20221221"
    for (let x = 1; x < data_arr.length; x++) {
        if (data_arr[x][13] === undefined) {
            break;
        }
        while (data_arr[x][13] == today) {
            var zeit = data_arr[x][14].toString();
            while (zeit.length < 6) {
                zeit = "0" + zeit;
            }
            zeit = (zeit.replace(/.{2}/g, '$&:')).slice(0, -4);
            arr[0].push(zeit);
            break;
        }
    }

    myAnalyseChart.data.labels = arr[0];
    myAnalyseChart.update();


    var select = document.getElementsByName("selects");
    var options = data_arr[0].slice(0); //slice(0) copies array and does not use just the reference
    options.forEach(function(element) {
        if (isNaN(data_arr[1][data_arr[0].indexOf(element)])) {
            options.splice((options.indexOf(element)), 1)

        }
    })
    options = options.slice(1);
    options.unshift("");

    select.forEach(function(element) {
        for (var i = 0; i < options.length; i++) {
            var opt = options[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            element.appendChild(el);
        }
    })

    document.getElementById("sel1").addEventListener('change', (event) => {
        console.log("Hier")
        arr[1] = [];
        if (event.target.value != null) {
            for (let x = 1; x < data_arr.length; x++) {
                if (data_arr[x][13] === undefined) {
                    break;
                }
                while (data_arr[x][13] == today) {
                    arr[1].push(data_arr[x][data_arr[0].indexOf(event.target.value)]);
                    break;
                }
            }
        }
        myAnalyseChart.data.datasets[0].data = arr[1];
        myAnalyseChart.data.datasets[0].label = event.target.value;
        myAnalyseChart.update();
    });
    document.getElementById("sel2").addEventListener('change', (event) => {
        arr[2] = [];
        if (event.target.value != null) {
            for (let x = 1; x < data_arr.length; x++) {
                if (data_arr[x][13] === undefined) {
                    break;
                }
                while (data_arr[x][13] == today) {
                    arr[2].push(data_arr[x][data_arr[0].indexOf(event.target.value)]);
                    break;
                }
            }
        }
        myAnalyseChart.data.datasets[1].data = arr[2];
        myAnalyseChart.data.datasets[1].label = event.target.value;
        myAnalyseChart.update();
    });
    document.getElementById("sel3").addEventListener('change', (event) => {
        arr[3] = [];
        if (event.target.value != null) {
            for (let x = 1; x < data_arr.length; x++) {
                if (data_arr[x][13] === undefined) {
                    break;
                }
                while (data_arr[x][13] == today) {
                    arr[3].push(data_arr[x][data_arr[0].indexOf(event.target.value)]);
                    break;
                }
            }
        }
        myAnalyseChart.data.datasets[2].data = arr[3];
        myAnalyseChart.data.datasets[2].label = event.target.value;
        myAnalyseChart.update();
    });
    document.getElementById("sel4").addEventListener('change', (event) => {
        arr[4] = [];
        if (event.target.value != null) {
            for (let x = 1; x < data_arr.length; x++) {
                if (data_arr[x][13] === undefined) {
                    break;
                }
                while (data_arr[x][13] == today) {
                    arr[4].push(data_arr[x][data_arr[0].indexOf(event.target.value)]);
                    break;
                }
            }
        }
        myAnalyseChart.data.datasets[3].data = arr[4];
        myAnalyseChart.data.datasets[3].label = event.target.value;
        myAnalyseChart.update();
    });
    document.getElementById("sel5").addEventListener('change', (event) => {
        arr[5] = [];
        if (event.target.value != null) {
            for (let x = 1; x < data_arr.length; x++) {
                if (data_arr[x][13] === undefined) {
                    break;
                }
                while (data_arr[x][13] == today) {
                    arr[5].push(data_arr[x][data_arr[0].indexOf(event.target.value)]);
                    break;
                }
            }
        }
        myAnalyseChart.data.datasets[4].data = arr[5];
        myAnalyseChart.data.datasets[4].label = event.target.value;
        myAnalyseChart.update();

    });

}

function analyse_chart() {

    myAnalyseChart = new Chart("chartKlimaanalyse", {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                    data: [],
                    pointRadius: 1,
                    label: ""
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: ""
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: ""
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: ""
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: ""
                }
            ]
        },
        options: {
//        parsing:false,
//        scales: {
//              x: {
//                type: 'time',
//                ticks: {
//                  source: 'auto',
//                  // Disabled rotation for performance
//                  maxRotation: 0,
//                  autoSkip: true,
//                }
//              }
//            },
           // scales: {x:{type:'linear'}},
            responsive: true,
            plugins: {
//                decimation: {
//                    enabled: true,
//                    algorithm: 'min-max',
//                    threshold:800
//                },
                legend: {
                    display: true
                },
//                decimation: {
//                    enabled: true,
//                    algorithm: 'min-max',
//                        threshold: 800
//                }
            },
            maintainAspectRatio: false,
        }
    });

//     myAnalyseChart.options.plugins.decimation.algorithm = 'lttb';
//     myAnalyseChart.options.plugins.decimation.enabled = true;
//     myAnalyseChart.options.plugins.decimation.samples = 100;
//     myAnalyseChart.update();
}

const thresholdPluginAir = {
    id: 'thresholdPluginAir',
    afterLayout: chart => {
    let ctx = chart.ctx;
    ctx.save();
    console.log("outer")
    chart.data.datasets.forEach(element => {
        var t1 = 0;
        var t2 = 0;
        var yAxis = null;
        var dsnumb = -1;
        var color1 = "";
        var color2 = "";
        var color3 = "";

        if(element == chart.data.datasets[0]){
            t1 = ((thresholds[0].uvMAX != null)?(thresholds[0].uvMAX):(99999))
            t2 = ((thresholds[0].uvMIN != null)?(thresholds[0].uvMIN):(99999))
            yAxis = chart.scales.A;
            dsnum = 0;
            color1 = "rgba(36, 47, 255, 0.3)";
            color2 = "rgba(36, 47, 255, 0.5)";
            color3 = "rgba(36, 47, 255, 1)";
        }
        if(element == chart.data.datasets[1]){
            t1 = ((thresholds[0].solarradMAX != null)?(thresholds[0].solarradMAX):(99999))
            t2 = ((thresholds[0].solarradMIN != null)?(thresholds[0].solarradMIN):(99999))
            yAxis = chart.scales.B;
            dsnum = 1;
            color1 = "rgba(255, 10, 10, 0.3)";
            color2 = "rgba(255, 10, 10, 0.5)";
            color3 = "rgba(255, 10, 10, 1)";
        }
        if(element == chart.data.datasets[2]){
            t1 = ((thresholds[0].brightnessMAX != null)?(thresholds[0].brightnessMAX):(99999))
            t2 = ((thresholds[0].brightnessMIN != null)?(thresholds[0].brightnessMIN):(99999))
            yAxis = chart.scales.C;
            dsnum = 2;
            color1 = "rgba(255, 180, 31, 0.3)";
            color2 = "rgba(255, 180, 31, 0.5)";
            color3 = "rgba(255, 180, 31, 1)";
        }

        // let yAxis = chart.scales.C;

        let yThreshold1 = yAxis.getPixelForValue(t1);
        let yThreshold2 = yAxis.getPixelForValue(t2);
        let gradient = ctx.createLinearGradient(0, yAxis.top, 0, yAxis.bottom);
        let offset =  (yThreshold1 - yAxis.top) / yAxis.height;
        let offset2 =  (yThreshold2 - yAxis.top) / yAxis.height;

        if((yThreshold1 < 0 && yThreshold2 < 0)|| yThreshold1 < 0 && yThreshold2 > 0 && offset2 < 0){
            chart.data.datasets[dsnum].borderColor = color3;
            chart.data.datasets[dsnum].backgroundColor = color3;
            return;
        }
        if(yThreshold1 < 0 && yThreshold2 > 0 && offset2 > 1){
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color1);
            chart.data.datasets[dsnum].borderColor = gradient;
            chart.data.datasets[dsnum].backgroundColor = color3;
            return;
        }

        if(yThreshold1 < 0 && yThreshold2 > 0 ){
            gradient.addColorStop(0, color2);
            gradient.addColorStop(offset2, color2);
            gradient.addColorStop(offset2, color3);
            gradient.addColorStop(1, color3);
            chart.data.datasets[dsnum].borderColor = gradient;
            chart.data.datasets[dsnum].backgroundColor = color3;
            return;
        }

        gradient.addColorStop(0, color1);
        gradient.addColorStop(offset, color1);
        gradient.addColorStop(offset, color2);
        gradient.addColorStop(offset2, color2);
        gradient.addColorStop(offset2, color3);
        gradient.addColorStop(1, color3);
        chart.data.datasets[dsnum].borderColor = gradient;
        chart.data.datasets[dsnum].backgroundColor = color3;


//        if(yThreshold1 < 0 &&  yThreshold2 < 0){
//            chart.data.datasets[dsnum].borderColor = color3;
//            return;
//        }
//
//        if(yThreshold1 < 0 && yThreshold2 > 0 &&  offset2 > 1){
//            gradient.addColorStop(0, color1);
//            gradient.addColorStop(1, color1);
//            chart.data.datasets[dsnum].borderColor = gradient;
//            return;
//        }
//
//        if(yThreshold1 < 0 && yThreshold2 > 0 ){
//            gradient.addColorStop(0, color2);
//            gradient.addColorStop(offset2, color2);
//            gradient.addColorStop(offset2, color3);
//            gradient.addColorStop(1, color3);
//            chart.data.datasets[dsnum].borderColor = gradient;
//            return;
//        }
//
//        gradient.addColorStop(0, color1);
//        gradient.addColorStop(offset, color1);
//        gradient.addColorStop(offset, color2);
//        gradient.addColorStop(offset2, color2);
//        gradient.addColorStop(offset2, color3);
//        gradient.addColorStop(1, color3);
//        chart.data.datasets[dsnum].borderColor = gradient;

    })
    ctx.restore();
}};

function time_span_airquality(zeit) {

    var date = new Date();
    var today = "" + date.getFullYear() + ((date.getMonth()+1).toString().length == 1 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + (date.getDate().toString().length == 1 ? "0" + date.getDate() : date.getDate())

    //FOR DEV PURPOSES, DEL WHEN DATA IS DAY READY
  //  today = "20221221";
    //FOR DEV PURPOSES, DEL WHEN DATA qIS DAY READY

    var time_span_arr = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ];
    switch (zeit) {
        case "day":
            for (let x = 1; x < data_arr.length; x++) {
                if (data_arr[x][13] === undefined) {
                    break;
                }
                while (data_arr[x][13] == today) {
                    var zeit = data_arr[x][14].toString();
                    while (zeit.length < 6) {
                        zeit = "0" + zeit;
                    }
                    zeit = (zeit.replace(/.{2}/g, '$&:')).slice(0, -4);

                    time_span_arr[0].push(zeit);
                    time_span_arr[1].push(data_arr[x][18].toString());
                    time_span_arr[2].push(data_arr[x][20].toString());
                    time_span_arr[3].push(data_arr[x][19].toString());
                    time_span_arr[4].push(data_arr[x][21].toString());
                    time_span_arr[5].push(data_arr[x][22].toString());
                    time_span_arr[6].push(data_arr[x][23].toString());
                    time_span_arr[7].push(data_arr[x][24].toString());
                    time_span_arr[8].push(data_arr[x][25].toString());
                    time_span_arr[9].push(data_arr[x][26].toString());
                    time_span_arr[10].push(data_arr[x][43].toString());
                    break;
                }
            }

            myAirChart.data.datasets[0].data = time_span_arr[1];
            myAirChart.data.datasets[1].data = time_span_arr[2];
            myAirChart.data.datasets[2].data = time_span_arr[3];
            myAirChart.data.datasets[3].data = time_span_arr[4];
            myAirChart.data.datasets[4].data = time_span_arr[5];
            myAirChart.data.datasets[5].data = time_span_arr[6];
            myAirChart.data.datasets[6].data = time_span_arr[7];
            myAirChart.data.datasets[7].data = time_span_arr[8];
            myAirChart.data.datasets[8].data = time_span_arr[9];
            myAirChart.data.datasets[9].data = time_span_arr[10];
            myAirChart.data.labels = time_span_arr[0];
            myAirChart.update();
            break;

        case "week":
            var temp_arr = [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ];
            for (let x = 1; x < data_arr.length; x++) {
                //when end of data is reached, jump out -> otherwise there will be an error
                if (data_arr[x][13] === undefined) {
                    break;
                }

                //format date
                var dateString = data_arr[x][13];
                var year = dateString.substring(0, 4);
                var month = dateString.substring(4, 6);
                var day = dateString.substring(6, 8);
                var datum = new Date(year + "-" + month + "-" + day);

                //calculate parameters per day
                var pm1 = 0;
                var pm2_5 = 0;
                var pm10 = 0;
                var o3 = 0;
                var no2 = 0;
                var so2 = 0;
                var co = 0;
                var h2s = 0;
                var no = 0;
                var airqual = 0;

                var counter = 0;
                var act_datum = data_arr[x][13];
                for (let v = x; data_arr[v][13] == act_datum; v++) {
                    pm1 = pm1 + parseFloat(data_arr[v][18]);
                    pm2_5 = pm2_5 + parseFloat(data_arr[v][20]);
                    pm10 = pm10 + parseFloat(data_arr[x][19]);
                    o3 = o3 + parseFloat(data_arr[x][21]);
                    no2 = no2 + parseFloat(data_arr[x][22]);
                    so2 = so2 + parseFloat(data_arr[x][23]);
                    co = co + parseFloat(data_arr[x][24]);
                    h2s = h2s + parseFloat(data_arr[x][25]);
                    no = no + parseFloat(data_arr[x][26]);
                    airqual = airqual + parseFloat(data_arr[x][43]);
                    counter++;
                    x = v;
                }

                pm1 = pm1 / counter;
                pm2_5 = pm2_5 / counter;
                pm10 = pm10 / counter;
                o3 = o3 / counter;
                no2 = no2 / counter;
                so2 = so2 / counter;
                co = co / counter;
                h2s = h2s / counter;
                no = no / counter;
                airqual = airqual / counter;

                time_span_arr[0].push(datum.toISOString().substring(0, 10));
                time_span_arr[1].push(pm1);
                time_span_arr[2].push(pm2_5);
                time_span_arr[3].push(pm10);
                time_span_arr[4].push(o3);
                time_span_arr[5].push(no2);
                time_span_arr[6].push(so2);
                time_span_arr[7].push(co);
                time_span_arr[8].push(h2s);
                time_span_arr[9].push(no);
                time_span_arr[10].push(airqual);
            }
            myAirChart.data.datasets[0].data = time_span_arr[1].slice(-7);
            myAirChart.data.datasets[1].data = time_span_arr[2].slice(-7);
            myAirChart.data.datasets[2].data = time_span_arr[3].slice(-7);
            myAirChart.data.datasets[3].data = time_span_arr[4].slice(-7);
            myAirChart.data.datasets[4].data = time_span_arr[5].slice(-7);
            myAirChart.data.datasets[5].data = time_span_arr[6].slice(-7);
            myAirChart.data.datasets[6].data = time_span_arr[7].slice(-7);
            myAirChart.data.datasets[7].data = time_span_arr[8].slice(-7);
            myAirChart.data.datasets[8].data = time_span_arr[9].slice(-7);
            myAirChart.data.datasets[9].data = time_span_arr[10].slice(-7);
            myAirChart.data.labels = time_span_arr[0].slice(-7);
            myAirChart.update();

            break;
        case "month":
            var temp_arr = [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ];
            for (let x = 1; x < data_arr.length; x++) {
                //when end of data is reached, jump out -> otherwise there will be an error
                if (data_arr[x][13] === undefined) {
                    break;
                }

                //format date
                var dateString = data_arr[x][13];
                var year = dateString.substring(0, 4);
                var month = dateString.substring(4, 6);
                var day = dateString.substring(6, 8);
                var datum = new Date(year + "-" + month + "-" + day);

                //calculate parameters per day
                var pm1 = 0;
                var pm2_5 = 0;
                var pm10 = 0;
                var o3 = 0;
                var no2 = 0;
                var so2 = 0;
                var co = 0;
                var h2s = 0;
                var no = 0;
                var airqual = 0;

                var counter = 0;
                var act_datum = data_arr[x][13];
                for (let v = x; data_arr[v][13] == act_datum; v++) {
                    pm1 = pm1 + parseFloat(data_arr[v][18]);
                    pm2_5 = pm2_5 + parseFloat(data_arr[v][20]);
                    pm10 = pm10 + parseFloat(data_arr[x][19]);
                    o3 = o3 + parseFloat(data_arr[x][21]);
                    no2 = no2 + parseFloat(data_arr[x][22]);
                    so2 = so2 + parseFloat(data_arr[x][23]);
                    co = co + parseFloat(data_arr[x][24]);
                    h2s = h2s + parseFloat(data_arr[x][25]);
                    no = no + parseFloat(data_arr[x][26]);
                    airqual = airqual + parseFloat(data_arr[x][43]);
                    counter++;
                    x = v;
                }
                pm1 = pm1 / counter;
                pm2_5 = pm2_5 / counter;
                pm10 = pm10 / counter;
                o3 = o3 / counter;
                no2 = no2 / counter;
                so2 = so2 / counter;
                co = co / counter;
                h2s = h2s / counter;
                no = no / counter;
                airqual = airqual / counter;

                time_span_arr[0].push(datum.toISOString().substring(0, 10));
                time_span_arr[1].push(pm1);
                time_span_arr[2].push(pm2_5);
                time_span_arr[3].push(pm10);
                time_span_arr[4].push(o3);
                time_span_arr[5].push(no2);
                time_span_arr[6].push(so2);
                time_span_arr[7].push(co);
                time_span_arr[8].push(h2s);
                time_span_arr[9].push(no);
                time_span_arr[10].push(airqual);
            }

            myAirChart.data.datasets[0].data = time_span_arr[1].slice(-30);
            myAirChart.data.datasets[1].data = time_span_arr[2].slice(-30);
            myAirChart.data.datasets[2].data = time_span_arr[3].slice(-30);
            myAirChart.data.datasets[3].data = time_span_arr[4].slice(-30);
            myAirChart.data.datasets[4].data = time_span_arr[5].slice(-30);
            myAirChart.data.datasets[5].data = time_span_arr[6].slice(-30);
            myAirChart.data.datasets[6].data = time_span_arr[7].slice(-30);
            myAirChart.data.datasets[7].data = time_span_arr[8].slice(-30);
            myAirChart.data.datasets[8].data = time_span_arr[9].slice(-30);
            myAirChart.data.datasets[9].data = time_span_arr[10].slice(-30);
            myAirChart.data.labels = time_span_arr[0].slice(-30);
            myAirChart.update();

            break;
        case "year":
            var temp_arr = [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ];
            for (let x = 1; x < data_arr.length; x++) {
                //when end of data is reached, jump out -> otherwise there will be an error
                if (data_arr[x][13] === undefined) {
                    break;
                }

                //format date
                var dateString = data_arr[x][13];
                var year = dateString.substring(0, 4);
                var month = dateString.substring(4, 6);
                var day = dateString.substring(6, 8);
                var datum = new Date(year + "-" + month + "-" + day);


                var pm1 = 0;
                var pm2_5 = 0;
                var pm10 = 0;
                var o3 = 0;
                var no2 = 0;
                var so2 = 0;
                var co = 0;
                var h2s = 0;
                var no = 0;
                var airqual = 0;

                var counter = 0;
                var act_datum = data_arr[x][13];
                for (let v = x; data_arr[v][13] == act_datum; v++) {
                    pm1 = pm1 + parseFloat(data_arr[v][18]);
                    pm2_5 = pm2_5 + parseFloat(data_arr[v][20]);
                    pm10 = pm10 + parseFloat(data_arr[x][19]);
                    o3 = o3 + parseFloat(data_arr[x][21]);
                    no2 = no2 + parseFloat(data_arr[x][22]);
                    so2 = so2 + parseFloat(data_arr[x][23]);
                    co = co + parseFloat(data_arr[x][24]);
                    h2s = h2s + parseFloat(data_arr[x][25]);
                    no = no + parseFloat(data_arr[x][26]);
                    airqual = airqual + parseFloat(data_arr[x][43]);
                    counter++;
                    x = v;
                }
                pm1 = pm1 / counter;
                pm2_5 = pm2_5 / counter;
                pm10 = pm10 / counter;
                o3 = o3 / counter;
                no2 = no2 / counter;
                so2 = so2 / counter;
                co = co / counter;
                h2s = h2s / counter;
                no = no / counter;
                airqual = airqual / counter;

                time_span_arr[0].push(datum.toISOString().substring(0, 10));
                time_span_arr[1].push(pm1);
                time_span_arr[2].push(pm2_5);
                time_span_arr[3].push(pm10);
                time_span_arr[4].push(o3);
                time_span_arr[5].push(no2);
                time_span_arr[6].push(so2);
                time_span_arr[7].push(co);
                time_span_arr[8].push(h2s);
                time_span_arr[9].push(no);
                time_span_arr[10].push(airqual);

            }


            myAirChart.data.datasets[0].data = time_span_arr[1].slice(-365);
            myAirChart.data.datasets[1].data = time_span_arr[2].slice(-365);
            myAirChart.data.datasets[2].data = time_span_arr[3].slice(-365);
            myAirChart.data.datasets[3].data = time_span_arr[4].slice(-365);
            myAirChart.data.datasets[4].data = time_span_arr[5].slice(-365);
            myAirChart.data.datasets[5].data = time_span_arr[6].slice(-365);
            myAirChart.data.datasets[6].data = time_span_arr[7].slice(-365);
            myAirChart.data.datasets[7].data = time_span_arr[8].slice(-365);
            myAirChart.data.datasets[8].data = time_span_arr[9].slice(-365);
            myAirChart.data.datasets[9].data = time_span_arr[10].slice(-365);
            myAirChart.data.labels = time_span_arr[0].slice(-365);
            myAirChart.update();

            //decimation test
//            test_arr = [[],[]]
//            data_arr.forEach(element => {test_arr[0].push(element[13]);test_arr[1].push(element[18])})

          //  myAirChart.data.labels = test_arr[0];
//            myAirChart.data.datasets[0].data = test_arr[1]
//            myAirChart.update();

            break;
        default:
    }

    myAirChart.options.plugins.thresholdPluginAir = true;
    myAirChart.update();
}



function airquality_chart() {
    var temp_arr = [];

    const thresholdPluginAir = {
        id: 'thresholdPluginAir',
        afterLayout: chart => {
        let ctx = chart.ctx;
        ctx.save();

        chart.data.datasets.forEach(element => {
            var t1 = 0;
            var t2 = 0;
            var yAxis = null;
            var dsnumb = -1;
            var color1 = "";
            var color2 = "";
            var color3 = "";

            if(element == chart.data.datasets[0]){
                t1 = ((thresholds[0].pm1MAX != null)?(thresholds[0].pm1MAX):(99999))
                t2 = ((thresholds[0].pm1MIN != null)?(thresholds[0].pm1MIN):(99999))
                yAxis = chart.scales.A;
                dsnum = 0;
                color1 = "rgba(255, 0, 0, 0.3)";
                color2 = "rgba(255, 0, 0, 0.5)";
                color3 = "rgba(255, 0, 0, 1)";
            }
            if(element == chart.data.datasets[1]){
                t1 = ((thresholds[0].pm2_5MAX != null)?(thresholds[0].pm2_5MAX):(99999))
                t2 = ((thresholds[0].pm2_5MIN != null)?(thresholds[0].pm2_5MIN):(99999))
                yAxis = chart.scales.C;
                dsnum = 1;
                color1 = "rgba(255, 150, 0, 0.3)";
                color2 = "rgba(255, 150, 0, 0.5)";
                color3 = "rgba(255, 150, 0, 1)";
            }
            if(element == chart.data.datasets[2]){
                t1 = ((thresholds[0].pm10MAX != null)?(thresholds[0].pm10MAX):(99999))
                t2 = ((thresholds[0].pm10MIN != null)?(thresholds[0].pm10MIN):(99999))
                yAxis = chart.scales.B;
                dsnum = 2;
                color1 = "rgba(255, 255, 0, 0.3)";
                color2 = "rgba(255, 255, 0, 0.5)";
                color3 = "rgba(255, 255, 0, 1)";
            }
            if(element == chart.data.datasets[3]){
                t1 = ((thresholds[0].o3MAX != null)?(thresholds[0].o3MAX):(99999))
                t2 = ((thresholds[0].o3MIN != null)?(thresholds[0].o3MIN):(99999))
                yAxis = chart.scales.C;
                dsnum = 3;
                color1 = "rgba(0, 180, 0, 0.3)";
                color2 = "rgba(0, 180, 0, 0.5)";
                color3 = "rgba(0, 180, 0, 1)";
            }
            if(element == chart.data.datasets[4]){
                t1 = ((thresholds[0].no2MAX != null)?(thresholds[0].no2MAX):(99999))
                t2 = ((thresholds[0].no2MIN != null)?(thresholds[0].no2MIN):(99999))
                yAxis = chart.scales.C;
                dsnum = 4;
                color1 = "rgba(0, 255, 255, 0.3)";
                color2 = "rgba(0, 255, 255, 0.5)";
                color3 = "rgba(0, 255, 255, 1)";
            }
            if(element == chart.data.datasets[5]){
                t1 = ((thresholds[0].so2MAX != null)?(thresholds[0].so2MAX):(99999))
                t2 = ((thresholds[0].so2MIN != null)?(thresholds[0].so2MIN):(99999))
                yAxis = chart.scales.A;
                dsnum = 5;
                color1 = "rgba(0, 0, 255, 0.3)";
                color2 = "rgba(0, 0, 255, 0.5)";
                color3 = "rgba(0, 0, 255, 1)";
            }
            if(element == chart.data.datasets[6]){
                t1 = ((thresholds[0].coMAX != null)?(thresholds[0].coMAX):(99999))
                t2 = ((thresholds[0].coMIN != null)?(thresholds[0].coMIN):(99999))
                yAxis = chart.scales.A;
                dsnum = 6;
                color1 = "rgba(140, 140, 140, 0.3)";
                color2 = "rgba(140, 140, 140, 0.5)";
                color3 = "rgba(140, 140, 140, 1)";
            }
            if(element == chart.data.datasets[7]){
                t1 = ((thresholds[0].h2sMAX != null)?(thresholds[0].h2sMAX):(99999))
                t2 = ((thresholds[0].h2sMIN != null)?(thresholds[0].h2sMIN):(99999))
                yAxis = chart.scales.A;
                dsnum = 7;
                color1 = "rgba(200, 0, 200, 0.3)";
                color2 = "rgba(200, 0, 200, 0.5)";
                color3 = "rgba(200, 0, 200, 1)";
            }
            if(element == chart.data.datasets[8]){
                t1 = ((thresholds[0].noMAX != null)?(thresholds[0].noMAX):(99999))
                t2 = ((thresholds[0].noMIN != null)?(thresholds[0].noMIN):(99999))
                yAxis = chart.scales.C;
                dsnum = 8;
                color1 = "rgba(200, 60, 0, 0.3)";
                color2 = "rgba(200, 60, 0, 0.5)";
                color3 = "rgba(200, 60, 0, 1)";
            }
            if(element == chart.data.datasets[9]){
                t1 = ((thresholds[0].air_qualityMAX != null)?(thresholds[0].air_qualityMAX):(99999))
                t2 = ((thresholds[0].air_qualityMIN != null)?(thresholds[0].air_qualityMIN):(99999))
                yAxis = chart.scales.D;
                dsnum = 9;
                color1 = "rgba(0, 0, 0, 0.3)";
                color2 = "rgba(0, 0, 0, 0.5)";
                color3 = "rgba(0, 0, 0, 1)";
            }
            // let yAxis = chart.scales.C;

            let yThreshold1 = yAxis.getPixelForValue(t1);
            let yThreshold2 = yAxis.getPixelForValue(t2);
            let gradient = ctx.createLinearGradient(0, yAxis.top, 0, yAxis.bottom);
            let offset =  (yThreshold1 - yAxis.top) / yAxis.height;
            let offset2 =  (yThreshold2 - yAxis.top) / yAxis.height;

            if((yThreshold1 < 0 && yThreshold2 < 0)|| yThreshold1 < 0 && yThreshold2 > 0 && offset2 < 0){
                chart.data.datasets[dsnum].borderColor = color3;
                chart.data.datasets[dsnum].backgroundColor = color3;
                return;
            }
            if(yThreshold1 < 0 && yThreshold2 > 0 && offset2 > 1){
                gradient.addColorStop(0, color1);
                gradient.addColorStop(1, color1);
                chart.data.datasets[dsnum].borderColor = gradient;
                chart.data.datasets[dsnum].backgroundColor = color3;
                return;
            }

            if(yThreshold1 < 0 && yThreshold2 > 0 ){
                gradient.addColorStop(0, color2);
                gradient.addColorStop(offset2, color2);
                gradient.addColorStop(offset2, color3);
                gradient.addColorStop(1, color3);
                chart.data.datasets[dsnum].borderColor = gradient;
                chart.data.datasets[dsnum].backgroundColor = color3;
                return;
            }

            gradient.addColorStop(0, color1);
            gradient.addColorStop(offset, color1);
            gradient.addColorStop(offset, color2);
            gradient.addColorStop(offset2, color2);
            gradient.addColorStop(offset2, color3);
            gradient.addColorStop(1, color3);
            chart.data.datasets[dsnum].borderColor = gradient;
            chart.data.datasets[dsnum].backgroundColor = color3;


    //        if(yThreshold1 < 0 &&  yThreshold2 < 0){
    //            chart.data.datasets[dsnum].borderColor = color3;
    //            return;
    //        }
    //
    //        if(yThreshold1 < 0 && yThreshold2 > 0 &&  offset2 > 1){
    //            gradient.addColorStop(0, color1);
    //            gradient.addColorStop(1, color1);
    //            chart.data.datasets[dsnum].borderColor = gradient;
    //            return;
    //        }
    //
    //        if(yThreshold1 < 0 && yThreshold2 > 0 ){
    //            gradient.addColorStop(0, color2);
    //            gradient.addColorStop(offset2, color2);
    //            gradient.addColorStop(offset2, color3);
    //            gradient.addColorStop(1, color3);
    //            chart.data.datasets[dsnum].borderColor = gradient;
    //            return;
    //        }
    //
    //        gradient.addColorStop(0, color1);
    //        gradient.addColorStop(offset, color1);
    //        gradient.addColorStop(offset, color2);
    //        gradient.addColorStop(offset2, color2);
    //        gradient.addColorStop(offset2, color3);
    //        gradient.addColorStop(1, color3);
    //        chart.data.datasets[dsnum].borderColor = gradient;

        })
        ctx.restore();
    }};


    myAirChart = new Chart("chartAirQual", {
        type: "line",
        data: {
            labels: temp_arr[0],
            datasets: [{
                    data: [],
                    pointRadius: 1,
                    label: "PM 1",
                    yAxisID: 'A',
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "PM 2.5",
                    yAxisID: 'C',
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "PM 10",
                    yAxisID: 'B',
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Ozon",
                    yAxisID: 'C',
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Stickstoffdioxid",
                    yAxisID: 'C',
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Schwefeldioxid",
                    yAxisID: 'A',
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Kohlenmonoxid",
                    yAxisID: 'A',
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Schwefelwasserstoff",
                    yAxisID: 'A',
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Stickstoffmonoxid",
                    yAxisID: 'C',
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Air-Quality-Index",
                    yAxisID: 'D',
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
                    position: 'left',
                    title: {
                        display: true,
                        text: 'µg/m³',
                        font: {
                            size: 18
                        }
                    }
                },
                B: {
                    ticks: {
                        color: 'darkorange'
                    },
                    position: 'right',
                    title: {
                        display: true,
                        text: 'µg/m³',
                        font: {
                            size: 18
                        },
                        color: 'darkorange'
                    }
                },
                C: {
                    ticks: {
                        color: '#fc0384'
                    },
                    position: 'right',
                    title: {
                        display: true,
                        text: 'µg/m³',
                        font: {
                            size: 18
                        },
                        color: '#fc0384'
                    }
                },
                D: {
                    ticks: {
                        color: 'darkorange'
                    },
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Air-QUality-Index',
                        font: {
                            size: 18
                        },
                        color: 'darkorange'
                    }
                },
                x: {
//                    type:'linear',
                    display: true,
//                    time: {
//                              displayFormats: {
//                                quarter: 'MMM YYYY'
//                              }
//                            },
                    title: {
                        display: true,
                        text: 'Date',
                        font: {
                            size: 18
                        }
                    }
                }
            },
            plugins: {
                decimation: {
//                    algorithm: 'min-max',
//                    enabled: true,
//                    samples: 10,
//                    threshold: 100
                  },
                legend: {
                    display: true
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.formattedValue + ((context.dataset.label.includes("Air-Quality-Index") ? ('') : (' µg/m³')));
                        },
                    }
                },
                thresholdPluginAir: false
            },
        },
     plugins: [thresholdPluginAir]
    });

    time_span_airquality("day");
}
/*
function time_span_radiation(zeit) {
    var date = new Date();
    var today = "" + date.getFullYear() + ((date.getMonth()+1).toString().length == 1 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + (date.getDate().toString().length == 1 ? "0" + date.getDate() : date.getDate())
    //FOR DEV PURPOSES, DEL WHEN DATA IS DAY READY
   // today = "20221221";
    //FOR DEV PURPOSES, DEL WHEN DATA qIS DAY READY

    var time_span_arr = [
        [],
        [],
        [],
        []
    ];
    switch (zeit) {
        case "day":
            for (let x = 1; x < data_arr.length; x++) {
                if (data_arr[x][13] === undefined) {
                    break;
                }
                while (data_arr[x][13] == today) {
                    var zeit = data_arr[x][14].toString();
                    while (zeit.length < 6) {
                        zeit = "0" + zeit;
                    }
                    zeit = (zeit.replace(/.{2}/g, '$&:')).slice(0, -4);

                    time_span_arr[0].push(zeit);
                    time_span_arr[1].push(data_arr[x][17].toString())
                    time_span_arr[2].push(data_arr[x][16].toString())
                    time_span_arr[3].push(data_arr[x][27].toString())
                    break;
                }
            }

            myRadChart.data.datasets[0].data = time_span_arr[1];
            myRadChart.data.datasets[1].data = time_span_arr[2];
            myRadChart.data.datasets[2].data = time_span_arr[3];
            myRadChart.data.labels = time_span_arr[0];
            myRadChart.update();
            break;
        case "week":
            var temp_arr = [
                [],
                [],
                [],
                []
            ];
            for (let x = 1; x < data_arr.length; x++) {
                //when end of data is reached, jump out -> otherwise there will be an error
                if (data_arr[x][13] === undefined) {
                    break;
                }

                //format date
                var dateString = data_arr[x][13];
                var year = dateString.substring(0, 4);
                var month = dateString.substring(4, 6);
                var day = dateString.substring(6, 8);
                var datum = new Date(year + "-" + month + "-" + day);

                //calculate avg uv & radiation per day
                var uv = 0;
                var rad = 0;
                var bright = 0;
                var counter = 0;
                var act_datum = data_arr[x][13];
                for (let v = x; data_arr[v][13] == act_datum; v++) {
                    uv = uv + parseFloat(data_arr[v][17]);
                    rad = rad + parseFloat(data_arr[v][16]);
                    bright = bright + parseFloat(data_arr[x][27]);
                    counter++;
                    x = v;
                }
                uv = uv / counter;
                rad = rad / counter;
                bright = bright / counter;

                time_span_arr[0].push(datum.toISOString().substring(0, 10));
                time_span_arr[1].push(uv);
                time_span_arr[2].push(rad);
                time_span_arr[3].push(bright);
            }

            myRadChart.data.datasets[0].data = time_span_arr[1].slice(-7);
            myRadChart.data.datasets[1].data = time_span_arr[2].slice(-7);
            myRadChart.data.datasets[2].data = time_span_arr[3].slice(-7);
            myRadChart.data.labels = time_span_arr[0].slice(-7);
            myRadChart.update();

            break;
        case "month":
            var temp_arr = [
                [],
                [],
                [],
                []
            ];
            for (let x = 1; x < data_arr.length; x++) {
                //when end of data is reached, jump out -> otherwise there will be an error
                if (data_arr[x][13] === undefined) {
                    break;
                }

                //format date
                var dateString = data_arr[x][13];
                var year = dateString.substring(0, 4);
                var month = dateString.substring(4, 6);
                var day = dateString.substring(6, 8);
                var datum = new Date(year + "-" + month + "-" + day);

                //calculate avg uv & radiation per day
                var uv = 0;
                var rad = 0;
                var bright = 0;
                var counter = 0;
                var act_datum = data_arr[x][13];
                for (let v = x; data_arr[v][13] == act_datum; v++) {
                    uv = uv + parseFloat(data_arr[v][17]);
                    rad = rad + parseFloat(data_arr[v][16]);
                    bright = bright + parseFloat(data_arr[x][27]);
                    counter++;
                    x = v;
                }
                uv = uv / counter;
                rad = rad / counter;
                bright = bright / counter;

                time_span_arr[0].push(datum.toISOString().substring(0, 10));
                time_span_arr[1].push(uv);
                time_span_arr[2].push(rad);
                time_span_arr[3].push(bright);
            }

            myRadChart.data.datasets[0].data = time_span_arr[1].slice(-30);
            myRadChart.data.datasets[1].data = time_span_arr[2].slice(-30);
            myRadChart.data.datasets[2].data = time_span_arr[3].slice(-30);
            myRadChart.data.labels = time_span_arr[0].slice(-30);
            myRadChart.update();

            break;
        case "year":
            var temp_arr = [
                [],
                [],
                [],
                []
            ];
            for (let x = 1; x < data_arr.length; x++) {
                //when end of data is reached, jump out -> otherwise there will be an error
                if (data_arr[x][13] === undefined) {
                    break;
                }

                //format date
                var dateString = data_arr[x][13];
                var year = dateString.substring(0, 4);
                var month = dateString.substring(4, 6);
                var day = dateString.substring(6, 8);
                var datum = new Date(year + "-" + month + "-" + day);

                //calculate avg uv & radiation per day
                var uv = 0;
                var rad = 0;
                var bright = 0;
                var counter = 0;
                var act_datum = data_arr[x][13];
                for (let v = x; data_arr[v][13] == act_datum; v++) {
                    uv = uv + parseFloat(data_arr[v][17]);
                    rad = rad + parseFloat(data_arr[v][16]);
                    bright = bright + parseFloat(data_arr[v][27]);
                    counter++;
                    x = v;
                }
                uv = uv / counter;
                rad = rad / counter;
                bright = bright / counter;

                time_span_arr[0].push(datum.toISOString().substring(0, 10));
                time_span_arr[1].push(uv);
                time_span_arr[2].push(rad);
                time_span_arr[3].push(bright);
            }

            myRadChart.data.datasets[0].data = time_span_arr[1].slice(-365);
            myRadChart.data.datasets[1].data = time_span_arr[2].slice(-365);
            myRadChart.data.datasets[2].data = time_span_arr[3].slice(-365);
            myRadChart.data.labels = time_span_arr[0].slice(-365);
            myRadChart.update();

            break;
        default:
    }
    myRadChart.options.plugins.thresholdPluginRAD = true;
    myRadChart.update();
}*/

function jsonToArray(json){
    var newData = [];
        const dataJson = json

        newData.push([])
        //labels
        for (var val in dataJson[0]){
            newData[0].push(val)
        }
        //make array ?places? for each label
        for(let x = 0; x < newData[0].length; x++){
            newData.push([]);
        }
        for (let i = 0; i < dataJson.length; i++){
            c = 0
            for (var val in dataJson[i]){
                newData[c+1].push(dataJson[i][val])
                c+=1
            }
        }
    return newData
}


function time_span_radiation(zeit){

    daten = [[],[],[]]
    var radiationDataSliced = radiationData;

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

    console.log(daten)

    myRadChart.data.datasets[0].data = daten[0]
    myRadChart.data.datasets[1].data = daten[1]
    myRadChart.data.datasets[2].data = daten[2]

//    myRadChart.data.datasets[0].data = radiationData[3];
//    myRadChart.data.datasets[1].data = radiationData[4];
//    myRadChart.data.datasets[2].data = radiationData[5];
//    myRadChart.data.labels = radiationData[2];
    myRadChart.update()

}


function time_span_radiations(zeit) {
    var date = new Date();
    var today = "" + date.getFullYear() + ((date.getMonth()+1).toString().length == 1 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + (date.getDate().toString().length == 1 ? "0" + date.getDate() : date.getDate())
    //FOR DEV PURPOSES, DEL WHEN DATA IS DAY READY
   // today = "20221221";
    //FOR DEV PURPOSES, DEL WHEN DATA qIS DAY READY

    var time_span_arr = [
        [],
        [],
        [],
        []
    ];
    switch (zeit) {
        case "day":
            for (let x = 1; x < data_arr.length; x++) {
                if (data_arr[x][13] === undefined) {
                    break;
                }
                while (data_arr[x][13] == today) {
                    var zeit = data_arr[x][14].toString();
                    while (zeit.length < 6) {
                        zeit = "0" + zeit;
                    }
                    zeit = (zeit.replace(/.{2}/g, '$&:')).slice(0, -4);

                    time_span_arr[0].push(zeit);
                    time_span_arr[1].push(data_arr[x][17].toString())
                    time_span_arr[2].push(data_arr[x][16].toString())
                    time_span_arr[3].push(data_arr[x][27].toString())
                    break;
                }
            }

            myRadChart.data.datasets[0].data = time_span_arr[1];
            myRadChart.data.datasets[1].data = time_span_arr[2];
            myRadChart.data.datasets[2].data = time_span_arr[3];
            myRadChart.data.labels = time_span_arr[0];
            myRadChart.update();
            break;
        case "week":
            var temp_arr = [
                [],
                [],
                [],
                []
            ];
            for (let x = 1; x < data_arr.length; x++) {
                //when end of data is reached, jump out -> otherwise there will be an error
                if (data_arr[x][13] === undefined) {
                    break;
                }

                //format date
                var dateString = data_arr[x][13];
                var year = dateString.substring(0, 4);
                var month = dateString.substring(4, 6);
                var day = dateString.substring(6, 8);
                var datum = new Date(year + "-" + month + "-" + day);

                //calculate avg uv & radiation per day
                var uv = 0;
                var rad = 0;
                var bright = 0;
                var counter = 0;
                var act_datum = data_arr[x][13];
                for (let v = x; data_arr[v][13] == act_datum; v++) {
                    uv = uv + parseFloat(data_arr[v][17]);
                    rad = rad + parseFloat(data_arr[v][16]);
                    bright = bright + parseFloat(data_arr[x][27]);
                    counter++;
                    x = v;
                }
                uv = uv / counter;
                rad = rad / counter;
                bright = bright / counter;

                time_span_arr[0].push(datum.toISOString().substring(0, 10));
                time_span_arr[1].push(uv);
                time_span_arr[2].push(rad);
                time_span_arr[3].push(bright);
            }

            myRadChart.data.datasets[0].data = time_span_arr[1].slice(-7);
            myRadChart.data.datasets[1].data = time_span_arr[2].slice(-7);
            myRadChart.data.datasets[2].data = time_span_arr[3].slice(-7);
            myRadChart.data.labels = time_span_arr[0].slice(-7);
            myRadChart.update();

            break;
        case "month":
            var temp_arr = [
                [],
                [],
                [],
                []
            ];
            for (let x = 1; x < data_arr.length; x++) {
                //when end of data is reached, jump out -> otherwise there will be an error
                if (data_arr[x][13] === undefined) {
                    break;
                }

                //format date
                var dateString = data_arr[x][13];
                var year = dateString.substring(0, 4);
                var month = dateString.substring(4, 6);
                var day = dateString.substring(6, 8);
                var datum = new Date(year + "-" + month + "-" + day);

                //calculate avg uv & radiation per day
                var uv = 0;
                var rad = 0;
                var bright = 0;
                var counter = 0;
                var act_datum = data_arr[x][13];
                for (let v = x; data_arr[v][13] == act_datum; v++) {
                    uv = uv + parseFloat(data_arr[v][17]);
                    rad = rad + parseFloat(data_arr[v][16]);
                    bright = bright + parseFloat(data_arr[x][27]);
                    counter++;
                    x = v;
                }
                uv = uv / counter;
                rad = rad / counter;
                bright = bright / counter;

                time_span_arr[0].push(datum.toISOString().substring(0, 10));
                time_span_arr[1].push(uv);
                time_span_arr[2].push(rad);
                time_span_arr[3].push(bright);
            }

            myRadChart.data.datasets[0].data = time_span_arr[1].slice(-30);
            myRadChart.data.datasets[1].data = time_span_arr[2].slice(-30);
            myRadChart.data.datasets[2].data = time_span_arr[3].slice(-30);
            myRadChart.data.labels = time_span_arr[0].slice(-30);
            myRadChart.update();

            break;
        case "year":
            var temp_arr = [
                [],
                [],
                [],
                []
            ];
            for (let x = 1; x < data_arr.length; x++) {
                //when end of data is reached, jump out -> otherwise there will be an error
                if (data_arr[x][13] === undefined) {
                    break;
                }

                //format date
                var dateString = data_arr[x][13];
                var year = dateString.substring(0, 4);
                var month = dateString.substring(4, 6);
                var day = dateString.substring(6, 8);
                var datum = new Date(year + "-" + month + "-" + day);

                //calculate avg uv & radiation per day
                var uv = 0;
                var rad = 0;
                var bright = 0;
                var counter = 0;
                var act_datum = data_arr[x][13];
                for (let v = x; data_arr[v][13] == act_datum; v++) {
                    uv = uv + parseFloat(data_arr[v][17]);
                    rad = rad + parseFloat(data_arr[v][16]);
                    bright = bright + parseFloat(data_arr[v][27]);
                    counter++;
                    x = v;
                }
                uv = uv / counter;
                rad = rad / counter;
                bright = bright / counter;

                time_span_arr[0].push(datum.toISOString().substring(0, 10));
                time_span_arr[1].push(uv);
                time_span_arr[2].push(rad);
                time_span_arr[3].push(bright);
            }

            myRadChart.data.datasets[0].data = time_span_arr[1].slice(-365);
            myRadChart.data.datasets[1].data = time_span_arr[2].slice(-365);
            myRadChart.data.datasets[2].data = time_span_arr[3].slice(-365);
            myRadChart.data.labels = time_span_arr[0].slice(-365);
            myRadChart.update();

            break;
        default:
    }
    myRadChart.options.plugins.thresholdPluginRAD = true;
    myRadChart.update();
}


const thresholdPluginRAD = {
    id: 'thresholdPluginRAD',
    afterLayout: chart => {
    let ctx = chart.ctx;
    ctx.save();
    chart.data.datasets.forEach(element => {
        var t1 = 0;
        var t2 = 0;
        var yAxis = null;
        var dsnumb = -1;
        var color1 = "";
        var color2 = "";
        var color3 = "";

        if(element == chart.data.datasets[0]){
            t1 = ((thresholds[0].uvMAX != null)?(thresholds[0].uvMAX):(99999))
            t2 = ((thresholds[0].uvMIN != null)?(thresholds[0].uvMIN):(99999))
            yAxis = chart.scales.A;
            dsnum = 0;
            color1 = "rgba(36, 47, 255, 0.3)";
            color2 = "rgba(36, 47, 255, 0.5)";
            color3 = "rgba(36, 47, 255, 1)";
        }
        if(element == chart.data.datasets[1]){
            t1 = ((thresholds[0].solarradMAX != null)?(thresholds[0].solarradMAX):(99999))
            t2 = ((thresholds[0].solarradMIN != null)?(thresholds[0].solarradMIN):(99999))
            yAxis = chart.scales.B;
            dsnum = 1;
            color1 = "rgba(255, 10, 10, 0.3)";
            color2 = "rgba(255, 10, 10, 0.5)";
            color3 = "rgba(255, 10, 10, 1)";
        }
        if(element == chart.data.datasets[2]){
            t1 = ((thresholds[0].brightnessMAX != null)?(thresholds[0].brightnessMAX):(99999))
            t2 = ((thresholds[0].brightnessMIN != null)?(thresholds[0].brightnessMIN):(99999))
            yAxis = chart.scales.C;
            dsnum = 2;
            color1 = "rgba(255, 180, 31, 0.3)";
            color2 = "rgba(255, 180, 31, 0.5)";
            color3 = "rgba(255, 180, 31, 1)";
        }

        // let yAxis = chart.scales.C;

        let yThreshold1 = yAxis.getPixelForValue(t1);
        let yThreshold2 = yAxis.getPixelForValue(t2);
        let gradient = ctx.createLinearGradient(0, yAxis.top, 0, yAxis.bottom);
        let offset =  (yThreshold1 - yAxis.top) / yAxis.height;
        let offset2 =  (yThreshold2 - yAxis.top) / yAxis.height;

        if((yThreshold1 < 0 && yThreshold2 < 0)|| yThreshold1 < 0 && yThreshold2 > 0 && offset2 < 0){
            chart.data.datasets[dsnum].borderColor = color3;
            chart.data.datasets[dsnum].backgroundColor = color3;
            return;
        }
        if(yThreshold1 < 0 && yThreshold2 > 0 && offset2 > 1){
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color1);
            chart.data.datasets[dsnum].borderColor = gradient;
            chart.data.datasets[dsnum].backgroundColor = color3;
            return;
        }

        if(yThreshold1 < 0 && yThreshold2 > 0 ){
            gradient.addColorStop(0, color2);
            gradient.addColorStop(offset2, color2);
            gradient.addColorStop(offset2, color3);
            gradient.addColorStop(1, color3);
            chart.data.datasets[dsnum].borderColor = gradient;
            chart.data.datasets[dsnum].backgroundColor = color3;
            return;
        }

        gradient.addColorStop(0, color1);
        gradient.addColorStop(offset, color1);
        gradient.addColorStop(offset, color2);
        gradient.addColorStop(offset2, color2);
        gradient.addColorStop(offset2, color3);
        gradient.addColorStop(1, color3);
        chart.data.datasets[dsnum].borderColor = gradient;
        chart.data.datasets[dsnum].backgroundColor = color3;


//        if(yThreshold1 < 0 &&  yThreshold2 < 0){
//            chart.data.datasets[dsnum].borderColor = color3;
//            return;
//        }
//
//        if(yThreshold1 < 0 && yThreshold2 > 0 &&  offset2 > 1){
//            gradient.addColorStop(0, color1);
//            gradient.addColorStop(1, color1);
//            chart.data.datasets[dsnum].borderColor = gradient;
//            return;
//        }
//
//        if(yThreshold1 < 0 && yThreshold2 > 0 ){
//            gradient.addColorStop(0, color2);
//            gradient.addColorStop(offset2, color2);
//            gradient.addColorStop(offset2, color3);
//            gradient.addColorStop(1, color3);
//            chart.data.datasets[dsnum].borderColor = gradient;
//            return;
//        }
//
//        gradient.addColorStop(0, color1);
//        gradient.addColorStop(offset, color1);
//        gradient.addColorStop(offset, color2);
//        gradient.addColorStop(offset2, color2);
//        gradient.addColorStop(offset2, color3);
//        gradient.addColorStop(1, color3);
//        chart.data.datasets[dsnum].borderColor = gradient;

    })
    ctx.restore();
}};


function radiation_chart() {
    var temp_arr = [];

//    dataPrep(radiationData)

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
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Solar Radiation",
                    yAxisID: 'B',
//                    cubicInterpolationMode: 'monotone',
//                    tension: 0.1
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Helligkeit",
                    yAxisID: 'C',
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
                    /*grid: {
                                  drawOnChartArea: false, // only want the grid lines for one axis to show up
                                }*/
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
                    }
                }
            },
            parsing: false,
            animation: false,
            plugins: {
                decimation: {
                        enabled: true,
                        algorithm: 'min-max',
//                        samples: 200
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
                },
                thresholdPluginRAD: false
           }
        },
        plugins: [thresholdPluginRAD]
    });

//    time_span_radiation("day");


   //console.log( myRadChart.data.datasets[1])
//    var myColors = [];
//    myRadChart.data.datasets[1].data.forEach(function( index,value ) {
//      if(value>12){
//      	 myColors[index]="green";
//      }else{
//      	myColors[index]="red";
//      }
//    });

   // myRadChart.data.datasets[1].borderColor =
    //myRadChart.data.datasets[1].backgroundColor = myColors;
    myRadChart.update();
}


function time_span_thermik(zeit) {
    var date = new Date();
    var today = "" + date.getFullYear() + ((date.getMonth()+1).toString().length == 1 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + (date.getDate().toString().length == 1 ? "0" + date.getDate() : date.getDate())
    //FOR DEV PURPOSES, DEL WHEN DATA IS DAY READY
   // today = "20221221";
    //FOR DEV PURPOSES, DEL WHEN DATA IS DAY READY

    var time_span_arr = [
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ];
    switch (zeit) {
        case "day":
            for (let x = 1; x < data_arr.length; x++) {
                if (data_arr[x][13] === undefined) {
                    break;
                }
                while (data_arr[x][13] == today) {
                    var zeit = data_arr[x][14].toString();
                    while (zeit.length < 6) {
                        zeit = "0" + zeit;
                    }
                    zeit = (zeit.replace(/.{2}/g, '$&:')).slice(0, -4);

                    time_span_arr[0].push(zeit);
                    time_span_arr[1].push(data_arr[x][1].toString());
                    time_span_arr[2].push(data_arr[x][3].toString());
                    time_span_arr[3].push(data_arr[x][4].toString());
                    time_span_arr[4].push(data_arr[x][6].toString());
                    time_span_arr[5].push(data_arr[x][8].toString());
                    time_span_arr[6].push(data_arr[x][10].toString());
                    break;
                }
            }

            myThermikChart.data.datasets[0].data = time_span_arr[1];
            myThermikChart.data.datasets[1].data = time_span_arr[2];
            myThermikChart.data.datasets[2].data = time_span_arr[3];
            myThermikChart.data.datasets[3].data = time_span_arr[4];
            myThermikChart.data.datasets[4].data = time_span_arr[5];
            myThermikChart.data.datasets[5].data = time_span_arr[6];
            myThermikChart.data.labels = time_span_arr[0];
            myThermikChart.update();
            break;
        case "week":
            var temp_arr = [
                [],
                [],
                [],
                [],
                [],
                []
            ];
            for (let x = 1; x < data_arr.length; x++) {
                //when end of data is reached, jump out -> otherwise there will be an error
                if (data_arr[x][13] === undefined) {
                    break;
                }

                //format date
                var dateString = data_arr[x][13];
                var year = dateString.substring(0, 4);
                var month = dateString.substring(4, 6);
                var day = dateString.substring(6, 8);
                var datum = new Date(year + "-" + month + "-" + day);

                //calculate per day
                var wspeed = 0;
                var bearing = 0;
                var temp = 0;
                var hum = 0;
                var press = 0;
                var rrate = 0;
                var counter = 0;
                var act_datum = data_arr[x][13];
                for (let v = x; data_arr[v][13] == act_datum; v++) {
                    wspeed = wspeed + parseFloat(data_arr[v][1]);
                    bearing = bearing + parseFloat(data_arr[v][3]);
                    temp = temp + parseFloat(data_arr[v][4]);
                    hum = hum + parseFloat(data_arr[v][6]);
                    press = press + parseFloat(data_arr[v][8]);
                    rrate = rrate + parseFloat(data_arr[v][10]);
                    counter++;
                    x = v;
                }
                wspeed = wspeed / counter;
                bearing = bearing / counter;
                temp = temp / counter;
                hum = hum / counter;
                press = press / counter;
                rrate = rrate / counter;

                time_span_arr[0].push(datum.toISOString().substring(0, 10));
                time_span_arr[1].push(wspeed);
                time_span_arr[2].push(bearing);
                time_span_arr[3].push(temp);
                time_span_arr[4].push(hum);
                time_span_arr[5].push(press);
                time_span_arr[6].push(rrate);
            }

            myThermikChart.data.datasets[0].data = time_span_arr[1].slice(-7);
            myThermikChart.data.datasets[1].data = time_span_arr[2].slice(-7);
            myThermikChart.data.datasets[2].data = time_span_arr[3].slice(-7);
            myThermikChart.data.datasets[3].data = time_span_arr[4].slice(-7);
            myThermikChart.data.datasets[4].data = time_span_arr[5].slice(-7);
            myThermikChart.data.datasets[5].data = time_span_arr[6].slice(-7);
            myThermikChart.data.labels = time_span_arr[0].slice(-7);
            myThermikChart.update();

            break;
        case "month":
            var temp_arr = [
                [],
                [],
                [],
                [],
                [],
                []
            ];
            for (let x = 1; x < data_arr.length; x++) {
                //when end of data is reached, jump out -> otherwise there will be an error
                if (data_arr[x][13] === undefined) {
                    break;
                }

                //format date
                var dateString = data_arr[x][13];
                var year = dateString.substring(0, 4);
                var month = dateString.substring(4, 6);
                var day = dateString.substring(6, 8);
                var datum = new Date(year + "-" + month + "-" + day);

                //calculate per day
                var wspeed = 0;
                var bearing = 0;
                var temp = 0;
                var hum = 0;
                var press = 0;
                var rrate = 0;
                var counter = 0;
                var act_datum = data_arr[x][13];
                for (let v = x; data_arr[v][13] == act_datum; v++) {
                    wspeed = wspeed + parseFloat(data_arr[v][1]);
                    bearing = bearing + parseFloat(data_arr[v][3]);
                    temp = temp + parseFloat(data_arr[v][4]);
                    hum = hum + parseFloat(data_arr[v][6]);
                    press = press + parseFloat(data_arr[v][8]);
                    rrate = rrate + parseFloat(data_arr[v][10]);
                    counter++;
                    x = v;
                }
                wspeed = wspeed / counter;
                bearing = bearing / counter;
                temp = temp / counter;
                hum = hum / counter;
                press = press / counter;
                rrate = rrate / counter;

                time_span_arr[0].push(datum.toISOString().substring(0, 10));
                time_span_arr[1].push(wspeed);
                time_span_arr[2].push(bearing);
                time_span_arr[3].push(temp);
                time_span_arr[4].push(hum);
                time_span_arr[5].push(press);
                time_span_arr[6].push(rrate);
            }

            myThermikChart.data.datasets[0].data = time_span_arr[1].slice(-30);
            myThermikChart.data.datasets[1].data = time_span_arr[2].slice(-30);
            myThermikChart.data.datasets[2].data = time_span_arr[3].slice(-30);
            myThermikChart.data.datasets[3].data = time_span_arr[4].slice(-30);
            myThermikChart.data.datasets[4].data = time_span_arr[5].slice(-30);
            myThermikChart.data.datasets[5].data = time_span_arr[6].slice(-30);
            myThermikChart.data.labels = time_span_arr[0].slice(-30);
            myThermikChart.update();

            break;
        case "year":
            var temp_arr = [
                [],
                [],
                [],
                [],
                [],
                []
            ];
            for (let x = 1; x < data_arr.length; x++) {
                //when end of data is reached, jump out -> otherwise there will be an error
                if (data_arr[x][13] === undefined) {
                    break;
                }

                //format date
                var dateString = data_arr[x][13];
                var year = dateString.substring(0, 4);
                var month = dateString.substring(4, 6);
                var day = dateString.substring(6, 8);
                var datum = new Date(year + "-" + month + "-" + day);

                //calculate per day
                var wspeed = 0;
                var bearing = 0;
                var temp = 0;
                var hum = 0;
                var press = 0;
                var rrate = 0;
                var counter = 0;
                var act_datum = data_arr[x][13];
                for (let v = x; data_arr[v][13] == act_datum; v++) {
                    wspeed = wspeed + parseFloat(data_arr[v][1]);
                    bearing = bearing + parseFloat(data_arr[v][3]);
                    temp = temp + parseFloat(data_arr[v][4]);
                    hum = hum + parseFloat(data_arr[v][6]);
                    press = press + parseFloat(data_arr[v][41]);
                    rrate = rrate + parseFloat(data_arr[v][10]);
                    counter++;
                    x = v;
                }
                wspeed = wspeed / counter;
                bearing = bearing / counter;
                temp = temp / counter;
                hum = hum / counter;
                press = press / counter;
                rrate = rrate / counter;

                time_span_arr[0].push(datum.toISOString().substring(0, 10));
                time_span_arr[1].push(wspeed);
                time_span_arr[2].push(bearing);
                time_span_arr[3].push(temp);
                time_span_arr[4].push(hum);
                time_span_arr[5].push(press);
                time_span_arr[6].push(rrate);
            }

            myThermikChart.data.datasets[0].data = time_span_arr[1].slice(-365);
            myThermikChart.data.datasets[1].data = time_span_arr[2].slice(-365);
            myThermikChart.data.datasets[2].data = time_span_arr[3].slice(-365);
            myThermikChart.data.datasets[3].data = time_span_arr[4].slice(-365);
            myThermikChart.data.datasets[4].data = time_span_arr[5].slice(-365);
            myThermikChart.data.datasets[5].data = time_span_arr[6].slice(-365);
            myThermikChart.data.labels = time_span_arr[0].slice(-365);
            myThermikChart.update();
            break;
        default:
    }

    myThermikChart.options.plugins.thresholdPluginThermik = true;
    myThermikChart.update();
}

const thresholdPluginThermik = {
    id: 'thresholdPluginThermik',
    afterLayout: chart => {
    let ctx = chart.ctx;
    ctx.save();
    chart.data.datasets.forEach(element => {
        var t1 = 0;
        var t2 = 0;
        var yAxis = null;
        var dsnumb = -1;
        var color1 = "";
        var color2 = "";
        var color3 = "";

        if(element == chart.data.datasets[0]){
            t1 = ((thresholds[0].wspeedMAX != null)?(thresholds[0].wspeedMAX):(99999))
            t2 = ((thresholds[0].wspeedMIN != null)?(thresholds[0].wspeedMIN):(99999))
            yAxis = chart.scales.B;
            dsnum = 0;
            color1 = "rgba(100, 130, 255, 0.3)";
            color2 = "rgba(100, 130, 255, 0.5)";
            color3 = "rgba(100, 130, 255, 1)";
        }
        if(element == chart.data.datasets[1]){
            t1 = ((thresholds[0].bearingMAX != null)?(thresholds[0].bearingMAX):(99999))
            t2 = ((thresholds[0].bearingMIN != null)?(thresholds[0].bearingMIN):(99999))
            yAxis = chart.scales.A;
            dsnum = 1;
            color1 = "rgba(255, 120, 0, 0.3)";
            color2 = "rgba(255, 120, 0, 0.5)";
            color3 = "rgba(255, 120, 0, 1)";
        }
        if(element == chart.data.datasets[2]){
            t1 = ((thresholds[0].tempMAX != null)?(thresholds[0].tempMAX):(99999))
            t2 = ((thresholds[0].tempMIN != null)?(thresholds[0].tempMIN):(99999))
            yAxis = chart.scales.B;
            dsnum = 2;
            color1 = "rgba(255, 25, 25, 0.3)";
            color2 = "rgba(255, 25, 25, 0.5)";
            color3 = "rgba(255, 25, 25, 1)";
        }
        if(element == chart.data.datasets[3]){
            t1 = ((thresholds[0].humMAX != null)?(thresholds[0].humMAX):(99999))
            t2 = ((thresholds[0].humMIN != null)?(thresholds[0].humMIN):(99999))
            yAxis = chart.scales.P;
            dsnum = 3;
            color1 = "rgba(100, 255, 100, 0.3)";
            color2 = "rgba(100, 255, 100, 0.5)";
            color3 = "rgba(100, 255, 100, 1)";
        }
        if(element == chart.data.datasets[4]){
            t1 = ((thresholds[0].air_pressureMAX != null)?(thresholds[0].air_pressureMAX):(99999))
            t2 = ((thresholds[0].air_pressureMIN != null)?(thresholds[0].air_pressureMIN):(99999))
            yAxis = chart.scales.A;
            dsnum = 4;
            color1 = "rgba(255, 255, 10, 0.3)";
            color2 = "rgba(255, 255, 10, 0.5)";
            color3 = "rgba(255, 255, 10, 1)";
        }
         if(element == chart.data.datasets[5]){
            t1 = ((thresholds[0].rrateMAX != null)?(thresholds[0].rrateMAX):(99999))
            t2 = ((thresholds[0].rrateMIN != null)?(thresholds[0].rrateMIN):(99999))
            yAxis = chart.scales.I;
            dsnum = 5;
            color1 = "rgba(0, 255, 255, 0.3)";
            color2 = "rgba(0, 255, 255, 0.5)";
            color3 = "rgba(0, 255, 255, 1)";
        }

        let yThreshold1 = yAxis.getPixelForValue(t1);
        let yThreshold2 = yAxis.getPixelForValue(t2);
        let gradient = ctx.createLinearGradient(0, yAxis.top, 0, yAxis.bottom);
        let offset =  (yThreshold1 - yAxis.top) / yAxis.height;
        let offset2 =  (yThreshold2 - yAxis.top) / yAxis.height;

        if((yThreshold1 < 0 && yThreshold2 < 0)|| yThreshold1 < 0 && yThreshold2 > 0 && offset2 < 0){
            chart.data.datasets[dsnum].borderColor = color3;
            chart.data.datasets[dsnum].backgroundColor = color3;
            return;
        }
        if(yThreshold1 < 0 && yThreshold2 > 0 && offset2 > 1){
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color1);
            chart.data.datasets[dsnum].borderColor = gradient;
            chart.data.datasets[dsnum].backgroundColor = color3;
            return;
        }

        if(yThreshold1 < 0 && yThreshold2 > 0 ){
            gradient.addColorStop(0, color2);
            gradient.addColorStop(offset2, color2);
            gradient.addColorStop(offset2, color3);
            gradient.addColorStop(1, color3);
            chart.data.datasets[dsnum].borderColor = gradient;
            chart.data.datasets[dsnum].backgroundColor = color3;
            return;
        }

        gradient.addColorStop(0, color1);
        gradient.addColorStop(offset, color1);
        gradient.addColorStop(offset, color2);
        gradient.addColorStop(offset2, color2);
        gradient.addColorStop(offset2, color3);
        gradient.addColorStop(1, color3);
        chart.data.datasets[dsnum].borderColor = gradient;
        chart.data.datasets[dsnum].backgroundColor = color3;
    })
    ctx.restore();
}};

function thermik_chart() {
    var temp_arr = [];
    myThermikChart = new Chart("chartThermik", {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                    data: [],
                    pointRadius: 1,
                    label: "Windgeschwindigkeit",
                    yAxisID: 'B',

                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Windrichtung",
                    yAxisID: 'A',
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Temperatur",
                    yAxisID: 'B',

                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Feuchtigkeit",
                    yAxisID: 'P',

                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Luftdruck",
                    yAxisID: 'A',
                },
                {
                    data: [],
                    pointRadius: 1,
                    label: "Niederschlagsintensität",
                    yAxisID: 'I'
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
                    title: {
                        display: true,
                        text: 'Date',
                        font: {
                            size: 18
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            var unit = "";
                            switch (context.dataset.label) {
                                case "Windgeschwindigkeit":
                                    unit = " m/s";
                                    break;

                                case "Windrichtung":
                                    unit = " °";
                                    break;

                                case "Temperatur":
                                    unit = " °C";
                                    break;

                                case "Feuchtigkeit":
                                    unit = " %";
                                    break;

                                case "Luftdruck":
                                    unit = " hPa";
                                    break;

                                case "Niederschlagsintensität":
                                    unit = " mm/h";
                                    break;

                                default:
                                    unit = "";
                            }
                            return context.dataset.label + ': ' + context.formattedValue + unit;
                        },
                    }
                },
                thresholdPluginThermik: false,
            }
        },
        plugins: [thresholdPluginThermik]
    });

    time_span_thermik("day");
}

function temp_hum_chart() {
    var temp_arr = [
        [],
        [],
        []
    ];
    for (let x = 1; x < data_arr.length; x++) {
        //when end of data is reached, jump out -> otherwise there will be an error
        if (data_arr[x][13] === undefined) {
            break;
        }

        //calculate avg temp per day & avg hum per day
        var temp = 0;
        var hum = 0;
        var counter = 0;
        var act_datum = data_arr[x][13];
        for (let v = x; data_arr[v][13] == act_datum; v++) {
            hum = hum + parseFloat(data_arr[v][6]);
            temp = temp + parseFloat(data_arr[v][4]);
            counter++;
            x = v;
        }
        hum = hum / counter;
        temp = temp / counter;

        temp_arr[1].push(temp);
        temp_arr[2].push(hum);
    }

    var mychart = new Chart("chartTempHum", {
        type: "bubble",
        data: {
            labels: temp_arr[1],
            datasets: [{
                data: temp_arr[2],
                pointRadius: 4,
                label: "Humidity"
            }]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Humidity in %',
                        font: {
                            size: 18
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Temperature in celsius',
                        font: {
                            size: 18
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function avg_per_day_chart() {
    //data prep
    var temp_arr = [
        [],
        [],
        []
    ];
    for (let x = 1; x < data_arr.length; x++) {
        //when end of data is reached, jump out -> otherwise there will be an error
        if (data_arr[x][13] === undefined) {
            break;
        }

        //format date
        var dateString = data_arr[x][13];
        var year = dateString.substring(0, 4);
        var month = dateString.substring(4, 6);
        var day = dateString.substring(6, 8);
        var datum = new Date(year + "-" + month + "-" + day);

        //calculate avg temp per day & avg hum per day
        var temp = 0;
        var hum = 0;
        var counter = 0;
        var act_datum = data_arr[x][13];
        for (let v = x; data_arr[v][13] == act_datum; v++) {
            hum = hum + parseFloat(data_arr[v][6]);
            temp = temp + parseFloat(data_arr[v][4]);
            counter++;
            x = v;
        }
        hum = hum / counter;
        temp = temp / counter;

        temp_arr[0].push(datum.toISOString().substring(0, 10));
        temp_arr[1].push(temp);
        temp_arr[2].push(hum);
    }

    var mychart = new Chart("myChart", {
        type: "line",
        data: {
            labels: temp_arr[0],
            datasets: [{
                    data: temp_arr[1],
                    pointRadius: 2,
                    label: "Temperature in celsius"
                },
                {
                    data: temp_arr[2],
                    pointRadius: 2,
                    label: "Humidity in %"
                }
            ]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            maintainAspectRatio: false,
        }
    });

}

function avg_temp_per_hour_daybyday_chart() {

    //listen on date change
    var date_picker = document.getElementById("temp_day_hour");

    //temp of day per hour chart
    var mychart = new Chart("myChart2", {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                data: [],
                pointRadius: 2,
                label: "Temperature"
            }]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'celsius'
                    }
                }
            },
            maintainAspectRatio: false,
        }
    });

    date_picker.addEventListener('change', (event) => {
        //data prep
        var temp_arr = [
            [],
            []
        ];
        var chosen_date = date_picker.value.replaceAll('-', '');

        //search chosen day in data
        for (let i = 1; i < data_arr.length; i++) {
            if (data_arr[i][13] == chosen_date) {

                //format time
                var zeit = data_arr[i][14].toString();
                while (zeit.length < 6) {
                    zeit = "0" + zeit;
                }
                zeit = (zeit.replace(/.{2}/g, '$&:')).slice(0, -4);

                //save to array (used in chart
                temp_arr[0].push(zeit);
                temp_arr[1].push(data_arr[i][4]);

                //exit for when last measurement of the day is passed
                if (data_arr[i + 1][13] != chosen_date) {
                    break;
                }
            }
        }

        //update charts values (x-axis & y-axis)
        mychart.data.datasets[0].data = temp_arr[1] // y-axis
        mychart.data.labels = temp_arr[0] // x-axis
        mychart.update();
    });
}


function klima_chart() {
    //data prep
    var temp_arr = [
        [],
        [],
        []
    ];
    for (let x = 1; x < data_arr.length; x++) {
        //when end of data is reached, jump out -> otherwise there will be an error
        if (data_arr[x][13] === undefined) {
            break;
        }

        //format date
        var dateString = data_arr[x][13];
        var year = dateString.substring(0, 4);
        var month = dateString.substring(4, 6);
        var day = dateString.substring(6, 8);
        var datum = new Date(year + "-" + month + "-" + day);

        //calculate avg temp per day & avg hum per day
        var temp = 0;
        var hum = 0;
        var counter = 0;
        var act_datum = data_arr[x][13];
        for (let v = x; data_arr[v][13] == act_datum; v++) {
            hum = hum + parseFloat(data_arr[v][6]);
            temp = temp + parseFloat(data_arr[v][4]);
            counter++;
            x = v;
        }
        hum = hum / counter;
        temp = temp / counter;

        temp_arr[0].push(datum.toISOString().substring(0, 10));
        temp_arr[1].push(temp);
        temp_arr[2].push(hum);
    }

    var mychart = new Chart("chartKlima", {
        type: "line",
        data: {
            labels: temp_arr[0],
            datasets: [{
                    data: temp_arr[1],
                    pointRadius: 2,
                    label: "Temperature in celsius"
                },
                {
                    data: temp_arr[2],
                    pointRadius: 2,
                    label: "Humidity in %"
                }
            ]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            maintainAspectRatio: false,
        }
    });
}
