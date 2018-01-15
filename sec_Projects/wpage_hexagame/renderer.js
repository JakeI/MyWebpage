function renderStd(obj, primative) {
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
	gl.vertexAttribPointer(shaders.std.pos, 2, gl.FLOAT, false, 0, 0);

	gl.drawArrays(primative, 0, obj.length/2);
}

function renderStdInstanced(obj, bff, primative) {
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
    var pos = shaders.std_instanced.pos;
	gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
	gl.vertexAttribDivisor(pos, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, bff.buffer);
    var trans = shaders.std_instanced.trans;
	gl.vertexAttribPointer(trans, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribDivisor(trans, 1);
    var idcol = shaders.std_instanced.idcol;
	gl.vertexAttribPointer(idcol, 2, gl.FLOAT, false, 16, 8);
	gl.vertexAttribDivisor(idcol, 1);

    gl.drawArraysInstanced(primative, 0, obj.length/2, bff.length/4);
    
    gl.vertexAttribDivisor(trans, 0);
    gl.vertexAttribDivisor(idcol, 0);
}

function enableVertexAttribArray(gl, shader, attribs) {
    for(var i = 0; i < attribs.length; i++) {
        gl.enableVertexAttribArray(shader[attribs[i]]);
    }
}

function disableVertexAttribArray(gl, shader, attribs) {
    for(var i = 0; i < attribs.length; i++) {
        gl.disableVertexAttribArray(shader[attribs[i]]);
    }
}