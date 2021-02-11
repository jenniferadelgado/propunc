
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
function projectileHeight(x) {
    return ( Math.tan(theta)*x) - ( (G*x*x) / (2*v*v*Math.cos(theta)*Math.cos(theta)) );
}

/**
 * Calculates where the projectile will land given an initial velocity and launch angle.
 * @return {number} The landing distance of the projectile.
 */
function landingDistance() {
    return v*v*Math.sin(2*theta)/G;
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
    updateGraph();
}


/* ---------trace update functions--------- */

/**
 * Updates the path of the projectile.
 */
function updateProjectilePath() {
    stepSize = landingDistance()/numSteps;
    xCoords = [];
    yCoords = [];

    for (var i = 0; i <= numSteps; i++) {
        xCoords[i] = i*stepSize;
        yCoords[i] = projectileHeight(xCoords[i]);
    }

    projectile = {
        x: xCoords,
        y: yCoords,
        mode: 'lines'
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

    updateTarget();
    
    refreshGraph();
}

/**
 * Refreshes the data array and calls Plotly.react to make changes appear on graph.
 */
function refreshGraph() {
    data = [
        projectile,
        target
    ];


    Plotly.react(graph, data, layout);
}