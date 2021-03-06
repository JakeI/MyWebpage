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

vec4 color(float x, float y, float t, vec2 res, vec2 mouse) {
    float mx = 2.0 * mouse.x / res.x - 1.0;
    float my = 1.0 - 2.0 * mouse.y / res.y;
    
    float d1 = sqrt((x-mx)*(x-mx) + (y-my)*(y-my));
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
vec4 color(float x, float y, float t, vec2 res, vec2 mouse) {
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

vec4 color(float x, float y, float t, vec2 res, vec2 mouse) {
    
    float mx = 2.0 * mouse.x / res.x - 1.0;
    float my = 1.0 - 2.0 * mouse.y / res.y;
    
    float resmin = min(res.x, res.y);
    x = (x-mx)*res.x/resmin;
    y = (y-my)*res.y/resmin;
    
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
`,
    Lines:
`

const vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
const vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
    

float lineD(vec2 xy, vec2 s, vec2 e) {
	float a =  s.y - e.y;
	float b =  e.x - s.y;
	float c =  s.x * e.y - e.x * s.y;
	
	float d = abs(a * xy.x + b * xy.y + c) / 
	    sqrt(a*a + b*b);
	
	return d;
}

vec4 color(float x, float y, float t, vec2 res, vec2 mouse) {
    
    vec4 colors[6];
    colors[0] = vec4(1.0, 0.0, 0.0, 1.0);
    colors[1] = vec4(0.0, 1.0, 0.0, 1.0);
    colors[2] = vec4(0.0, 0.0, 1.0, 1.0);
    colors[3] = vec4(1.0, 1.0, 0.0, 1.0);
    colors[4] = vec4(1.0, 0.0, 1.0, 1.0);
    colors[5] = vec4(0.0, 1.0, 1.0, 1.0);
    
    float resmin = min(res.x, res.y);
    x = x*res.x/resmin;
    y = y*res.y/resmin;
    
    vec4 col = black;
    
    for(int i = 0; i < 6; i++) {
        float I = float(i) + 2.0;
        vec2 start = vec2(-1.0, 
                     sin(cos(t*0.17*I + I) / I*1.97));
    	vec2 end = vec2(1.0, 
    	             sin(sin(t*0.19*I + I) / I*2.05));
        float dist = lineD(vec2(x, y), start, end);
        vec4 c = mix(colors[i], white, smoothstep(0.0, dist, 0.01));
        col = mix(col, c, smoothstep(0.0, dist, 0.04));
    }
    
    
    return col;
}

`,
    Stars:
`


const vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
const vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
const vec4 red   = vec4(1.0, 0.0, 0.0, 1.0);
const vec4 green = vec4(0.0, 1.0, 0.0, 1.0);

float triangle(float x, float y) {
    return step(y, 1.0 - x)*step(y, 1.0 + x)*step(-y, 0.0);
}

vec4 color(float x, float y, float t, vec2 res, vec2 mouse) {
    
    float resmin = min(res.x, res.y);
    float X = x*res.x/resmin;
    float Y = y*res.y/resmin;
    
    if ((pow(X-(2.0 * mouse.x / res.x - 1.0), 2.0) + 
            pow(Y-(1.0 - 2.0 * mouse.y / res.y), 2.0)) < 0.5) {
        x = x*0.5;
        y = y*0.5;
    }
    
    float col = floor(x*4.0);
    float row = floor(y*4.0);
    
    x = 2.0*mod(x*4.0,1.0)-1.0;
    y = 2.0*mod(y*4.0,1.0)-1.0;
    
    x = x*res.x/resmin;
    y = y*res.y/resmin;
    
    x = x*1.3;
    y = y*1.3;
    
    vec4 color = mix(red, green, mod(col, 2.0));
    
    float star = 1.0 - ((1.0-triangle(x, y+0.33))*
                        (1.0-triangle(x, 0.33-y)));
                        
    vec4 starcol = mix(white, black, mod(row+col, 2.0));
    
    color = mix(color, starcol, star);
    
    return color;
}
`,
    Clock:
`

const vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
const vec4 green = vec4(0.0, 1.0, 0.0, 1.0);

float paral(float x, float y) {
    return step(-y, 0.1)*step(y, 0.9)*
           step(x, 0.0)*step(-x, 0.1)*
           step(0.1-x, y)*step(y, 0.9+x);
}

float diamand(float x, float y) {
    return step(y, 0.05)*step(-y, 0.05)*
           step(-x, -0.1)*step(x, 0.8)*
           step(x-0.8, y)*step(y, 0.8-x)*
           step(y, x-0.1)*step(0.1-x, y);
}

float seg(float x, float y,
          float a, float b, float c, float d,
          float e, float f, float g) {
    return paral(0.95-y, x+0.05)*a+
           paral(0.9-x, y)*b+paral(0.9-x, -y)*c+
           paral(y+0.95, x+0.05)*d+
           paral(x, -y)*e+paral(x, y)*f+
           diamand(x, y)*g;
}

float num(float x, float y, int n){
         if(n == 0) return seg(x,y, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0);
    else if(n == 1) return seg(x,y, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0);
    else if(n == 2) return seg(x,y, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0);
    else if(n == 3) return seg(x,y, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0);
    else if(n == 4) return seg(x,y, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0);
    else if(n == 5) return seg(x,y, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0);
    else if(n == 6) return seg(x,y, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0);
    else if(n == 7) return seg(x,y, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0);
    else if(n == 8) return seg(x,y, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0);
    else if(n == 9) return seg(x,y, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0);
    return seg(x,y, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0);
}

float num(float x, float y, float t, float r) {
    int i = int(floor(mod(r*t, 10.0)));
    float a = num(x, y, i);
    float b = num(x, y, (i == 9 ? -1 : i)+1);
    return mix(a, b, pow(mod(r*t, 1.0), 3.0));
}

float point(float x, float y) {
    return step(-x, 0.05)*step(x, 0.05)*
           step(-y, 0.05)*step(y, 0.05);
}

vec4 color(float x, float y, float t, vec2 res, vec2 mouse) {
    
    float resmin = min(res.x, res.y);
    x = x*res.x/resmin;
    y = y*res.y/resmin;
    
    x = 1.8*x + 0.2;
    y = 1.8*y;
    
    vec4 col = black;
    
    col = mix(col, green, num(x+1.7, y, t, 0.1));
    col = mix(col, green, num(x+0.3, y, t, 1.0));
    col = mix(col, green, point(x-0.9, y+1.0));
    col = mix(col, green, num(x-1.2, y, t, 10.0));
    
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
        #ifdef GL_ES
        precision mediump float;
        #endif

        varying float x;
        varying float y;

        uniform float t;
        uniform vec2 resolution;
        uniform vec2 mouse;
    `;
var fs_end = `
        void main() {
            gl_FragColor = color(x, y, t, resolution, mouse);
        }
    `;

function incrementer(dt, param) {
    param.t += speed*dt;
    timer.innerHTML = "t = " + param.t.toFixed(1);
    param.mouse = mouse;
}

var param = { t:0.0, resolution:[640, 480], mouse:[0,0] };

var speed = 1;
var timer;
var setup_done = false;
var mouse;
        
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

    canvas.addEventListener('mousemove', function(event) {
        var rect = canvas.getBoundingClientRect();
        mouse = [event.clientX - rect.left, 
                       event.clientY - rect.top];
    })

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
