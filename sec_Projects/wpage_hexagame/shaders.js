function Shaders(gl) {
    for (var property in shader_text) {
        if (shader_text.hasOwnProperty(property)) {
            this[property] = new Shader(gl, shader_text[property])
        }
    }
    return this;
}

function uniform(gl, shader, vars) {
    for (var property in vars) {
        if (vars.hasOwnProperty(property)) {
            var v = vars[property];
            var type = typeof v;
            var name = shader[property];
            if (type == "number") {
                gl.uniform1f(name, v);
            } else { // assume array
                switch(v.length) {
                    case 2:
                        gl.uniform2f(name, v[0], v[1]);
                        break;
                    case 3:
                        gl.uniform3f(name, v[0], v[1], v[2]);
                        break;
                    case 4:
                        gl.uniform4f(name, v[0], v[1], v[2], v[3]);
                        break;
                }
            }
        }
    }
}

const shader_text = {
    std: {
        param: [
            "translation", "scale", "rotation", "color", "res",
            "world_translation", "world_scale"
        ],
        attrib: [
            "pos"
        ],
        vs: `
                #version 100

                attribute vec2 pos;

                uniform vec2 world_translation;
                uniform float world_scale;

                uniform vec2 translation;
                uniform float scale;
                uniform float rotation;

                uniform vec4 color;

                uniform vec2 res;

                varying vec4 C;

                void main() {

                    //float mx = 2.0 * mouse.x / res.x - 1.0;
                    //float my = 1.0 - 2.0 * mouse.y / res.y;

                    vec2 poss = pos;

                    C = color;

                    float Cos = cos(rotation);
                    float Sin = sin(rotation);
                    vec2 pp = vec2(Cos*poss.x - Sin*poss.y, Sin*poss.x + Cos*poss.y);
                    
                    vec2 target = scale*(pp) + translation;

                    target = world_scale*target + world_translation;

                    float resmin = min(res.x, res.y);
                    target = target*vec2(res.y, res.x)/resmin;

                    gl_Position = vec4(target, 0.0, 1.0);
                }
            `,
        fs: `   
                #version 100

                #ifdef GL_ES
                precision mediump float;
                #endif

                varying vec4 C;

                void main() {
                    gl_FragColor = C;
                }
            ` 
    },
    std_instanced: {
        param: [
            "translation", "scale", "rotation", "color", "res",
            "world_translation", "world_scale"
        ],
        attrib: [
            "pos", "trans", "idcol"
        ],
        vs: `
                #version 100

                attribute vec2 pos;

                attribute vec2 trans;
                attribute vec2 idcol;

                uniform vec2 world_translation;
                uniform float world_scale;

                uniform vec2 translation;
                uniform float scale;
                uniform float rotation;

                uniform vec4 color;

                uniform vec2 res;

                varying vec4 C;
                varying vec2 Idcol;

                void main() {

                    //float mx = 2.0 * mouse.x / res.x - 1.0;
                    //float my = 1.0 - 2.0 * mouse.y / res.y;

                    vec2 poss = pos;

                    C = color;
                    Idcol = idcol;

                    float Cos = cos(rotation);
                    float Sin = sin(rotation);
                    vec2 pp = vec2(Cos*poss.x - Sin*poss.y, Sin*poss.x + Cos*poss.y);
                    
                    vec2 target = scale*(pp) + translation + trans;

                    target = world_scale*target + world_translation;

                    float resmin = min(res.x, res.y);
                    target = target*vec2(res.y, res.x)/resmin;

                    gl_Position = vec4(target, 0.0, 1.0);
                }
            `,
        fs: `   
                #version 100

                #ifdef GL_ES
                precision mediump float;
                #endif

                varying vec4 C;
                varying vec2 Idcol;

                void main() {
                    gl_FragColor = vec4(Idcol, 0.0, 1.0);
                }
            ` 
    },
    textured: {
        param: [
            "translation", "scale", "rotation", "color", "res",
            "world_translation", "world_scale", "sampler"
        ],
        attrib: [
            "pos", "uv"
        ],
        vs: `
                #version 100

                attribute vec2 pos;
                attribute vec2 uv;

                uniform vec2 world_translation;
                uniform float world_scale;

                uniform vec2 translation;
                uniform float scale;
                uniform float rotation;

                uniform vec2 res;

                varying vec4 C;
                varying vec2 UV;

                void main() {

                    //float mx = 2.0 * mouse.x / res.x - 1.0;
                    //float my = 1.0 - 2.0 * mouse.y / res.y;

                    vec2 poss = pos;

                    UV = uv;

                    float Cos = cos(rotation);
                    float Sin = sin(rotation);
                    vec2 pp = vec2(Cos*poss.x - Sin*poss.y, Sin*poss.x + Cos*poss.y);
                    
                    vec2 target = scale*(pp) + translation;

                    target = world_scale*target + world_translation;

                    float resmin = min(res.x, res.y);
                    target = target*vec2(res.y, res.x)/resmin;

                    gl_Position = vec4(target, 0.0, 1.0);
                }
            `,
        fs: `   
                #version 100

                #ifdef GL_ES
                precision mediump float;
                #endif

                varying vec2 UV;

                uniform sampler2D sampler;

                void main() {
                    gl_FragColor = texture2D(sampler, UV);
                }
            ` 
    }
}

function getShader(gl, text, type) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader, text);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("Shader ('" + type + "') couldn't be compiled\nInfo Log:\n\n"
				+ gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}

function initShader(gl, vertex, fragment){
	var vertexShader = getShader(gl, vertex, gl.VERTEX_SHADER);
	var fragementShader = getShader(gl, fragment, gl.FRAGMENT_SHADER);
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragementShader);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program, gl.LINK_STATUS))
		alert("unable to initialise shaders { '" + vertex +
			"', '" + fragment + "' }.\nInfoLog:\n\n" + gl.getProgramInfoLog(program));
	return program;
}

function Shader(gl, shader_text) {
	this.shader = initShader(gl, shader_text.vs, shader_text.fs);
    gl.useProgram(this.shader);
    for (var i = 0; i < shader_text.param.length; i++) {
		this[shader_text.param[i]] = gl.getUniformLocation(this.shader, shader_text.param[i]);
    }
    for (var i = 0; i < shader_text.attrib.length; i++) {
		this[shader_text.attrib[i]] = gl.getAttribLocation(this.shader, shader_text.attrib[i]);
    }
    gl.useProgram(null);
    return this;
}