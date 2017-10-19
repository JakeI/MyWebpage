var gl, canvas, incrementer, param;
var shader, locations = {}, posLocation;
var rect;
var lastUpdate, updating = false;
var hidden;
var vss, fss;

function render(param) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    gl.useProgram(shader);
    
    for (var prop in param)
        if (param.hasOwnProperty(prop))
            uniform(locations[prop], param[prop]);
    
    gl.enableVertexAttribArray(posLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, rect.buffer);
    gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, rect.length/2);

    gl.useProgram(null);
}

function update() {
    if(updating) return;
	if(!isElementInViewport(canvas)) return;
	if(document[hidden]) return;
    updating = true;
    
    render(param);

    var now = new Date();
    var dt = (now-lastUpdate)/1000.0;
    
    incrementer(dt > 0.02 ? 0.02 : dt, param);
    
	lastUpdate = now;
	updating = false;
}

function recompile(vs_, fs_, param_, incrementer_) {
    incrementer = incrementer_;
    param = param_;

    if (vs_ != null)
        vss = getShader(gl, vs_, "vs");
    if (fs_ != null)
        fss = getShader(gl, fs_, "fs");
    shader = initShader(vss, fss);

    gl.useProgram(shader);
    for (var prop in param)
        if (param.hasOwnProperty(prop)) {
            locations[prop] = gl.getUniformLocation(shader, prop);
        }
    posLocation = gl.getAttribLocation(shader, "pos");

    gl.useProgram(null);
}

function setup(canvas_, vs_, fs_, param_, incrementer_) {
    hidden = hiddenStr();

    canvas = canvas_;
    gl = initWebGL(canvas_);
    
    recompile(vs_, fs_, param_, incrementer_);

    rect = initStaticBuffer([
        -1.0, 1.0,
        1.0, 1.0,
		-1.0, -1.0,
		1.0, -1.0
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    lastUpdate = new Date();
    setInterval(update, 10);
}

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
	var program = gl.createProgram();
	gl.attachShader(program, vertex);
	gl.attachShader(program, fragment);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program, gl.LINK_STATUS))
		alert("unable to initialise shaders { '" + vertex +
			"', '" + fragment + "' }.\nInfoLog:\n\n" + gl.getProgramInfoLog(program));
	return program;
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

function isElementInViewport(el) {
    const fraction = 0.3;

    var rect = el.getBoundingClientRect();
    var w = rect.right - rect.left;
    var h = rect.bottom - rect.top;
    var W = Math.min(rect.right, window.innerWidth || document.documentElement.clientWidth) - Math.max(rect.left, 0);
    var H = Math.min(rect.bottom, window.innerHeight || document.documentElement.clientHeight) - Math.max(rect.top, 0);

    return H*W/(w*h) > fraction;
}

function hiddenStr() {
    if (typeof document.hidden !== "undefined") // Opera 12.10 and Firefox 18 and later support
        return "hidden";
    else if (typeof document.msHidden !== "undefined")
        return "msHidden";
    else if (typeof document.webkitHidden !== "undefined")
        return "webkitHidden";
}

function uniform(loc, val) {
    if (typeof val  === "number") {
        gl.uniform1f(loc, val);
        return;
    } else {
        if ("length" in val) {
            switch (val.length) {
                case 2:
                    gl.uniform2f(loc, val[0], val[1]);
                    return;
                case 3:
                    gl.uniform3f(loc, val[0], val[1],  val[2]);
                    return;
                case 4:
                    gl.uniform4f(loc, vol[0], val[1], val[2], val[3]);
                    return;
            }
        }
    }
}