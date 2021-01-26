
/**
 * Returns the output of a certain third order polynomial.
 * @param {number} x
 * @return {number} The output of the function.
*/
function calculate3rdOrder(x) {
    // function y = 0.0417x^3 - 0.635x^2 + 3.1829x - 0.0053
    return (0.0417*x*x*x) - (0.635*x*x) + (3.1829*x) - 0.0053;
}

/**
 * Calculates the error on y at a given location x.
 * Propagates uncertainty using same polynomial as calculate3rdOrder().
 * @param {number} x
 * @param {number} xError - the uncertainty on x
 * @return {number} The uncertainty on y.
*/
function yError3rdOrder(x, xError) {
    // Partial with respect to x:
    // 0.1251x^2 - 1.27x + 3.1829
    let partial = (0.1251*x*x) - (1.27*x) + 3.1829;
    return Math.abs(partial*xError);
}

numSteps = 100;
// Range from 0 to 10
stepSize = 10/numSteps;
xCoords = [];
yCoords = [];
for (var i = 0; i<=numSteps; i++) {
    xCoords[i] = i*stepSize;
    yCoords[i] = calculate3rdOrder(xCoords[i]);
}

/* -------------Graph Setup------------ */

var trace0 = {
    x: xCoords,
    y: yCoords
};

var sliderValue = 90; // Hypothetical value gotten from the slider controlling where x is on the graph.
var errX = 1; // Hypothetical value gotten from a slider controlling the uncertainty on x.
var errY = yError3rdOrder(xCoords[sliderValue], errX);
var trace1 = {
    x: [xCoords[sliderValue]],
    y: [yCoords[sliderValue]],
    error_y: {
        type: 'constant',
        value: errY
    },
    type: 'scatter'
};

var data = [
    trace0,
    trace1
];

var layout = {
    margin: { t: 0 }
}; 

graph = document.getElementById('graph');
Plotly.react(graph, data, layout);