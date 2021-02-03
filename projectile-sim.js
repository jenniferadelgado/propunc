
/* ----- Variables and Constants ------- */
const G = 9.8; // acceleration due to gravity
var theta = Math.PI/4; // the launch angle measured in radians
// TODO the slider for theta is labelled in degrees. Convert this value to rads oninput
var v0 = 10; // initial velocity

/* ------ Projectile Path Methods ------- */

/**
 * Calculates the vertical position of the projectile at a given horizontal position.
 * @param {number} x - The horizontal position of the projectile (meters)
 * @return {number} The vertical position of the projectile.
 */
function projectileHeight(x) {
    return ( Math.tan(theta)*x) - ( (G*x*x) / (2*v0*v0*Math.cos(theta)*Math.cos(theta)) );
}

/**
 * Calculates where the projectile will land given an initial velocity and launch angle.
 * @return {number} The landing distance of the projectile.
function landingDistance() {
    return v0*v0*Math.sin(2*theta)/G;
}

/**
 * Calculates the maximum horizontal distance the projectile can cover.
 * @return {number} The horizontal range of the projectile in meters.
 */
function horizontalRange() {
    return v0*v0/G;
}

/**
 * Calculates the maximum vertical distance the projectile can cover.
 * @return {number} The vertical range of the projectile in meters.
 */
function verticalRange() {
    return (v0*v0) / (2*G);
}

var numSteps = 100;
var stepSize = horizontalRange()/numSteps;
var xCoords = [];
var yCoords = [];
for (var i = 0; i <= numSteps; i++) {
    xCoords[i] = i*stepSize;
    yCoords[i] = projectileHeight(xCoords[i]);
}


/* -------------- Initial Graph Setup ---------------- */

var projectile = {
    x: xCoords,
    y: yCoords,
    mode: 'lines'
};

var data = [
    projectile
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
        range: [0, horizontalRange() + horizontalRange()/4],
        autorange: false
    },
    yaxis: {
        range: [0, verticalRange() + verticalRange()/4],
        autorange: false
    }
};

graph = document.getElementById('graph');
Plotly.newPlot(graph, data, layout);