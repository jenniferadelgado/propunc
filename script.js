
numSteps = 100;
// Range from 0 to 10
stepSize = 10/numSteps;
xCoords = [];
yCoords = [];
for (var i = 0; i<=numSteps; i++) {
    xCoords[i] = i*stepSize;
    let x = xCoords[i];
    yCoords[i] = (0.0417*x*x*x) - (0.635*x*x) + (3.1829*x) - 0.0053; // function y = 0.0417x^3 - 0.635x^2 + 3.1829x - 0.0053
}

/* Graph Setup */

var data = [{
    x: xCoords,
    y: yCoords
}];

var layout = {
    margin: { t: 0 }
}; 

graph = document.getElementById('graph');
Plotly.newPlot(graph, data, layout);