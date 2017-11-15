function plot_commits(data) {
    var plotid = document.getElementById("commitsPlot");
    var layout = {
        autosize: true,
        margin: {l:20,r:50,b:40,t:20},
        xaxis: {
            type: 'date',
            autotick: false,
            ticks: 'outside',
            tick0: '2000-01-15',
            dtick: 'M12',
            tickformat: "%Y"
            },
		paper_bgcolor: "rgba(0,0,0,0)",
		plot_bgcolor: "rgba(0,0,0,0)"
        };
    Plotly.newPlot(plotid, data, layout, {displayModeBar: false, staticPlot: true});
    var update = {
        "marker.color": "rgb(100,100,100)"
        };
    Plotly.restyle(plotid, update);
    }


var statid = document.getElementById("commitsStat");
if ('error' in commitsData) {
    statid.innerHTML = commitsData['error'];
    }
else {
    plot_commits(commitsData['plot']);
    statid.innerHTML = '<b>' + commitsData['total'] + '</b> commits | Last update: <b>' + commitsData['last'] + '</b>';
    }
