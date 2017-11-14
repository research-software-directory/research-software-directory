function plot_commits(data) {
    var plotid = document.getElementById("commitsPlot");
    var layout = {
        autosize: true,
        margin: {l:20,r:20,b:20,t:20}
        }
    Plotly.newPlot(plotid, data, layout)
    }

var data = [{
    mode: 'lines',
    x: [1,2,3,4,5,6,7,8,9,10,11,12,13,14],
    y: [1,20,0,0,0,5,7,6,0,0,34,7,0,0],
    line: {shape: 'spline'},
    fill: 'tonexty'
    }];
plot_commits(data);
