
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
var trace1 = {
    x: [xCoords[sliderValue]],
    y: [yCoords[sliderValue]],
    error_y: {
        type: 'constant',
        value: errY
    },
    error_x: {
        type: 'constant',
        value: errX
    },
    type: 'scatter'
};

var upperBound = {
    x: [0,10],
    y: [yCoords[sliderValue]+errY, yCoords[sliderValue]+errY],
    mode: 'lines',
    line: {
        dash: 'dot',
        width: 2
    }
};

var lowerBound = {
    x: [0,10],
    y: [yCoords[sliderValue]-errY, yCoords[sliderValue]-errY],
    mode: 'lines',
    line: {
        dash: 'dot',
        width: 2
    }
}

var leftBound = {
    x: [xCoords[sliderValue]-errX, xCoords[sliderValue]-errX],
    y: [0,10],
    mode: 'lines',
    line: {
        dash: 'dot',
        width: 2
    }
}

var rightBound = {
    x: [xCoords[sliderValue]+errX, xCoords[sliderValue]+errX],
    y: [0,10],
    mode: 'lines',
    line: {
        dash: 'dot',
        width: 2
    }
}

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

var errorSlider = document.getElementById('errorSlider');
errorSlider.oninput = function() {
    errX = 2*(errorSlider.value/100);
    updateGraph();
}

var horizErrBar = document.getElementById('xError');
horizErrBar.oninput = function() {
    console.log(horizErrBar.checked);
}

/**
 * Updates the graph to immediately reflect changes caused by user input.
*/
function updateGraph() {
    errY = yError3rdOrder(xCoords[sliderValue], errX);
    trace1 = {
        x: [xCoords[sliderValue]],
        y: [yCoords[sliderValue]],
        error_y: {
            type: 'constant',
            value: errY
        },
        error_x: {
            type: 'constant',
            value: errX
        },
        type: 'scatter'
    };

    upperBound = {
        x: [0,10],
        y: [yCoords[sliderValue]+errY, yCoords[sliderValue]+errY],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2
        }
    }

    lowerBound = {
        x: [0,10],
        y: [yCoords[sliderValue]-errY, yCoords[sliderValue]-errY],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2
        }
    }

    leftBound = {
        x: [xCoords[sliderValue]-errX, xCoords[sliderValue]-errX],
        y: [0,10],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2
        }
    }

    rightBound = {
        x: [xCoords[sliderValue]+errX, xCoords[sliderValue]+errX],
        y: [0,10],
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2
        }
    }

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