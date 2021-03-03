
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

/* -------------Initial Graph Setup------------ */

var trace0 = {
    x: xCoords,
    y: yCoords,
    mode: 'lines'
};

var sliderValue = 50;
var errX = 1;
var errY = yError3rdOrder(xCoords[sliderValue], errX);
var horizontalErrorBarVisible = false;
var trace1;
updateTrace1();

var errorBoundsVisible = true;
var upperBound, lowerBound, leftBound, rightBound;
updateErrorBounds();

var data = [
    trace0,
    trace1,
    upperBound,
    lowerBound,
    leftBound,
    rightBound
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

var xSlider = document.getElementById('xSlider');
xSlider.oninput = function() {
    sliderValue = xSlider.value;
    updateGraph();
}

var xErrorMax = 2;
var errorSlider = document.getElementById('errorSlider');
errorSlider.oninput = function() {
    errX = xErrorMax*(errorSlider.value/100);
    document.getElementById('errorValue').innerHTML = "<u>Change the uncertainty on x.</u> Current value: " + errX.toFixed(2);
    updateGraph();
}

var horizErrBar = document.getElementById('xError');
horizErrBar.oninput = function() {
    horizontalErrorBarVisible = horizErrBar.checked;

    updateTrace1();

    refreshGraph();
}

var errBound = document.getElementById('errorBox');
errBound.oninput = function() {
    errorBoundsVisible = errBound.checked;

    updateErrorBounds();

    refreshGraph();
}

/**
 * Updates trace1 to reflect changes in stored variables.
 * @post Note that refreshGraph() must be called for changes to appear on graph.
 */
function updateTrace1() {
    trace1 = {
        x: [xCoords[sliderValue]],
        y: [yCoords[sliderValue]],
        error_y: {
            type: 'constant',
            value: errY
        },
        error_x: {
            type: 'constant',
            value: errX,
            visible: horizontalErrorBarVisible
        },
        type: 'scatter'
    };
}

/**
 * Updates the traces associated with the error bounds to reflect changes in stored variables.
 * @post Note that refreshGraph() must be called for changes to appear on graph.
 */
function updateErrorBounds() {
    upperBound = {
        x: [0,10],
        y: [yCoords[sliderValue]+errY, yCoords[sliderValue]+errY],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(255, 0, 0)'
        },
        visible: errorBoundsVisible
    }

    lowerBound = {
        x: [0,10],
        y: [yCoords[sliderValue]-errY, yCoords[sliderValue]-errY],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(255, 0, 0)'
        },
        visible: errorBoundsVisible
    }

    leftBound = {
        x: [xCoords[sliderValue]-errX, xCoords[sliderValue]-errX],
        y: [0,10],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(255, 0, 0)'
        },
        visible: errorBoundsVisible
    }

    rightBound = {
        x: [xCoords[sliderValue]+errX, xCoords[sliderValue]+errX],
        y: [0,10],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(255, 0, 0)'
        },
        visible: errorBoundsVisible
    }
}

/**
 * Updates all elements on the graph to reflect changes caused by user input.
 */
function updateGraph() {
    errY = yError3rdOrder(xCoords[sliderValue], errX);

    updateTrace1();

    updateErrorBounds();

    refreshGraph();
}

/**
 * Refreshes the data array and calls Plotly.react to make changes appear on graph.
 */
function refreshGraph() {
    data = [
        trace0,
        trace1,
        upperBound,
        lowerBound,
        leftBound,
        rightBound
    ];

    Plotly.react(graph, data, layout);
}