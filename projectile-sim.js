
/* ----- Variables and Constants ------- */
const G = 9.8; // acceleration due to gravity
var theta = Math.PI/4; // the launch angle measured in radians
var thetaError = Math.PI/8;
var v = 10; // initial velocity
var vError = 5;

var numSteps = 100;
var stepSize;
var xCoords = [];
var yCoords = [];

/* ------ Projectile Path Methods ------- */

/**
 * Calculates the vertical position of the projectile at a given horizontal position.
 * @param {number} x - The horizontal position of the projectile (meters)
 * @return {number} The vertical position of the projectile.
 */
function projectileHeight(x, theta0, v0) {
    return ( Math.tan(theta0)*x) - ( (G*x*x) / (2*v0*v0*Math.cos(theta0)*Math.cos(theta0)) );
}

/**
 * Calculates where the projectile will land given an initial velocity and launch angle.
 * @return {number} The landing distance of the projectile.
 */
function landingDistance(theta0, v0) {
    return v0*v0*Math.sin(2*theta0)/G;
}

/**
 * Calculates the maximum horizontal distance the projectile can cover.
 * @return {number} The horizontal range of the projectile in meters.
 */
function horizontalRange() {
    return v*v/G;
}

/**
 * Calculates the maximum vertical distance the projectile can cover.
 * @return {number} The vertical range of the projectile in meters.
 */
function verticalRange() {
    return (v*v)/(2*G);
}

/**
 * Calculates the error on the landing position due to uncertainty on initial velocity.
 * @return {number}
 */
function errorFromVelocity() {
    let partial = 2*v*Math.sin(2*theta)/G;
    return Math.abs(partial*vError);
}

/**
 * Calculates the error on the landing position due to uncertainty on the launch angle.
 * @return {number}
 */
function errorFromAngle() {
    let partial = 2*v*v*Math.cos(2*theta)/G;
    return Math.abs(partial*thetaError);
}

/**
 * Calculates the total uncertainty on the landing position.
 * @return {number} the total error on x.
 */
function totalError() {
    let delX_v = errorFromVelocity();
    let delX_theta = errorFromAngle();
    return Math.sqrt( (delX_v*delX_v) + (delX_theta*delX_theta) );
}


/* -------------- Initial Graph Setup ---------------- */

var projectile;
updateProjectilePath();

var target;
updateTarget();

var upperBound, lowerBound;
updateErrorBounds();

var vErrorUpperBound, vErrorLowerBound;
updateVelocityErrorBounds();

var data = [
    projectile,
    target
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
        range: [-10, 50],
        autorange: false
    },
    yaxis: {
        range: [0, 25],
        autorange: false
    }
};

graph = document.getElementById('graph');
Plotly.newPlot(graph, data, layout);

/* ------------Update Graph On Input-------------- */


/* ---------oninput functions---------- */

var velocityMax = 20;
var velocitySlider = document.getElementById('velocitySlider');
velocitySlider.oninput = function() {
    v = velocityMax*(velocitySlider.value/100);
    updateGraph();
}

var velocityErrorMax = 10;
var velocityErrorSlider = document.getElementById('velocityErrorSlider');
velocityErrorSlider.oninput = function() {
    vError = velocityErrorMax*(velocityErrorSlider.value/100);
    document.getElementById('velocityErrorValue').innerHTML = "<b>Change the uncertainty on the launch velocity</b> Current value: " + vError.toFixed(2);
    updateGraph();
}

var angleMax = Math.PI/2;
var angleSlider = document.getElementById('angleSlider');
angleSlider.oninput = function() {
    theta = angleMax*(angleSlider.value/100);
    updateGraph();
}

var angleErrorMax = Math.PI/4;
var angleErrorSlider = document.getElementById('angleErrorSlider');
angleErrorSlider.oninput = function() {
    thetaError = angleErrorMax*(angleErrorSlider.value/100);
    document.getElementById('angleErrorValue').innerHTML = "<b>Change the uncertainty in the launch angle</b> Current value: " + thetaError.toFixed(2);
    updateGraph();
}


/* ---------trace update functions--------- */

/**
 * Updates the path of the projectile.
 */
function updateProjectilePath() {
    stepSize = landingDistance(theta, v)/numSteps;
    xCoords = [];
    yCoords = [];

    for (var i = 0; i <= numSteps; i++) {
        xCoords[i] = i*stepSize;
        yCoords[i] = projectileHeight(xCoords[i], theta, v);
    }

    projectile = {
        x: xCoords,
        y: yCoords,
        mode: 'lines'
    };
}

function updateErrorBounds() {
    // Problem might be that I'm calculating an error on x, but trying to apply it in a calculation of projectile height...
    let verr = errorFromVelocity();
    let terr = errorFromAngle();
    let stepSizeUpper = landingDistance(theta+terr, v+verr)/numSteps;
    let stepSizeLower = landingDistance(theta-terr, v-verr)/numSteps;
    let xCoords_upper = [];
    let yCoords_upper = [];
    let xCoords_lower = [];
    let yCoords_lower = [];
    
    for (var i = 0; i <= numSteps; i++) {
        xCoords_upper[i] = i*stepSizeUpper;
        yCoords_upper[i] = projectileHeight(xCoords_upper[i], theta+terr, v+verr);
        xCoords_lower[i] = i*stepSizeLower;
        yCoords_lower[i] = projectileHeight(xCoords_lower[i], theta-terr, v+verr);
    }

    upperBound = {
        x: xCoords_upper,
        y: yCoords_upper,
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(255, 0, 0)'
        }
    };
    lowerBound = {
        x: xCoords_lower,
        y: yCoords_lower,
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(255, 0, 0)'
        }
    };
}

function updateVelocityErrorBounds() {
    let err = errorFromVelocity();
    let stepSizeUpper = landingDistance(theta, v+err)/numSteps;
    let stepSizeLower = landingDistance(theta, v-err)/numSteps;
    let xCoords_upper = [];
    let yCoords_upper = [];
    let xCoords_lower = [];
    let yCoords_lower = [];
    
    for (var i = 0; i <= numSteps; i++) {
        xCoords_upper[i] = i*stepSizeUpper;
        yCoords_upper[i] = projectileHeight(xCoords_upper[i], theta, v+err);
        xCoords_lower[i] = i*stepSizeLower;
        yCoords_lower[i] = projectileHeight(xCoords_lower[i], theta, v-err);
    }

    vErrorUpperBound = {
        x: xCoords_upper,
        y: yCoords_upper,
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(0, 153, 51)'
        }
    };
    vErrorLowerBound = {
        x: xCoords_lower,
        y: yCoords_lower,
        mode: 'lines',
        line: {
            dash: 'dot',
            width: 2,
            color: 'rgb(0, 153, 51)'
        }
    };
}

/**
 * Updates the landing target for the projectile.
 */
function updateTarget() {
    target = {
        x: [xCoords[100]],
        y: [yCoords[100]],
        error_x: {
            type: 'constant',
            value: totalError(),
            thickness: 6,
            width: 8,
            color: 'red'
        }
    };
}

/**
 * Updates all elements on the graph to reflect changes caused by user input.
 */
function updateGraph() {
    
    updateProjectilePath();

    updateErrorBounds();
    
    updateVelocityErrorBounds();

    updateTarget();
    
    refreshGraph();
}

/**
 * Refreshes the data array and calls Plotly.react to make changes appear on graph.
 */
function refreshGraph() {
    data = [
        projectile,
        target,
        upperBound,
        lowerBound,
        vErrorUpperBound,
        vErrorLowerBound
    ];


    Plotly.react(graph, data, layout);
}