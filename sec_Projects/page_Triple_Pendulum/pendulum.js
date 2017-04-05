var std_vs_text = `
attribute vec2 pos;

uniform vec2 o;
uniform float l;
uniform float phi;

uniform vec4 c;

varying lowp vec4 C;

void main() {

	C = c;

	float Cos = cos(phi);
	float Sin = sin(phi);
	vec2 pp = vec2(Cos*pos.x - Sin*pos.y, Sin*pos.x + Cos*pos.y);

	gl_Position = vec4( l*pp + o, 0.0, 1.0);
	gl_PointSize = 2.0;
}
`

var std_fs_text = `
varying lowp vec4 C;

void main() {
	gl_FragColor = C;
}
`

var gl;
var width, hight; // w, h of output consol
var stdShader, stdPos, stdO, stdL, stdPhi, stdC;
var square, pendulum, arrow;


function initWebGL(canvas) {
	GL = null;
	GL = canvas.getContext("experimental-webgl");
	if (!GL) alert("Unable to inti webgl (nighter std nor experimatal versions)");
	return GL;
}

function getShader(gl, text, type_str) {
	var type = 0;
	if(type_str == "fs")
		type = gl.FRAGMENT_SHADER;
	else if(type_str == "vs")
		type = gl.VERTEX_SHADER;
	else {
		alert("sorry the shader type : '" + type + "' is unknown");
		return null;
	}
	var shader = gl.createShader(type);
	gl.shaderSource(shader, text);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("Shader ('" + type_str + "') couldn't be compiled\nInfo Log:\n\n"
				+ gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}

function initShader(vertex, fragment){
	var vertexShader = getShader(gl, std_vs_text, "vs");
	var fragementShader = getShader(gl, std_fs_text, "fs");
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragementShader);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program, gl.LINK_STATUS))
		alert("unable to initialise shaders { '" + vertex +
			"', '" + fragment + "' }.\nInfoLog:\n\n" + gl.getProgramInfoLog(program));
	return program;
}

function intiAllShaders() {
	stdShader = initShader("std-vs", "std-fs");
	gl.useProgram(stdShader);
		stdPos = gl.getAttribLocation(stdShader, "pos");
		stdO = gl.getUniformLocation(stdShader, "o");
		stdL = gl.getUniformLocation(stdShader, "l");
		stdPhi = gl.getUniformLocation(stdShader, "phi");
		stdC = gl.getUniformLocation(stdShader, "c");
	gl.useProgram(null);
}

function initStaticBuffer(data){
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	return {buffer:buffer, length:data.length};
}

function initPointBuffer(){
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	const capacity = 2000;
	gl.bufferData(gl.ARRAY_BUFFER, capacity*4, gl.DYNAMIC_DRAW);
	return {buffer:buffer, length:0, capacity:capacity, data:[]}
}

function initAllBuffers() {

	pendulum = initStaticBuffer([
		0.0, -0.04, 1.0, 0.04, 0.0, 0.04,0.0, -0.04,1.0, -0.04, 1.0, 0.04,
		1.0, 0.0, 1.1, 0.0, 1.0923879532511287, 0.03826834323650898,
		1.0, 0.0, 1.0923879532511287, 0.03826834323650898, 1.0707106781186548, 0.07071067811865477,
		1.0, 0.0, 1.0707106781186548, 0.07071067811865477, 1.038268343236509, 0.09238795325112868,
		1.0, 0.0, 1.038268343236509, 0.09238795325112868, 1.0, 0.1,
		1.0, 0.0, 1.0, 0.1, 0.961731656763491, 0.09238795325112868,
		1.0, 0.0, 0.961731656763491, 0.09238795325112868, 0.9292893218813453, 0.07071067811865477,
		1.0, 0.0, 0.9292893218813453, 0.07071067811865477, 0.9076120467488713, 0.03826834323650899,
		1.0, 0.0, 0.9076120467488713, 0.03826834323650899, 0.9, 1.2246467991473533e-17,
		1.0, 0.0, 0.9, 1.2246467991473533e-17, 0.9076120467488713, -0.03826834323650897,
		1.0, 0.0, 0.9076120467488713, -0.03826834323650897, 0.9292893218813453, -0.07071067811865475,
		1.0, 0.0, 0.9292893218813453, -0.07071067811865475, 0.9617316567634909, -0.09238795325112865,
		1.0, 0.0, 0.9617316567634909, -0.09238795325112865, 1.0, -0.1,
		1.0, 0.0, 1.0, -0.1, 1.038268343236509, -0.09238795325112867,
		1.0, 0.0, 1.038268343236509, -0.09238795325112867, 1.0707106781186548, -0.07071067811865477,
		1.0, 0.0, 1.0707106781186548, -0.07071067811865477, 1.0923879532511287, -0.038268343236509045,
		1.0, 0.0, 1.0923879532511287, -0.038268343236509045, 1.1, -2.4492935982947065e-17,
	]);

	arrow = initStaticBuffer([
		0.5, 0.25, -0.8660254, 0.25, -0.8660254, -0.25, -0.8660254, -0.25, 0.5, -0.25, 0.5, 0.25,
		0.5, -0.4330127, 1, 0, 0.5, 0.4330127,
	]);

	square = initStaticBuffer([
		1.0, 1.0,
		-1.0, 1.0,
		1.0, -1.0,
		-1.0, -1.0
	]);

	buffers = Array(consts.n);
	for(var i = 0; i < consts.n; i++)
		buffers[i] = initPointBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function start() {
	command_line = document.getElementById("command-line");
	command_text = document.getElementById("command-text");

	var canvas = document.getElementById("myCanvas");
	gl = initWebGL(canvas);
	if(!gl) return;
	width = canvas.width;
	hight = canvas.hight;

	intiAllShaders();
	initAllBuffers();

	increment(0);
	lastUpdate = new Date();
	setInterval(update, 10);

	//alert("start finished sucsessfully");
}

var lastUpdate;

function update() {
	render();
	var now = new Date();
	increment((now-lastUpdate)/1000.0);
	lastUpdate = now;
}

//state
var phi = 0.0;

const defaultState = [
             	[0.0, 0.0, 0.0], // alpha, d/dt, d^2/dt^2
             	[0.0, 0.0, 0.0],  // beta
             	[0.0, 0.0, 0.0],
             	[0.0, 0.0, 0.0],
             ];
var state = defaultState;
const defaultConsts = {
				n: 3,
				g: 0.2,
				m: [0.2, 0.2, 0.02, 0.02],
				l: [0.1, 0.2, 0.3, 0.3],
			 };
var consts = defaultConsts;
const defaultColors = [
	              [0.0, 1.0, 0.0, 1.0],
	              [0.0, 0.0, 1.0, 1.0],
	              [1.0, 1.0, 0.0, 1.0],
	              [0.0, 1.0, 1.0, 1.0],
              ];
var colors = defaultColors;
var buffers = [];

function copy(a) {
	var i = a.length-1;
	var y = Array(a.length);
	while(i--){
		var j = a[0].length-1;
		y[i] = Array(a[0].length);
		while(j--)
			y[i][j] = a[i][j];
	}
	return y;
}

function add(s1, s2){
	var s = Array(s1.length);
	var i = s1.length-1;
	while (i--) {
		s[i] = Array(s1[i].length);
		var j = s1[i].length-1;
		while (j--)
			s[i][j] = s1[i][j] + s2[i][j];
	}
	return s;
}

function multi(c, s) {
	var t = Array(s.length);
	var i = s.length-1;
	while (i--) {
		t[i] = Array(s[i].length);
		var j = s[i].length-1;
		while (j--)
			t[i][j] = c*s[i][j];
	}
	return t;
}

function increment(dt) {
	phi += 0.1*dt;

	const delta = 0.000005;
	var steps = dt/delta;

	for(var n = 0; n < steps; n++){
		state = integrate(state, delta);
	}
}

function integrate(state, dt) {
	var next = Array(state.length);
	for(var i = 0; i < consts.n; i++) {
		next[i] = Array(state[i].length);
		next[i][2] = dd(state, i);
		next[i][1] = next[i][2]*dt + state[i][1];
		next[i][0] = next[i][1]*dt + state[i][0]
	}
	return next;
}

function deq(state) {

	var next = Array(state.length);
	for(var i = 0; i < consts.n; i++) {
		next[i] = Array(state[0].length)
		next[i][2] = dd(state, i);
		next[i][1] = state[i][1];
		next[i][0] = 0.0;
	}
	return next;
}

function dd(state, i) {

	var m_T = 0.0;
	for(var j = i; j < consts.n; j++)
		m_T += consts.m[j];

	var F_G = consts.g*m_T*Math.cos(state[i][0]);
	var K = -m_T*consts.l[i];

	var F_P = 0.0;
	for(var j = 0; j < consts.n; j++) {
		if(j == i)
			continue;
		F_P += consts.l[j]*mprime(i, j)*J(state[i][0], state[j]);
	}

	if(F_P > 10.0) F_P = 10.0

	return (F_G + F_P) / K;
}

function mprime(i, j) { // that might be wrong
	switch (consts.n){
	case 1: case 2: return consts.m[1];
	case 3: return (i!= 2 && j!=2  ? consts.m[1] : 0.0) + consts.m[2];
	}
}

function ddA(state) {
	return (consts.g*(consts.m[0]+consts.m[1])*Math.cos(state[0][0]) +
			consts.m[1]*consts.l[1]*J(state[0][0], state[1]))/
			(-(consts.m[0]+consts.m[1])*consts.l[1]);
}

function ddB(state) {
	return (consts.g*consts.m[1]*Math.cos(state[1][0]) +
			consts.m[1]*consts.l[0]*J(state[1][0], state[0]))/
			(-consts.m[1]*consts.l[1]);
}

function J(a,b) {
	var ab = a-b[0];
	return Math.cos(ab)*b[2]+Math.sin(ab)*b[1]*b[1];
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	gl.useProgram(stdShader);
	gl.enableVertexAttribArray(stdPos);

	renderPoints(document.getElementById("checkH").checked);
	if(document.getElementById("checkP").checked)
		renderAllPendulums();
	if(document.getElementById("checkA").checked)
		renderAllVilocitys();

	gl.disableVertexAttribArray(stdPos);
	gl.useProgram(null);
}

function renderAllPendulums() {
	gl.bindBuffer(gl.ARRAY_BUFFER, pendulum.buffer);
	gl.vertexAttribPointer(stdPos, 2, gl.FLOAT, false, 0, 0);

	var x = 0.0, y = 0.0;
	for(var i = 0; i < consts.n; i++){

		var dx = consts.l[i]*Math.cos(state[i][0]);
		var dy = consts.l[i]*Math.sin(state[i][0]);

		gl.uniform4fv(stdC, colors[i]);
		gl.uniform1f(stdL, consts.l[i]);
		gl.uniform2f(stdO, x, y);
		gl.uniform1f(stdPhi, state[i][0]);

		gl.drawArrays(gl.TRIANGLES, 0, pendulum.length/2);

		x += dx;
		y += dy;

	}
}

function renderAllVilocitys() {
	gl.bindBuffer(gl.ARRAY_BUFFER, arrow.buffer);
	gl.vertexAttribPointer(stdPos, 2, gl.FLOAT, false, 0, 0);

	var x = 0.0, y = 0.0;
	var vx = 0.0, vy = 0.0;
	for(var i = 0; i < consts.n; i++){
		x += consts.l[i]*Math.cos(state[i][0]);
		y += consts.l[i]*Math.sin(state[i][0]);
		vx += -consts.l[i]*Math.sin(state[i][0])*state[i][1];
		vy += consts.l[i]*Math.cos(state[i][0])*state[i][1];

		gl.uniform4f(stdC, 1.0-colors[i][0], 1.0-colors[i][1], 1.0-colors[i][2], colors[i][3]);
		gl.uniform2f(stdO, x, y);
		gl.uniform1f(stdL, 0.2*Math.sqrt(vx*vx+vy*vy));
		gl.uniform1f(stdPhi, Math.atan2(vy, vx));

		gl.drawArrays(gl.TRIANGLES, 0, arrow.length/2);
	}
}

var uploadRate = 5, uploadCounter = 0;

function renderPoints(do_render) {

	var upload = false;

	if(uploadCounter < uploadRate) {
		uploadCounter += 1;
	}else{
		upload = true;
		uploadCounter = 0;
	}

	gl.uniform2f(stdO, 0.0, 0.0);
	gl.uniform1f(stdL, 1.0);
	gl.uniform1f(stdPhi, 0.0);

	//gl.pointSize(5.0);

	var x = 0.0, y = 0.0;
	for(var i = 0; i < consts.n; i++) {
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers[i].buffer);
		if(upload){
			x += consts.l[i]*Math.cos(state[i][0]);
			y += consts.l[i]*Math.sin(state[i][0]);
			buffers[i].data.push(x);
			buffers[i].data.push(y);
			buffers[i].capacity = buffers[i].data.length;
			buffers[i].length = buffers[i].data.length;

      if(do_render)
			   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffers[i].data), gl.DYNAMIC_DRAW);
			// use gl.bufferSubData !!
		}
    if(do_render) {
  		gl.vertexAttribPointer(stdPos, 2, gl.FLOAT, false, 0, 0);

  		gl.uniform4fv(stdC, colors[i]);

  		gl.drawArrays(gl.POINTS, 0, buffers[i].length/2);
    }
	}
}

var command_line, command_text;
var command_history = [""], command_index = 1;

function commandCall(event) {
	if(event.keyCode == 13) { // enter
		var command = command_line.value;
		printCommand(command);
		interpreteCommand(command);
		command_index = 1;
		command_line.value = "";
	}else if(event.keyCode == 38 || event.keyCode == 40) { // arrow up or down
    command_index += event.keyCode == 40 ? 1 : -1;
    command_index = command_index >= command_history.length ? command_history.length-1 :
                        (command_index < 0 ? 0 : command_index);
		command_line.value = command_history[command_history.length - 1 - command_index];
    command_line.setSelectionRange(command_history[command_index].length-1,
                                command_history[command_index].length-1)
  }
}

var help_str = `Set Simulation Parameters at runtime <br />
   WARNING: A bad choice will make the Simulation unstable.
   <br />
   Examples for currently avilable command are:
   <ul class="hint-list">
    <li>set angle 0 to 25.25</li>
    <li>set diff 0 to 42.17</li>
    <li>set ddiff 0 to 13</li>
    <li>set mass 0 to 9</li>
    <li>set length 0 to 19</li>
    <li>set gravity to 7</li>
    <li>set default</li>
  </ul>`;

function interpreteCommand(c) {
	var flags = c.split(" ");
	if(flags[0] == "set") {
		interpreteSet(flags.slice(1, flags.length));
  } else if(flags[0] == "help") {
    printResult(help_str);
	} else {
		printError("Unknown Syntax: '" + flags[0] + "'")
	}
}

var setCommands = [ // TODO: use a hash map (name -> everyting_else)
                   	{
          						name: "gravity",
          						type: 0, // scalar
          						setter: function (f) { consts.g = f; }
                   	},
                   	{
                   		name: "default",
                   		type: 2, // command only
                   		setter: function () {
                   					state = defaultState;
                   					consts = defaultConsts;
                   					colors = defaultColors;
                   				}
                   	},
					          {
                   		name: "angle",
                   		type: 1, // array
                   		max_id: function () { return consts.n-1; },
                   		setter: function (id, f) { state[id][0] = f; }
                   	},
                   	{
                   		name: "diff",
                   		type: 1, // array
                   		max_id: function () { return consts.n-1; },
                   		setter: function (id, f) { state[id][1] = f; }
                   	},
                   	{
                   		name: "ddiff",
                   		type: 1, // array
                   		max_id: function () { return consts.n-1; },
                   		setter: function (id, f) { state[id][2] = f; }
                   	},
                   	{
                   		name: "mass",
                   		type: 1, // array
                   		max_id: function () { return consts.n-1; },
                   		setter: function (id, f) { consts.m[id] = f; }
                   	},
                   	{
                   		name: "length",
                   		type: 1, // array
                   		max_id: function () { return consts.n-1; },
                   		setter: function (id, f) { consts.l[id] = f; }
                   	},
                   ];

function interpreteSet(flags) {

	for(var i = 0; i < setCommands.length; i++){
		var c = setCommands[i];
		if(flags[0] == c.name) {

			var j = 1;


			var id = 0;
			if(c.type == 1){
				id = parseInt(flags[j++]);
				var max = c.max_id();
				if(id > max){
					printError("Index '" + id + "' out of range (max = '" + max + "';)");
					return;
				}
			}

			if(c.type != 2){
				if(flags[j++] != "to") {
					printError("Missing keyword 'to' (got: '" + flags[j-1] + "')");
					return;
				}
			}

			if(c.type == 0){
				var f = parseFloat(flags[j++]);
				c.setter(f);
				printResult(c.name + " = " + f);
			} else if(c.type == 1){
				var f = parseFloat(flags[j++]);
				c.setter(id, f);
				printResult(c.name + "_" + id + " = " + f);
			} else if(c.type == 2){
				c.setter();
				printResult("set " + c.name + " executed");
			}

			return;
		}
	}

	printError("Unknown Syntax: '" + flags[0] + "'");
	return;
}

function printCommand(s) {
	command_history.push(s);
  command_index = 0;
	command_text.innerHTML += "<span class=\"c\">" + s + "</span>";
  command_text.scrollTop = command_text.scrollHeight;
}

function printError(s) {
	command_text.innerHTML += "<span class=\"e\">" + s + "</span>";
  command_text.scrollTop = command_text.scrollHeight;
}

function printResult(s) {
	command_text.innerHTML += "<span class=\"r\">" + s + "</span>";
  command_text.scrollTop = command_text.scrollHeight;
}
