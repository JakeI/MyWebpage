var examples = {
    Interference: 
`const float tau = 2.0*3.1415;

const float l1 = 0.1;
const float l2 = 0.1;
const float T1 = 1.0;
const float T2 = 1.0;
const float dx1 = 0.1;
const float dy1 = 0.0;
const float dx2 = -0.1;
const float dy2 = 0.0;

const vec4 orange = vec4(1.0, 0.549019608, 0.0, 1.0);
const vec4 black = vec4(0.0, 0.0, 0.0, 1.0);

vec4 color(float x, float y, float t) {
float d1 = sqrt((x-dx1)*(x-dx1) + (y-dy1)*(y-dy1));
float d2 = sqrt((x-dx2)*(x-dx2) + (y-dy2)*(y-dy2));

float i1 = sin(tau*(t/T1 + d1/l1));
float i2 = sin(tau*(t/T2 + d2/l2));

float o1 = step(d1, t*l1/T1);
float o2 = step(d2, t*l2/T2);

float c = 0.4*(o1*i1+o2*i2 + 2.0);

return mix(black, orange, c);
}`,
    Empty:
`
vec4 color(float x, float y, float t) {
return vec4(0.4, 0.0, 0.9, 1.0);
}
`,
    CircleAndSquare:
`
const float tau = 2.0*3.1415;

const float ar = 640.0/480.0; // TODO: write orthographic projection

const float R = 0.5;
const float r = 0.1;
const float w = tau/8.0;

const vec4 orange = vec4(1.0, 0.549019608, 0.0, 1.0);
const vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
const vec4 gray = vec4(0.3, 0.3, 0.3, 1.0);
const vec4 blue = vec4(0.0, 0.0, 0.8, 1.0);

const float lineWidth = 0.01;

vec4 color(float x, float y, float t) {
    
    vec4 col = black;
    
    float phi = w*t;
    float Cos = cos(phi);
    float Sin = sin(phi);
    
    float X =  Cos*x + Sin*y;
    float Y = -Sin*x + Cos*y;
    float line = 1.0-(1.0 - step(0.0, -X))*(step(-R, -X))*
                  (1.0 - step(lineWidth, -Y))*(step(-lineWidth, -Y));
    col = mix(blue, col, line);
    
    vec2 center = R*vec2(Cos, Sin);
    float circle = step(r, length(center - vec2(x, y)));
    col = mix(gray, col, circle);
    
    float square = 1.0-(1.0-step(r/2.0, abs(x)))*
                (1.0-step(r/2.0, abs(y)));
    col = mix(orange, col, square);
    
    return col;
}

`
};

var vs = `
        attribute vec2 pos;

        varying float x;
        varying float y;

        void main() {
            gl_Position = vec4(pos, 0.0, 1.0);
            x = pos.x;
            y = pos.y;
        }
    `;
var fs_start = ` 
        precision mediump float;

        varying float x;
        varying float y;

        uniform float t;
    `;
var fs_end = `
        void main() {
            gl_FragColor = color(x, y, t);
        }
    `;

function incrementer(dt, param) {
    param.t += speed*dt;
    timer.innerHTML = "t = " + param.t.toFixed(1);
}

var param = { t:0.2 };

var speed = 1;
var timer;
var setup_done = false;
        
function start() {
    var s = "";
    for (var ex in examples) 
        if (examples.hasOwnProperty(ex)) {
            s += "<span onclick=\'setExample(\"" + ex +
                "\");\'>" + ex + "</span>\n";
        }
    document.getElementById("Example-Selector").innerHTML = s;

    setExample("Interference");
    setup(document.getElementById("myCanvas"), 
        vs, fs_start + editor.getValue() + fs_end, 
        param, incrementer);
    timer = document.getElementById("timer");
    setup_done = true;
}

function compile() {
    if (!setup_done) return;
    recompile(null,fs_start + editor.getValue() + fs_end,
        param, incrementer);
}

function pause() {
    var btn = document.getElementById("pausebtn");
    if (speed == 0) {
        speed = 1;
        btn.innerHTML = "1x";
    } else {
        speed = 0;
        btn.innerHTML = "0x";
    }
}

function slower() {
    switch (speed) {
        case 1:
            speed = 0;
            break;
        case 0:
            speed = -1;
            break;
        case -1:
            speed = -2;
            break;
        default:
            speed = speed > 0 ? speed/2 : speed*2;
            break;
    }        
    document.getElementById("pausebtn").innerHTML = speed + "x";
}

function faster() {
    switch (speed) {
        case 1:
            speed = 2;
            break;
        case 0:
            speed = 1;
            break;
        case -1:
            speed = 0;
            break;
        default:
            speed = speed > 0 ? speed*2 : speed/2;
            break;
    }        
    document.getElementById("pausebtn").innerHTML = speed + "x";
}

function restart() {
    param.t = 0;
    timer.innerHTML = "t = 0.0"; 
}

function setExample(ex) {
    editor.setValue(examples[ex]);
    editor.selection.moveCursorTo(0,0,true);
    compile();
}
