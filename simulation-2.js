
/**
 * Calculates the error on y due to uncertainty on the slope.
 * @param {number} x - the value of x.
 * @param {number} mError - the uncertainty on the slope.
 * @return {number} The uncertainty on y from the slope.
 */
function errorFromSlope(x, mError) {
    return Math.abs(x*mError);
}

/**
 * Calculates the error on y due to uncertainty on x.
 * @param {number} m - the value of the slope.
 * @param {number} xError - the uncertainty on x.
 * @return {number} The uncertainty on y from x.
 */
function errorFromX(m, xError) {
    return Math.abs(m*xError);
}

/**
 * Calculates the total error on y by propagation through the equation y=mx.
 * @param {number} x - the value of x.
 * @param {number} m - the value of the slope.
 * @param {number} xError - the uncertainty on x.
 * @param {number} mError - the uncertainty on the slope.
 * @return {number} The total uncertainty on y.
 */
function totalError(x, m, xError, mError) {
    let yError_x = errorFromX(m, xError);
    let yError_m = errorFromSlope(x, mError);
    return Math.sqrt(yError_x*yError_x + yError_m*yError_m);
}

/* ----------------Initial Graph Setup---------------- */

var m = 1; // variable for slope

var trace0 = { // The function being examined
    x: [0, 10],
    y: [0, m*10],
    mode: 'lines'
};

var xSliderValue = 5; // Position of the point, as set by the corresponding slider.
var errX = 1; // The uncertainty on x, as set by the corresponding slider.
var errM = .5; // The uncertainty on the slope, as set by the corresponding slider.
var errY = totalError(xSliderValue, m, errX, errM);
var trace1 = { // The movable point
    x: [xSliderValue],
    y: [m*xSliderValue],
    error_y: {
        type: 'constant',
        value: errY
    }
};

var data = [
    trace0,
    trace1
];

var layout = {
    showlegend: false,
    margin: {
        l: 20,
        r: 20,
        t: 20,
        b: 20
    },
    xaxis: {
        range: [0, 10],
        autorange: false
    },
    yaxis: {
        range: [0, 10],
        autorange: false
    }
};

graph = document.getElementById('graph');
Plotly.newPlot(graph, data, layout, {staticPlot: true});