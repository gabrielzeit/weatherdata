var tr = null;
var data = null;

async function stackedMain(chartType){
//    Chart.register(ChartDataLabels);

    if(thresholds == null){
        thresholds = await getThresholds();
    }
    tr = thresholds;

    switch(chartType){
        case "radChart":
             if(radiationDataJson == null){
                 radiationDataJson = await getJSONRadiation();
             }
            data = radiationDataJson;

            document.getElementById("dialog").innerHTML = `
                <h2> Radiation Thresholds Chart </h2>
                <button id="close-dialog">Close</button>
                <canvas id="thresChart"></canvas>
                <br>
                <div style="text-align:center;">
                    <button onclick="thresRadChart('day')">Last Day</button>
                    <button onclick="thresRadChart('week')">Last Week</button>
                    <button onclick="thresRadChart('month')">Last Month</button>
                    <button onclick="thresRadChart('year')">Last Year</button>
                </div>
            `;
            thresRadChart("year");

            // add event listener to close any threshold dialog
            document.getElementById("close-dialog")
            .addEventListener("click", () => {
                document.getElementById("dialog")
                    .close();
            });

            document.getElementById("dialog").showModal();

            break;

        case "therChart":
            if(thermikDataJson == null){
                 thermikDataJson = await getJSONThermik();
             }
            data = thermikDataJson;

            document.getElementById("dialog").innerHTML = `
                <h2> Thermals Thresholds Chart </h2>
                <button id="close-dialog">Close</button>
                <canvas id="thresChart"></canvas>
                <br>
                <div style="text-align:center;">
                    <button onclick="thresThermikChart('day')">Last Day</button>
                    <button onclick="thresThermikChart('week')">Last Week</button>
                    <button onclick="thresThermikChart('month')">Last Month</button>
                    <button onclick="thresThermikChart('year')">Last Year</button>
                </div>

            `;
            thresThermikChart("year");

            // add event listener to close any threshold dialog
            document.getElementById("close-dialog")
            .addEventListener("click", () => {
                document.getElementById("dialog")
                    .close();
            });

            document.getElementById("dialog").showModal();

            break;

        case "airChart":
            if(airqualityDataJson == null){
                 airqualityDataJson = await getJSONAirquality();

             }
            data = airqualityDataJson;

            document.getElementById("dialog").innerHTML = `
                <h2> Air Quality Thresholds Chart </h2>
                <button id="close-dialog">Close</button>
                <canvas id="thresChart"></canvas>
                <br>
                <div style="text-align:center;">
                    <button onclick="thresAirChart('day')">Last Day</button>
                    <button onclick="thresAirChart('week')">Last Week</button>
                    <button onclick="thresAirChart('month')">Last Month</button>
                    <button onclick="thresAirChart('year')">Last Year</button>
                </div>
            `;
            thresAirChart("year");

            // add event listener to close any threshold dialog
            document.getElementById("close-dialog")
            .addEventListener("click", () => {
                document.getElementById("dialog")
                    .close();
            });

            document.getElementById("dialog").showModal();

            break;
        case "klimaChart":
            if(myAnalyseChart.data.datasets.length == 0){
                alert("No data features selected and confirmed!")
            }
            data = myAnalyseChart.data.datasets;

            document.getElementById("dialog").innerHTML = `
                <h2>Climate Analysis Thresholds Chart </h2>
                <button id="close-dialog">Close</button>
                <canvas id="klimaChart"></canvas>
                <br>
            `;
            thresKlimaChart();

            // add event listener to close any threshold dialog
            document.getElementById("close-dialog")
            .addEventListener("click", () => {
                document.getElementById("dialog")
                    .close();
            });

            document.getElementById("dialog").showModal();

            break;
    }
}

let myChart = null;

function thresKlimaChart(zeit){
    if(myChart != null){
        myChart.destroy()
    }

    var klimadata = []
    var labels = []

    myAnalyseChart.data.datasets.forEach(function(dataset){
        labels.push(dataset.label);
        klimadata.push(dataset.data)
    });

    var thresklimadata = [];

    if(klimadata.length > 0){
        thresklimadata.push([],[],[]) // 0 up / 1 mid / 2 down

        for(let labelnum = 0; labelnum < labels.length; labelnum++){

            var up = 0;
            var mid = 0;
            var down = 0;

            if(tr[labels[labelnum]+ "min"] !=null || tr[labels[labelnum]+ "max"] !=null){

                var minthres = tr[labels[labelnum] + "min"];
                var maxthres = tr[labels[labelnum] + "max"];

                for(let x = 0; x < klimadata[0].length; x++){
                    if(klimadata[labelnum][x].y >= maxthres){
                        up += 10;
                    }
                    if(klimadata[labelnum][x].y < maxthres && klimadata[labelnum][x].y > minthres){
                        mid += 10;
                    }
                    if(klimadata[labelnum][x].y <= minthres){
                        down += 10;
                    }
                }
            }

            thresklimadata[0].push(up)
            thresklimadata[1].push(mid)
            thresklimadata[2].push(down)
        }

    }


    myChart = new Chart('klimaChart', {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Under Threshold",
                    data: thresklimadata[2],
                    backgroundColor: "green",
                    datalabels: {
                            align: 'end',
                            anchor: 'start'
                          }
                },
                {
                    label: "Between Thresholds",
                    data: thresklimadata[1],
                    backgroundColor: "yellow",
                    datalabels: {
                            align: 'end',
                            anchor: 'start'
                          }
                },
                {
                    label: "Over Threshold",
                    data: thresklimadata[0],
                    backgroundColor: "red",
                    datalabels: {
                            align: 'end',
                            anchor: 'start'
                          }
                }
            ]
        },
//            plugins: [ChartDataLabels],
        options: {
            plugins: {
            tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.formattedValue + " min"
                        },
                    }
                },
              title: {
                display: true
              },
              datalabels: {
                  borderColor: 'white',
                  borderWidth: 2,
                  borderRadius: 4,
                  color: 'white',
                  backgroundColor: 'black',
                  display: true,
                  font: {
                    size: 14,
                    weight: 'bold'
                  },
                  formatter: function(value){
                      return value + ' min';
                  }
                }
            },
            responsive: true,
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true
              }
            }
        }
    });
}

function thresRadChart(zeit){
    var thres = calcThresRad(zeit)

    if(myChart != null){
        myChart.destroy()
    }

    myChart = new Chart('thresChart', {
        type: 'bar',
        data: {
            labels: ["UV Index","Radiation","Brightness"],
            datasets: [
                {
                    label: "Under Threshold",
                    data: [thres.uv.down, thres.radiation.down],
                    backgroundColor: "green",
                    datalabels: {
                            align: 'end',
                            anchor: 'start'
                          }
                },
                {
                    label: "Between Thresholds",
                    data: [thres.uv.mid, thres.radiation.mid],
                    backgroundColor: "yellow",
                    datalabels: {
                            align: 'end',
                            anchor: 'start'
                          }
                },
                {
                    label: "Over Threshold",
                    data: [thres.uv.up, thres.radiation.up],
                    backgroundColor: "red",
                    datalabels: {
                            align: 'end',
                            anchor: 'start'
                          }
                }
            ]
        },
//            plugins: [ChartDataLabels],
        options: {
            plugins: {
            tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.formattedValue + " min"
                        },
                    }
                },
              title: {
                display: true
              },
              datalabels: {
                  borderColor: 'white',
                  borderWidth: 2,
                  borderRadius: 4,
                  color: 'white',
                  backgroundColor: 'black',
                  display: true,
                  font: {
                    size: 14,
                    weight: 'bold'
                  },
                  formatter: function(value){
                      return value + ' min';
                  }
                }
            },
            responsive: true,
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true
              }
            }
        }
    });
    console.log(myChart.data.datasets)
}

function calcThresRad(zeit){
    var thres = {
        radiation: {
            up:0,
            mid:0,
            down:0
        },
        uv: {
            up:0,
            mid:0,
            down:0
        },
        brightness: {
            up:0,
            mid:0,
            down:0
        },
    };

    switch(zeit){
        case "day":
            datasliced = data.slice(-144); //slice 144 observations = 1 day
            break;
        case "week":
            datasliced = data.slice(-1008); //slice 1008 observations = 1 week
            break;
        case "month":
            datasliced = data.slice(-4320); //slice 4320 observations = 1 month
            break;
        case "year":
            datasliced = data.slice(-52560); //slice 52560 observations = 1 year
            break;
    }


    for ([key, value] of Object.entries(datasliced)) {
        // UV
        if(tr.uvmin != null || tr.uvmax != null){
            if(parseFloat(value["uv"])>=tr.uvmax){
               thres.uv.up += 10
            }
            if(parseFloat(value["uv"])<tr.uvmax && parseFloat(value["uv"])>tr.uvmin){
                 thres.uv.mid += 10
            }
            if(parseFloat(value["uv"])<=tr.uvmin){
                thres.uv.down += 10
            }
        }

        //radiation
        if(tr.solarradmin != null || tr.solarradmax != null){
            if(parseFloat(value["solarrad"])>=tr.solarradmax){
               thres.radiation.up += 10
            }
            if(parseFloat(value["solarrad"])<tr.solarradmax && parseFloat(value["solarrad"])>tr.solarradmin){
                 thres.radiation.mid += 10
            }
            if(parseFloat(value["solarrad"])<=tr.solarradmin){
                thres.radiation.down += 10
            }
        }

        //brightness
        if(tr.brightnessmin != null || tr.brightnessmax != null){
            if(parseFloat(value["brightness"])>=tr.brightnessmax){
               thres.brightness.up += 10
            }
            if(parseFloat(value["brightness"])<tr.brightnessmax && parseFloat(value["brightness"])>tr.brightnessmin){
                 thres.brightness.mid += 10
            }
            if(parseFloat(value["brightness"])<=tr.brightnessmin){
                thres.brightness.down += 10
            }
        }
    }

    return thres;
}


function thresAirChart(zeit){
    var thres = calcThresAir(zeit)

    if(myChart != null){
        myChart.destroy()
    }

    myChart = new Chart('thresChart', {
            type: 'bar',
            data: {
                labels: ["PM1","PN10","PM 2.5","O3","NO2","SO2","CO","H2S","NO","Air Quality"],
                datasets: [
                    {
                        label: "Under Threshold",
                        data: [thres.pm1.down, thres.pm10.down, thres.pm2_5.down,
                                thres.o3.down, thres.no2.down, thres.so2.down,
                                 thres.co.down, thres.h2s.down, thres.no.down,
                                  thres.air_quality.down],
                        backgroundColor: "green",
                        datalabels: {
                                align: 'end',
                                anchor: 'start'
                              }
                    },
                    {
                        label: "Between Thresholds",
                        data: [thres.pm1.mid, thres.pm10.mid, thres.pm2_5.mid,
                                thres.o3.mid, thres.no2.mid, thres.so2.mid,
                                 thres.co.mid, thres.h2s.mid, thres.no.mid,
                                  thres.air_quality.mid],
                        backgroundColor: "yellow",
                        datalabels: {
                                align: 'end',
                                anchor: 'start'
                              }
                    },
                    {
                        label: "Over Threshold",
                        data: [thres.pm1.up, thres.pm10.up, thres.pm2_5.up,
                                thres.o3.up, thres.no2.up, thres.so2.up,
                                 thres.co.up, thres.h2s.up, thres.no.up,
                                  thres.air_quality.up],
                        backgroundColor: "red",
                        datalabels: {
                                align: 'end',
                                anchor: 'start'
                              }
                    }
                ]
            },
//            plugins: [ChartDataLabels],
            options: {
                plugins: {
                 tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.formattedValue + " min"
                            },
                        }
                    },
                  title: {
                    display: true
                  },
                  datalabels: {
                      borderColor: 'white',
                      borderWidth: 2,
                      borderRadius: 4,
                      color: 'white',
                      backgroundColor: 'black',
                      display: true,
                      font: {
                        size: 14,
                        weight: 'bold'
                      },
                      formatter: function(value){
                          return value + ' min';
                      }
                    }
                },
                responsive: true,
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true
                  }
                }
            }
        });
}


function calcThresAir(zeit){
    var thres = {
        pm1: {
            up:0,
            mid:0,
            down:0
        },
        pm10: {
            up:0,
            mid:0,
            down:0
        },
        pm2_5: {
            up:0,
            mid:0,
            down:0
        },
        o3: {
            up:0,
            mid:0,
            down:0
        },
        no2: {
            up:0,
            mid:0,
            down:0
        },
        so2: {
            up:0,
            mid:0,
            down:0
        },
        co: {
            up:0,
            mid:0,
            down:0
        },
        h2s: {
            up:0,
            mid:0,
            down:0
        },
        no: {
            up:0,
            mid:0,
            down:0
        },
        air_quality: {
            up:0,
            mid:0,
            down:0
        }
    };

     switch(zeit){
        case "day":
            datasliced = data.slice(-144); //slice 144 observations = 1 day
            break;
        case "week":
            datasliced = data.slice(-1008); //slice 1008 observations = 1 week
            break;
        case "month":
            datasliced = data.slice(-4320); //slice 4320 observations = 1 month
            break;
        case "year":
            datasliced = data.slice(-52560); //slice 52560 observations = 1 year
            break;
        }

    for ([key, value] of Object.entries(datasliced)) {
        // pm1
        if(tr.pm1min != null || tr.pm1max != null){
            if(parseFloat(value["pm1"])>=tr.pm1max){
               thres.pm1.up += 10
            }
            if(parseFloat(value["pm1"])<tr.pm1max && parseFloat(value["pm1"])>tr.pm1min){
                 thres.pm1.mid += 10
            }
            if(parseFloat(value["pm1"])<=tr.pm1min){
                thres.pm1.down += 10
            }
        }

        //pm10
        if(tr.pm10min != null || tr.pm10max != null){
            if(parseFloat(value["pm10"])>=tr.pm10max){
               thres.pm10.up += 10
            }
            if(parseFloat(value["pm10"])<tr.pm10max && parseFloat(value["pm10"])>tr.pm10min){
                 thres.pm10.mid += 10
            }
            if(parseFloat(value["pm10"])<=tr.pm10min){
                thres.pm10.down += 10
            }
        }

        //pm2_5
        if(tr.pm2_5min != null || tr.pm2_5max != null){
            if(parseFloat(value["pm2_5"])>=tr.pm2_5max){
               thres.pm2_5.up += 10
            }
            if(parseFloat(value["pm2_5"])<tr.pm2_5max && parseFloat(value["pm2_5"])>tr.pm2_5min){
                 thres.pm2_5.mid += 10
            }
            if(parseFloat(value["pm2_5"])<=tr.pm2_5min){
                thres.pm2_5.down += 10
            }
        }

        //o3
        if(tr.o3min != null || tr.o3max != null){
            if(parseFloat(value["o3"])>=tr.o3max){
               thres.o3.up += 10
            }
            if(parseFloat(value["o3"])<tr.o3max && parseFloat(value["o3"])>tr.o3min){
                 thres.o3.mid += 10
            }
            if(parseFloat(value["o3"])<=tr.o3min){
                thres.o3.down += 10
            }
        }


        //no2
        if(tr.no2min != null || tr.no2max != null){
            if(parseFloat(value["no2"])>=tr.no2max){
               thres.no2.up += 10
            }
            if(parseFloat(value["no2"])<tr.no2max && parseFloat(value["no2"])>tr.no2min){
                 thres.no2.mid += 10
            }
            if(parseFloat(value["no2"])<=tr.no2min){
                thres.no2.down += 10
            }
        }

        //so2
        if(tr.so2min != null  || tr.so2max != null){
            if(parseFloat(value["so2"])>=tr.so2max){
               thres.so2.up += 10
            }
            if(parseFloat(value["so2"])<tr.so2max && parseFloat(value["so2"])>tr.so2min){
                 thres.so2.mid += 10
            }
            if(parseFloat(value["so2"])<=tr.so2min){
                thres.so2.down += 10
            }
                }

        //co
        if(tr.comin != null || tr.comax != null){
            if(parseFloat(value["co"])>=tr.comax){
               thres.co.up += 10
            }
            if(parseFloat(value["co"])<tr.comax && parseFloat(value["co"])>tr.comin){
                 thres.co.mid += 10
            }
            if(parseFloat(value["co"])<=tr.comin){
                thres.co.down += 10
            }
        }

        //h2s
        if(tr.h2smin != null || tr.h2smax != null){
            if(parseFloat(value["h2s"])>=tr.h2smax){
               thres.h2s.up += 10
            }
            if(parseFloat(value["h2s"])<tr.h2smax && parseFloat(value["h2s"])>tr.h2smin){
                 thres.h2s.mid += 10
            }
            if(parseFloat(value["h2s"])<=tr.h2smin){
                thres.h2s.down += 10
            }
        }

        //no
        if(tr.nomin != null || tr.nomax != null){
            if(parseFloat(value["no"])>=tr.nomax){
                thres.no.up += 10
            }
            if(parseFloat(value["no"])<tr.nomax && parseFloat(value["no"])>tr.nomin){
                thres.no.mid += 10
            }
            if(parseFloat(value["no"])<=tr.nomin){
                thres.no.down += 10
            }
        }

         // air_quality
        if(tr.air_qualitymin != null || tr.air_qualitymax != null){
            if(parseFloat(value["air_quality"])>=tr.air_qualitymax){
               thres.air_quality.up += 10
            }
            if(parseFloat(value["air_quality"])<tr.air_qualitymax && parseFloat(value["air_quality"])>tr.air_qualitymin){
                 thres.air_quality.mid += 10
            }
            if(parseFloat(value["air_quality"])<=tr.air_qualitymin){
                thres.air_quality.down += 10
            }
        }
    }
    return thres;
}

function thresThermikChart(zeit){
    var thres = calcThresTher(zeit)

    if(myChart != null){
        myChart.destroy()
    }

    myChart = new Chart('thresChart', {
            type: 'bar',
            data: {
                labels: ["Wind Speed","Wind Direction","Temperature","Humidity","Air Pressure","Rainfall Rate"],
                datasets: [
                    {
                        label: "Under Threshold",
                        data: [thres.wspeed.down, thres.bearing.down, thres.temp.down,
                                thres.hum.down, thres.press.down, thres.rrate.down],
                        backgroundColor: "green",
                        datalabels: {
                                align: 'end',
                                anchor: 'start'
                              }
                    },
                    {
                        label: "Between Thresholds",
                        data: [thres.wspeed.mid, thres.bearing.mid, thres.temp.mid,
                              thres.hum.mid, thres.press.mid, thres.rrate.mid],
                        backgroundColor: "yellow",
                        datalabels: {
                                align: 'end',
                                anchor: 'start'
                              }
                    },
                    {
                        label: "Over Threshold",
                        data: [thres.wspeed.up, thres.bearing.up, thres.temp.up,
                                thres.hum.up, thres.press.up, thres.rrate.up],
                        backgroundColor: "red",
                        datalabels: {
                                align: 'end',
                                anchor: 'start'
                              }
                    }
                ]
            },
//            plugins: [ChartDataLabels],
            options: {
                plugins: {
                 tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.formattedValue + " min"
                            },
                        }
                    },
                  title: {
                    display: true
                  },
                  datalabels: {
                      borderColor: 'white',
                      borderWidth: 2,
                      borderRadius: 4,
                      color: 'white',
                      backgroundColor: 'black',
                      display: true,
                      font: {
                        size: 14,
                        weight: 'bold'
                      },
                      formatter: function(value){
                          return value + ' min';
                      }
                    }
                },
                responsive: true,
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true
                  }
                }
            }
        });
}

function calcThresTher(zeit){
    var thres = {
        wspeed: {
            up:0,
            mid:0,
            down:0
        },
        bearing: {
            up:0,
            mid:0,
            down:0
        },
        temp: {
            up:0,
            mid:0,
            down:0
        },
        hum: {
            up:0,
            mid:0,
            down:0
        },
        press: {
            up:0,
            mid:0,
            down:0
        },
        rrate: {
            up:0,
            mid:0,
            down:0
        },
    };

    switch(zeit){
        case "day":
            datasliced = data.slice(-144); //slice 144 observations = 1 day
            break;
        case "week":
            datasliced = data.slice(-1008); //slice 1008 observations = 1 week
            break;
        case "month":
            datasliced = data.slice(-4320); //slice 4320 observations = 1 month
            break;
        case "year":
            datasliced = data.slice(-52560); //slice 52560 observations = 1 year
            break;
    }

    for ([key, value] of Object.entries(datasliced)) {
        // wspeed
        if(tr.wspeedmin != null || tr.wspeedmax != null){
            if(parseFloat(value["wspeed"])>=tr.wspeedmax){
                thres.wspeed.up += 10
            }
            if(parseFloat(value["wspeed"])<tr.wspeedmax && parseFloat(value["wspeed"])>tr.wspeedmin){
                thres.wspeed.mid += 10
            }
            if(parseFloat(value["wspeed"])<=tr.wspeedmin){
                thres.wspeed.down += 10
            }
        }

        // bearing
        if(tr.bearingmin != null || tr.bearingmax != null) {
            if(parseFloat(value["bearing"])>=tr.bearingmax){
                thres.bearing.up += 10
            }
            if(parseFloat(value["bearing"])<tr.bearingmax && parseFloat(value["bearing"])>tr.bearingmin){
                thres.bearing.mid += 10
            }
            if(parseFloat(value["bearing"])<=tr.bearingmin){
                thres.bearing.down += 10
            }
        }

        // temp
        if(tr.tempmin != null || tr.tempmax != null){
            if(parseFloat(value["temp"])>=tr.tempmax){
                thres.temp.up += 10
            }
            if(parseFloat(value["temp"])<tr.tempmax && parseFloat(value["temp"])>tr.tempmin){
                thres.temp.mid += 10
            }
            if(parseFloat(value["temp"])<=tr.tempmin){
                thres.temp.down += 10
            }
        }

        // hum
        if(tr.hummin != null || tr.hummax != null){
            if(parseFloat(value["hum"])>=tr.hummax){
                thres.hum.up += 10
            }
            if(parseFloat(value["hum"])<tr.hummax && parseFloat(value["hum"])>tr.hummin){
                thres.hum.mid += 10
            }
            if(parseFloat(value["hum"])<=tr.hummin){
                thres.hum.down += 10
            }
        }

        // press
        if(tr.pressmin != null || tr.pressmax != null){
            if(parseFloat(value["press"])>=tr.pressmax){
                thres.press.up += 10
            }
            if(parseFloat(value["press"])<tr.pressmax && parseFloat(value["press"])>tr.pressmin){
                thres.press.mid += 10
            }
            if(parseFloat(value["press"])<=tr.pressmin){
                thres.press.down += 10
            }
        }

        // rrate
        if(tr.rratemin != null || tr.rratemax != null){
            if(parseFloat(value["rrate"])>=tr.rratemax){
                thres.rrate.up += 10
            }
            if(parseFloat(value["rrate"])<tr.rratemax && parseFloat(value["rrate"])>tr.rratemin){
                thres.rrate.mid += 10
            }
            if(parseFloat(value["rrate"])<=tr.rratemin){
                thres.rrate.down += 10
            }
        }
    }
    return thres;
}