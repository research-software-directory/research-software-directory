function plot_commits(data) {
    var plotid = document.getElementById("commitsPlot");
    var layout = {
        autosize: true,
        margin: {l:20,r:50,b:50,t:20},
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
        }
    Plotly.newPlot(plotid, data, layout, {displayModeBar: false, staticPlot: true})
    }

plot_commits(commitsData);
