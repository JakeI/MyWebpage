function isElementInViewport(el) {
    const fraction = 0.3;

    var rect = el.getBoundingClientRect();
    var w = rect.right - rect.left;
    var h = rect.bottom - rect.top;
    var W = Math.min(rect.right, window.innerWidth || document.documentElement.clientWidth) - Math.max(rect.left, 0);
    var H = Math.min(rect.bottom, window.innerHeight || document.documentElement.clientHeight) - Math.max(rect.top, 0);

    return H*W/(w*h) > fraction;
}

var hidden;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
	hidden = "hidden";
} else if (typeof document.msHidden !== "undefined") {
	hidden = "msHidden";
} else if (typeof document.webkitHidden !== "undefined") {
	hidden = "webkitHidden";
}

function initWebGL(canvas) {
	GL = null;
	GL = canvas.getContext("webgl2");
	if (!GL) alert("Unable to inti WebGL2");
	return GL;
}

var canvas;
var gl;
var objects;
var shaders;
var atlases;

var world = {camera: {res: [1, 1], world_translation: [0.0, 0.0], world_scale: 0.05}};
var hex_pos = [], hex_col = [], hex_buffer = null;
var alpha_max = 10;


function start() {
	canvas = document.getElementById("myCanvas");
	gl = initWebGL(canvas);
	if(!gl) return;
	world.camera.res = [canvas.width, canvas.height];

	shaders = new Shaders(gl);
	objects = new Objects(gl);
	atlases = new Atlases(gl);

	// increment(0)

	lastUpdate = new Date();
	//setInterval(update, 10);
	requestAnimationFrame(update);
}

var lastUpdate;
var updating = false;

function update() {
	if(updating) return;
	if(!isElementInViewport(canvas)) return;
	if(document[hidden]) return;
	updating = true;

	world.camera.res = [canvas.width, canvas.height];

	render();

	var now = new Date();
	var dt = (now-lastUpdate)/1000.0;
	
	// increment

	lastUpdate = now;
	updating = false;
}

function render() {
	gl.viewport(0, 0, world.camera.res[0], world.camera.res[1]);
	gl.clearColor(0.1, 0.1, 0.9, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Background
	gl.useProgram(shaders.std.shader);
	gl.enableVertexAttribArray(shaders.std.pos);

	uniform(gl, shaders.std, world.camera);
	uniform(gl, shaders.std, {rotation: Math.PI/6, 
		scale: 2*Math.floor(alpha_max/2) + Math.floor((alpha_max+1)/2) + 1.0, 
		translation:[0.0, 0.0], color:[0.0, 0.0, 1.0, 0.5]});

	renderStd(objects.hex, gl.TRIANGLE_STRIP);
	
	gl.disableVertexAttribArray(shaders.std.pos);

	// Hex-grid
	gl.useProgram(shaders.std_instanced.shader);
	enableVertexAttribArray(gl, shaders.std_instanced, ["trans", "idcol", "pos"]);

	uniform(gl, shaders.std_instanced, world.camera);
	uniform(gl, shaders.std_instanced, {rotation: 0.0, scale: 0.9, 
		translation: [0.0, 0.0], color: [0.0, 0.0, 0.0, 1.0]});

	renderStdInstanced(objects.hex, objects.hex_grid, gl.TRIANGLE_STRIP);

	disableVertexAttribArray(gl, shaders.std_instanced, ["trans", "idcol", "pos"]);
	
	gl.useProgram(shaders.textured.shader);
	enableVertexAttribArray(gl, shaders.textured, ["pos", "uv"]);

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	uniform(gl, shaders.textured, world.camera);
	uniform(gl, shaders.textured, {rotation: 0.0, scale: 12.0, translation: [0.0, 0.0]});

	gl.bindBuffer(gl.ARRAY_BUFFER, objects.sprite.buffer);
	gl.vertexAttribPointer(shaders.textured.pos, 2, gl.FLOAT, false, 16, 0);
	gl.vertexAttribPointer(shaders.textured.uv, 2, gl.FLOAT, false, 16, 8);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, atlases.static.texture.texture);
	gl.uniform1i(shaders.textured.sampler, 0);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, objects.sprite.length/4);

	disableVertexAttribArray(gl, shaders.textured, ["pos", "uv"]);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.useProgram(null);
}
