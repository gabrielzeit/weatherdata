function main(){
    Chart.register(ChartDataLabels);

    thresRadChart();

}
main();

function thresRadChart(){
    var thres = calcThresRad()
    new Chart('myChart', {
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
            options: {
                plugins: {
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

function calcThresRad(){
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


    //  thres = thresholds json
        // exchange to thresholds GET when online
       var tr = JSON.parse(thresh)

  // exchange to radiation GET when online
    var data = JSON.parse(radiationJSON)

    for ([key, value] of Object.entries(data)) {
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
            if(parseFloat(value["solarrad"])>tr[0].solarradMIN){
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
            if(parseFloat(value["brightness"])>tr[0].brightnessMIN){
                thres.brightness.down += 10
            }
        }
    }
    return thres;
}


function thresAirChart(){
    var thres = calcThresAir()
    new Chart('myChart', {
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
            options: {
                plugins: {
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


function calcThresAir(){
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
        }
    };


    //  thres = thresholds json
        // exchange to thresholds when online
       var tr = JSON.parse(thresh)

    var data = JSON.parse(radiationJSON)



    for ([key, value] of Object.entries(data)) {
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
            if(parseFloat(value["solarrad"])>tr[0].solarradMIN){
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
            if(parseFloat(value["brightness"])>tr[0].brightnessMIN){
                thres.brightness.down += 10
            }
        }
    }
    return thres;
}

function calcThresTher(){
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

    var data = JSON.parse(radiationJSON)

    for ([key, value] of Object.entries(data)) {
        // UV
        if(parseFloat(value["uv"])>3.0){
           thres.uv.up += 10
        }
        if(parseFloat(value["uv"])<3.0 && parseFloat(value["uv"])>1.8){
             thres.uv.mid += 10
        }
        if(parseFloat(value["uv"])<1.8){
            thres.uv.down += 10
        }

        //radiation
        if(parseFloat(value["solarrad"])>50.0){
           thres.radiation.up += 10
        }
        if(parseFloat(value["solarrad"])<50.0 && parseFloat(value["solarrad"])>30.0){
             thres.radiation.mid += 10
        }
        if(parseFloat(value["solarrad"])>30.0){
            thres.radiation.down += 10
        }

        // no thres for brightness
    }
    return thres;
}