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
                <button id="close-dialog">Schließen</button>
                <canvas id="thresChart"></canvas>
                <br>
                <div style="text-align:center;">
                    <button onclick="thresRadChart('day')">Last Day</button>
                    <button onclick="thresRadChart('week')">Last Week</button>
                    <button onclick="thresRadChart('month')">Last Month</button>
                    <button onclick="thresRadChart('year')">Last Year</button>
                </div>
            `;
            thresRadChart("day");

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
                <h2> Radiation Thresholds Chart </h2>
                <button id="close-dialog">Schließen</button>
                <canvas id="thresChart"></canvas>
                <br>
                <div style="text-align:center;">
                    <button onclick="thresThermikChart('day')">Last Day</button>
                    <button onclick="thresThermikChart('week')">Last Week</button>
                    <button onclick="thresThermikChart('month')">Last Month</button>
                    <button onclick="thresThermikChart('year')">Last Year</button>
                </div>

            `;
            thresThermikChart("day");

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
                <h2> Radiation Thresholds Chart </h2>
                <button id="close-dialog">Schließen</button>
                <canvas id="thresChart"></canvas>
                <br>
                <div style="text-align:center;">
                    <button onclick="thresAirChart('day')">Last Day</button>
                    <button onclick="thresAirChart('week')">Last Week</button>
                    <button onclick="thresAirChart('month')">Last Month</button>
                    <button onclick="thresAirChart('year')">Last Year</button>
                </div>
            `;
            thresAirChart("day");

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

function thresRadChart(zeit){
    var thres = calcThresRad(zeit)

    if(myChart != null){
        myChart.destroy()
    }

    myChart = new Chart('thresChart', {
            type: 'bar',
            data: {
                labels: ["UV Index","Strahlung","Helligkeit"],
                datasets: [
                    {
                        label: "Unter Schwellenwert",
                        data: [thres.uv.down, thres.radiation.down],
                        backgroundColor: "green",
                        datalabels: {
                                align: 'end',
                                anchor: 'start'
                              }
                    },
                    {
                        label: "In Schwellenwerten",
                        data: [thres.uv.mid, thres.radiation.mid],
                        backgroundColor: "yellow",
                        datalabels: {
                                align: 'end',
                                anchor: 'start'
                              }
                    },
                    {
                        label: "Über Schwellenwert",
                        data: [thres.uv.up, thres.radiation.up],
                        backgroundColor: "red",
                        datalabels: {
                                align: 'end',
                                anchor: 'start'
                              }
                    }
                ]
            },
            plugins: [ChartDataLabels],
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
            datasliced = data.slice(-1008); //slice 144 observations = 1 week
            break;
        case "month":
            datasliced = data.slice(-4320); //slice 144 observations = 1 month
            break;
        case "year":
            datasliced = data.slice(-52560); //slice 144 observations = 1 year
            break;
    }


    for ([key, value] of Object.entries(datasliced)) {
        // UV
        if(tr[0].uvMIN != null){
            if(parseFloat(value["uv"])>tr[0].uvMAX){
               thres.uv.up += 10
            }
            if(parseFloat(value["uv"])<tr[0].uvMAX && parseFloat(value["uv"])>tr[0].uvMIN){
                 thres.uv.mid += 10
            }
            if(parseFloat(value["uv"])<tr[0].uvMIN){
                thres.uv.down += 10
            }
        }

        //radiation
        if(tr[0].solarradMIN != null){
            if(parseFloat(value["solarrad"])>tr[0].solarradMAX){
               thres.radiation.up += 10
            }
            if(parseFloat(value["solarrad"])<tr[0].solarradMAX && parseFloat(value["solarrad"])>tr[0].solarradMIN){
                 thres.radiation.mid += 10
            }
            if(parseFloat(value["solarrad"])<tr[0].solarradMIN){
                thres.radiation.down += 10
            }
        }

        //brightness
        if(tr[0].brightnessMIN != null){
            if(parseFloat(value["brightness"])>tr[0].brightnessMAX){
               thres.brightness.up += 10
            }
            if(parseFloat(value["brightness"])<tr[0].brightnessMAX && parseFloat(value["brightness"])>tr[0].brightnessMIN){
                 thres.brightness.mid += 10
            }
            if(parseFloat(value["brightness"])<tr[0].brightnessMIN){
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
                labels: ["pm1","pm10","pm2_5","o3","no2","so2","co","h2s","no","air_quality"],
                datasets: [
                    {
                        label: "Unter Schwellenwert",
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
                        label: "In Schwellenwerten",
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
                        label: "Über Schwellenwert",
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
            plugins: [ChartDataLabels],
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
            datasliced = data.slice(-1008); //slice 144 observations = 1 week
            break;
        case "month":
            datasliced = data.slice(-4320); //slice 144 observations = 1 month
            break;
        case "year":
            datasliced = data.slice(-52560); //slice 144 observations = 1 year
            break;
        }

    for ([key, value] of Object.entries(datasliced)) {
        // pm1
        if(tr[0].pm1MIN != null){
            if(parseFloat(value["pm1"])>tr[0].pm1MAX){
               thres.pm1.up += 10
            }
            if(parseFloat(value["pm1"])<tr[0].pm1MAX && parseFloat(value["pm1"])>tr[0].pm1MIN){
                 thres.pm1.mid += 10
            }
            if(parseFloat(value["pm1"])<tr[0].pm1MIN){
                thres.pm1.down += 10
            }
        }

        //pm10
        if(tr[0].pm10MIN != null){
            if(parseFloat(value["pm10"])>tr[0].pm10MAX){
               thres.pm10.up += 10
            }
            if(parseFloat(value["pm10"])<tr[0].pm10MAX && parseFloat(value["pm10"])>tr[0].pm10MIN){
                 thres.pm10.mid += 10
            }
            if(parseFloat(value["pm10"])<tr[0].pm10MIN){
                thres.pm10.down += 10
            }
        }

        //pm2_5
        if(tr[0].pm2_5MIN != null){
            if(parseFloat(value["pm2_5"])>tr[0].pm2_5MAX){
               thres.pm2_5.up += 10
            }
            if(parseFloat(value["pm2_5"])<tr[0].pm2_5MAX && parseFloat(value["pm2_5"])>tr[0].pm2_5MIN){
                 thres.pm2_5.mid += 10
            }
            if(parseFloat(value["pm2_5"])<tr[0].pm2_5MIN){
                thres.pm2_5.down += 10
            }
        }

        //o3
        if(tr[0].o3MIN != null){
            if(parseFloat(value["o3"])>tr[0].o3MAX){
               thres.o3.up += 10
            }
            if(parseFloat(value["o3"])<tr[0].o3MAX && parseFloat(value["o3"])>tr[0].o3MIN){
                 thres.o3.mid += 10
            }
            if(parseFloat(value["o3"])<tr[0].o3MIN){
                thres.o3.down += 10
            }
        }


        //no2
        if(tr[0].no2MIN != null){
            if(parseFloat(value["no2"])>tr[0].no2MAX){
               thres.no2.up += 10
            }
            if(parseFloat(value["no2"])<tr[0].no2MAX && parseFloat(value["no2"])>tr[0].no2MIN){
                 thres.no2.mid += 10
            }
            if(parseFloat(value["no2"])<tr[0].no2MIN){
                thres.no2.down += 10
            }
        }

        //so2
        if(tr[0].so2MIN != null){
            if(parseFloat(value["so2"])>tr[0].so2MAX){
               thres.so2.up += 10
            }
            if(parseFloat(value["so2"])<tr[0].so2MAX && parseFloat(value["so2"])>tr[0].so2MIN){
                 thres.so2.mid += 10
            }
            if(parseFloat(value["so2"])<tr[0].so2MIN){
                thres.so2.down += 10
            }
                }

        //co
        if(tr[0].coMIN != null){
            if(parseFloat(value["co"])>tr[0].coMAX){
               thres.co.up += 10
            }
            if(parseFloat(value["co"])<tr[0].coMAX && parseFloat(value["co"])>tr[0].coMIN){
                 thres.co.mid += 10
            }
            if(parseFloat(value["co"])<tr[0].coMIN){
                thres.co.down += 10
            }
        }

        //h2s
        if(tr[0].h2sMIN != null){
            if(parseFloat(value["h2s"])>tr[0].h2sMAX){
               thres.h2s.up += 10
            }
            if(parseFloat(value["h2s"])<tr[0].h2sMAX && parseFloat(value["h2s"])>tr[0].h2sMIN){
                 thres.h2s.mid += 10
            }
            if(parseFloat(value["h2s"])<tr[0].h2sMIN){
                thres.h2s.down += 10
            }
        }

        //no
        if(tr[0].noMIN != null){
            if(parseFloat(value["no"])>tr[0].noMAX){
                thres.no.up += 10
            }
            if(parseFloat(value["no"])<tr[0].noMAX && parseFloat(value["no"])>tr[0].noMIN){
                thres.no.mid += 10
            }
            if(parseFloat(value["no"])<tr[0].noMIN){
                thres.no.down += 10
            }
        }

         // air_quality
        if(tr[0].air_qualityMIN != null){
            if(parseFloat(value["air_quality"])>tr[0].air_qualityMAX){
               thres.air_quality.up += 10
            }
            if(parseFloat(value["air_quality"])<tr[0].air_qualityMAX && parseFloat(value["air_quality"])>tr[0].air_qualityMIN){
                 thres.air_quality.mid += 10
            }
            if(parseFloat(value["air_quality"])<tr[0].air_qualityMIN){
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
                labels: ["Windgeschwindigkeit","Windrichtung","Temperatur","Luftfeuchtigkeit","Luftdruck","Niederschlagsrate"],
                datasets: [
                    {
                        label: "Unter Schwellenwert",
                        data: [thres.wspeed.down, thres.bearing.down, thres.temp.down,
                                thres.hum.down, thres.press.down, thres.rrate.down],
                        backgroundColor: "green",
                        datalabels: {
                                align: 'end',
                                anchor: 'start'
                              }
                    },
                    {
                        label: "In Schwellenwerten",
                        data: [thres.wspeed.mid, thres.bearing.mid, thres.temp.mid,
                              thres.hum.mid, thres.press.mid, thres.rrate.mid],
                        backgroundColor: "yellow",
                        datalabels: {
                                align: 'end',
                                anchor: 'start'
                              }
                    },
                    {
                        label: "Über Schwellenwert",
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
            plugins: [ChartDataLabels],
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
            datasliced = data.slice(-1008); //slice 144 observations = 1 week
            break;
        case "month":
            datasliced = data.slice(-4320); //slice 144 observations = 1 month
            break;
        case "year":
            datasliced = data.slice(-52560); //slice 144 observations = 1 year
            break;
    }

    for ([key, value] of Object.entries(datasliced)) {
        // wspeed
        if(tr[0].wspeedMIN != null){
            if(parseFloat(value["wspeed"])>tr[0].wspeedMAX){
                thres.wspeed.up += 10
            }
            if(parseFloat(value["wspeed"])<tr[0].wspeedMAX && parseFloat(value["wspeed"])>tr[0].wspeedMIN){
                thres.wspeed.mid += 10
            }
            if(parseFloat(value["wspeed"])<tr[0].wspeedMIN){
                thres.wspeed.down += 10
            }
        }

        // bearing
        if(tr[0].bearingMIN != null){
            if(parseFloat(value["bearing"])>tr[0].bearingMAX){
                thres.bearing.up += 10
            }
            if(parseFloat(value["bearing"])<tr[0].bearingMAX && parseFloat(value["bearing"])>tr[0].bearingMIN){
                thres.bearing.mid += 10
            }
            if(parseFloat(value["bearing"])<tr[0].bearingMIN){
                thres.bearing.down += 10
            }
        }

        // temp
        if(tr[0].tempMIN != null){
            if(parseFloat(value["temp"])>tr[0].tempMAX){
                thres.temp.up += 10
            }
            if(parseFloat(value["temp"])<tr[0].tempMAX && parseFloat(value["temp"])>tr[0].tempMIN){
                thres.temp.mid += 10
            }
            if(parseFloat(value["temp"])<tr[0].tempMIN){
                thres.temp.down += 10
            }
        }

        // hum
        if(tr[0].humMIN != null){
            if(parseFloat(value["hum"])>tr[0].humMAX){
                thres.hum.up += 10
            }
            if(parseFloat(value["hum"])<tr[0].humMAX && parseFloat(value["hum"])>tr[0].humMIN){
                thres.hum.mid += 10
            }
            if(parseFloat(value["hum"])<tr[0].humMIN){
                thres.hum.down += 10
            }
        }

        // press
        if(tr[0].pressMIN != null){
            if(parseFloat(value["press"])>tr[0].pressMAX){
                thres.press.up += 10
            }
            if(parseFloat(value["press"])<tr[0].pressMAX && parseFloat(value["press"])>tr[0].pressMIN){
                thres.press.mid += 10
            }
            if(parseFloat(value["press"])<tr[0].pressMIN){
                thres.press.down += 10
            }
        }

        // rrate
        if(tr[0].rrateMIN != null){
            if(parseFloat(value["rrate"])>tr[0].rrateMAX){
                thres.rrate.up += 10
            }
            if(parseFloat(value["rrate"])<tr[0].rrateMAX && parseFloat(value["rrate"])>tr[0].rrateMIN){
                thres.rrate.mid += 10
            }
            if(parseFloat(value["rrate"])<tr[0].rrateMIN){
                thres.rrate.down += 10
            }
        }
    }
    return thres;
}