function Atlases(gl) {
    for (property in atlas_data) {
        if (atlas_data.hasOwnProperty(property)) {
            this[property] = new Atlas(gl, property, property+".png", atlas_data[property]);
        }
    }
    return this;
}

function Atlas(gl, name, path, sprites) {
    this.texture = new Texture(gl, path);
    return this;
}

function imgToPx(img) {
    var canvas = Canvas();
    canvas.width = img.width;
    canvas.height = img.height;
    context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, img.width, img.height);
    return context.getImageData(0, 0, img.width, img.height).data;
}

function Texture(gl, path) {
    this.texture = gl.createTexture();
    this.width = 1;
    this.height = 1;

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    //              new Uint8Array([0, 0, 255, 255]));
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

    data = imgs[path.substr(0, path.indexOf(".png"))];
    D = Math.sqrt(data.length/4);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, D, D, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array(data));
    gl.generateMipmap(gl.TEXTURE_2D);

    /*texture = this;

    img = new Image();
    console.log("path is: "+path);
    img.onload = function () {
        ////gl.enable(gl.TEXTURE_2D);
        //console.log("loding texture: "+texture.texture);
        //gl.bindTexture(gl.TEXTURE_2D, texture.texture);
        ////gl.texImage2D(gl.TEXTURE_2D, 0, img, true);
        //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        //gl.generateMipmap(gl.TEXTURE_2D);
        
        gl.bindTexture(gl.TEXTURE_2D, texture.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); 
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.generateMipmap(gl.TEXTURE_2D);
        
        texture.width = img.width;
        texture.height = img.height;
    };
    img.src = path;*/

    return this;
}

var atlas_data = {
    static: {
        "alpha.png":
        {
            "frame": {"x":0,"y":0,"w":50,"h":50},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x":0,"y":0,"w":50,"h":50},
            "sourceSize": {"w":50,"h":50},
            "pivot": {"x":0.5,"y":0.5}
        },
        "camp.png":
        {
            "frame": {"x":50,"y":0,"w":50,"h":50},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x":0,"y":0,"w":50,"h":50},
            "sourceSize": {"w":50,"h":50},
            "pivot": {"x":0.5,"y":0.5}
        },
        "camp_dark.png":
        {
            "frame": {"x":100,"y":0,"w":50,"h":50},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x":0,"y":0,"w":50,"h":50},
            "sourceSize": {"w":50,"h":50},
            "pivot": {"x":0.5,"y":0.5}
        },
        "fire.png":
        {
            "frame": {"x":150,"y":0,"w":50,"h":50},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x":0,"y":0,"w":50,"h":50},
            "sourceSize": {"w":50,"h":50},
            "pivot": {"x":0.5,"y":0.5}
        },
        "fire_dark.png":
        {
            "frame": {"x":200,"y":0,"w":50,"h":50},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x":0,"y":0,"w":50,"h":50},
            "sourceSize": {"w":50,"h":50},
            "pivot": {"x":0.5,"y":0.5}
        },
        "hex.png":
        {
            "frame": {"x":0,"y":50,"w":300,"h":200},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x":0,"y":0,"w":300,"h":200},
            "sourceSize": {"w":300,"h":200},
            "pivot": {"x":0.5,"y":0.5}
        },
        "knight.png":
        {
            "frame": {"x":300,"y":50,"w":50,"h":50},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x":0,"y":0,"w":50,"h":50},
            "sourceSize": {"w":50,"h":50},
            "pivot": {"x":0.5,"y":0.5}
        },
        "knight_dark.png":
        {
            "frame": {"x":350,"y":50,"w":50,"h":50},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x":0,"y":0,"w":50,"h":50},
            "sourceSize": {"w":50,"h":50},
            "pivot": {"x":0.5,"y":0.5}
        },
        "maximize.png":
        {
            "frame": {"x":400,"y":50,"w":50,"h":50},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x":0,"y":0,"w":50,"h":50},
            "sourceSize": {"w":50,"h":50},
            "pivot": {"x":0.5,"y":0.5}
        },
        "minimize.png":
        {
            "frame": {"x":450,"y":50,"w":50,"h":50},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x":0,"y":0,"w":50,"h":50},
            "sourceSize": {"w":50,"h":50},
            "pivot": {"x":0.5,"y":0.5}
        },
        "tank.png":
        {
            "frame": {"x":0,"y":250,"w":50,"h":50},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x":0,"y":0,"w":50,"h":50},
            "sourceSize": {"w":50,"h":50},
            "pivot": {"x":0.5,"y":0.5}
        },
        "tank_dark.png":
        {
            "frame": {"x":50,"y":250,"w":50,"h":50},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x":0,"y":0,"w":50,"h":50},
            "sourceSize": {"w":50,"h":50},
            "pivot": {"x":0.5,"y":0.5}
        },
        "tent.png":
        {
            "frame": {"x":100,"y":250,"w":50,"h":50},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x":0,"y":0,"w":50,"h":50},
            "sourceSize": {"w":50,"h":50},
            "pivot": {"x":0.5,"y":0.5}
        },
        "tent_dark.png":
        {
            "frame": {"x":150,"y":250,"w":50,"h":50},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x":0,"y":0,"w":50,"h":50},
            "sourceSize": {"w":50,"h":50},
            "pivot": {"x":0.5,"y":0.5}
        },
        "turm.png":
        {
            "frame": {"x":200,"y":250,"w":50,"h":50},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x":0,"y":0,"w":50,"h":50},
            "sourceSize": {"w":50,"h":50},
            "pivot": {"x":0.5,"y":0.5}
        },
        "zoom_in.png":
        {
            "frame": {"x":250,"y":250,"w":50,"h":50},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x":0,"y":0,"w":50,"h":50},
            "sourceSize": {"w":50,"h":50},
            "pivot": {"x":0.5,"y":0.5}
        },
        "zoom_in_dark.png":
        {
            "frame": {"x":300,"y":250,"w":50,"h":50},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x":0,"y":0,"w":50,"h":50},
            "sourceSize": {"w":50,"h":50},
            "pivot": {"x":0.5,"y":0.5}
        },
        "zoom_out.png":
        {
            "frame": {"x":350,"y":250,"w":50,"h":50},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x":0,"y":0,"w":50,"h":50},
            "sourceSize": {"w":50,"h":50},
            "pivot": {"x":0.5,"y":0.5}
        },
        "zoom_out_dark.png":
        {
            "frame": {"x":400,"y":250,"w":50,"h":50},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x":0,"y":0,"w":50,"h":50},
            "sourceSize": {"w":50,"h":50},
            "pivot": {"x":0.5,"y":0.5}
        }
    }
}