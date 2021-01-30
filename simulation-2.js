
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

var trace0;
updateTrace0();

var xSliderValue = 5; // Position of the point, as set by the corresponding slider.
var errX = 1; // The uncertainty on x, as set by the corresponding slider.
var errM = .5; // The uncertainty on the slope, as set by the corresponding slider.
var errY = totalError(xSliderValue, m, errX, errM);
var xErrorBarsVisible = false;
var trace1;
updateTrace1();

var mErrorLinesVisible = false;
var slopeUpperBound, slopeLowerBound;
updateSlopeErrorLines();

var yErrorLinesVisible = false;
var yUpperBound, yLowerBound;
updateYErrorLines();

var data = [
    trace0,
    trace1,
    slopeUpperBound,
    slopeLowerBound,
    yUpperBound,
    yLowerBound
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

/* ------------Update Graph On Input-------------- */


/* ---------oninput functions----------*/

var xSlider = document.getElementById('xSlider');
xSlider.oninput = function() {
    xSliderValue = xSlider.value/10;
    updateGraph();
}

var xErrorMax = 2;
var xErrorSlider = document.getElementById('xErrorSlider');
xErrorSlider.oninput = function() {
    errX = xErrorMax*(xErrorSlider.value/100);
    updateGraph();
}

var slopeMax = 3;
var slopeSlider = document.getElementById('mSlider');
slopeSlider.oninput = function() {
    m = slopeMax*(slopeSlider.value/100);
    updateGraph();
}

var slopeErrorMax = 1;
var mErrorSlider = document.getElementById('mErrorSlider');
mErrorSlider.oninput = function() {
    errM = slopeErrorMax*(mErrorSlider.value/100);
    updateGraph();
}

var xErrorBars = document.getElementById('xErrorBars');
xErrorBars.oninput = function() {
    xErrorBarsVisible = xErrorBars.checked;
    updateGraph();
}

var mErrorLines = document.getElementById('mErrorLines');
mErrorLines.oninput = function() {
    mErrorLinesVisible = mErrorLines.checked;
    updateGraph();
}

var yErrorLines = document.getElementById('yErrorLines');
yErrorLines.oninput = function() {
    yErrorLinesVisible = yErrorLines.checked;
    updateGraph();
}


/* ---------trace update functions--------- */

/**
 * Updates trace0 to reflect changes in stored variables.
 * Note that refreshGraph() must be called for changes to appear on graph.
 */
function updateTrace0() {
    trace0 = {
        x: [0, 10],
        y: [0, m*10],
        mode: 'lines'
    };
}

/**
 * Updates trace1 to reflect changes in stored variables.
 * @post Note that refreshGraph() must be called for changes to appear on graph.
 */
function updateTrace1() {
    trace1 = {
        x: [xSliderValue],
        y: [m*xSliderValue],
        error_y: {
            type: 'constant',
            value: errY
        },
        error_x: {
            type: 'constant',
            value: errX,
            visible: xErrorBarsVisible
        },
        type: 'scatter'
    };
}

/**
 * Updates the slope error line traces to reflect changes in stored variables.
 * @post Note that refreshGraph() must be called for changes to appear on graph.
 */
function updateSlopeErrorLines() {
    slopeUpperBound = {
        x: [0, 10],
        y: [0, (m+errM)*10],
        mode: 'lines',
        visible: mErrorLinesVisible
    };

    slopeLowerBound = {
        x: [0, 10],
        y: [0, (m-errM)*10],
        mode: 'lines',
        visible: mErrorLinesVisible
    };
}

function updateYErrorLines() {
    yUpperBound = {
        x: [0, 10],
        y: [m*xSliderValue + errY, m*xSliderValue + errY],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2
        },
        visible: yErrorLinesVisible
    };

    yLowerBound = {
        x: [0, 10],
        y: [m*xSliderValue - errY, m*xSliderValue - errY],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2
        },
        visible: yErrorLinesVisible
    }
}

/**
 * Updates all elements on the graph to reflect changes caused by user input.
 */
function updateGraph() {

    updateTrace0();

    errY = totalError(xSliderValue, m, errX, errM);
    updateTrace1();

    updateSlopeErrorLines();

    updateYErrorLines();
    
    refreshGraph();
}

/**
 * Refreshes the data array and calls Plotly.react to make changes appear on graph.
 */
function refreshGraph() {
    data = [
        trace0,
        trace1,
        slopeUpperBound,
        slopeLowerBound,
        yUpperBound,
        yLowerBound
    ];

    Plotly.react(graph, data, layout);
}