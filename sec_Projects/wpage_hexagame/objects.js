function Objects(gl) {

    addHexGrid();

    for (var property in objects_data) {
        if (objects_data.hasOwnProperty(property)) {
            this[property] = new Obj(gl, objects_data[property]);
            console.log("done loding statik object: "+property+" with data lenght: "+this[property].length);
        }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return this;
}

objects_data = {
    sprite: [
		1.0, 1.0,       1.0, 1.0,
		-1.0, 1.0,      0.0, 1.0,
		1.0, -1.0,      1.0, 0.0,
		-1.0, -1.0,     0.0, 0.0
    ],
    square: [
		1.0, 1.0,
		-1.0, 1.0,
		1.0, -1.0,
		-1.0, -1.0
    ],
    hex: [
        0.0, 0.0,
        1.0, 0.0,
        0.5, 0.866,

        0.0, 0.0,
        0.5, 0.866,
        -0.5, 0.866,

        0.0, 0.0,
        -0.5, 0.866,
        -1.0, 0.0,

        0.0, 0.0,
        -0.5, -0.866,
        -1.0, 0.0,

        0.0, 0.0,
        0.5, -0.866,
        -0.5, -0.866,

        0.0, 0.0,
        1.0, 0.0,
        0.5, -0.866,
    ],
    arrow: [
        0.5, 0.25, 
        -0.8660254, 0.25, 
        -0.8660254, -0.25,

        -0.8660254, -0.25, 
        0.5, -0.25, 
        0.5, 0.25,

        0.5, -0.4330127, 
        1, 0, 
        0.5, 0.4330127
    ]
}

function Obj(gl, data) {
    this.buffer = gl.createBuffer();
    this.length = data.length;
	gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	return this;
}

function addHexGrid() {
    var hex_data = [];
	hex_pos.push(0, 0);
	hex_col.push(1.0, 1.0, 0.0, 1.0);
	hex_data.push(0, 0, 1, 1);
	function hextocart(alpha, beta) {
		var i = Math.floor(beta/alpha);
		var j = beta%alpha;
		var x = alpha*1.5;
		var y = Math.sqrt(3) - alpha*Math.sqrt(3)/2 + Math.sqrt(3)*j;
		var Phi = i*Math.PI/3;
		var Sin = Math.sin(Phi), Cos = Math.cos(Phi);
		return [Cos*x-Sin*y, Sin*x+Cos*y];
	}
	for (var alpha = 1; alpha < alpha_max; alpha++) {
		for (var beta = 0; beta < 6*alpha; beta++) {
			xy = hextocart(alpha, beta);
			hex_pos.push(xy[0], xy[1]);
			hex_col.push(alpha/7, beta/(6*alpha), 0.0, 1.0);
			hex_data.push(xy[0], xy[1], alpha/alpha_max, beta/(6*alpha));
		} 
	}
	objects_data.hex_grid = hex_data;
}