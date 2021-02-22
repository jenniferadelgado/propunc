/* ----- Variables ------- */
var x = 5;
var xError = 1;
var m = 2;
var mError = 1;
var b = 2;
var bError = 1;

var numSteps = 100;
var stepSize = 20/numSteps;
var xCoords = [];
var yCoords = [];

/* ------ Projectile Path Methods ------- */

/**
 * Calculates y = mx^b
 * @param {number} x - the x coordinate to calculate from
 * @return {number} The y coordinate of the point.
 */
function powerLaw(x) {
    return m*Math.pow(x, b);
}

/**
 * Calculates the error on y from variable m
 * @return {number}
 */
function errorFromM() {
    let partial = Math.pow(x, b);
    return Math.abs(partial*mError);
}

/**
 * Calculates the error on y from x.
 * @return {number}
 */
function errorFromX() {
    let partial = b*m*Math.pow(x, b-1);
    return Math.abs(partial*xError);
}

/**
 * Calculates the error on y from variable b.
 * @return {number}
 */
function errorFromB() {
    let partial = m*Math.pow(x, b)*Math.log(x);
    return Math.abs(partial*bError);
}

/**
 * Calculates the total error on y.
 * @return {number}
 */
function totalError() {
    let del_x = errorFromX();
    let del_m = errorFromM();
    let del_b = errorFromB();
    return Math.sqrt(del_x*del_x + del_m*del_m + del_b*del_b);
}


/* -------------- Initial Graph Setup ---------------- */

var trace0;
updateTrace0();

var trace1;
updateTrace1();

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
    }
};

graph = document.getElementById('graph');
Plotly.newPlot(graph, data, layout);

/* ------------Update Graph On Input-------------- */


/* ---------oninput functions---------- */

var xSlider = document.getElementById('xSlider');
xSlider.oninput = function() {
    x = 20*(xSlider.value/100) - 10;

    updateTrace1();
    refreshGraph();
}

var xErrorSlider = document.getElementById('xErrorSlider');
xErrorSlider.oninput = function() {
    xError = 2*(xErrorSlider.value/100);

    updateTrace1();
    refreshGraph();
}

var mSlider = document.getElementById('mSlider');
mSlider.oninput = function() {
    m = 4*(mSlider.value/100);

    updateTrace0();
    updateTrace1();
    refreshGraph();
}

var mErrorSlider = document.getElementById('mErrorSlider');
mErrorSlider.oninput = function() {
    mError = 2*(mErrorSlider.value/100);

    updateTrace1();
    refreshGraph();
}

var bSlider = document.getElementById('bSlider');
bSlider.oninput = function() {
    b = 4*(bSlider.value/100);

    updateTrace0();
    updateTrace1();
    refreshGraph();
}

var bErrorSlider = document.getElementById('bErrorSlider');
bErrorSlider.oninput = function() {
    bError = 2*(bErrorSlider.value/100);

    updateTrace1();
    refreshGraph();
}

/* ---------trace update functions--------- */

function updateTrace0() {
    xCoords = [];
    yCoords = [];

    for (let i = 0; i <= numSteps; i++) {
        xCoords[i] = i*stepSize - 10;
        yCoords[i] = powerLaw(xCoords[i]);
    }

    trace0 = {
        x: xCoords,
        y: yCoords,
        mode: 'lines'
    };
}

function updateTrace1() {
    trace1 = {
        x: [x],
        y: [powerLaw(x)],
        mode: 'scatter',
        error_y: {
            type: 'constant',
            value: totalError()
        }
    }
}

function refreshGraph() {
    data = [
        trace0,
        trace1
    ];

    Plotly.react(graph, data, layout);
}