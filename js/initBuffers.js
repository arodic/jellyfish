var vertexPositionBuffer = {};
var vertexNormalBuffer = {};
var vertexColorBuffer = {};
var vertexTextureCoordBuffer = {};
var vertexIndexBuffer = {};
var bufferOK = {};

function initBuffers(){
  loadObject('jellyfish0','meshes/jellyfish0.json');
  loadObject('jellyfish1','meshes/jellyfish1.json');
  loadObject('jellyfish2','meshes/jellyfish2.json');
  loadObject('jellyfish3','meshes/jellyfish3.json');
}

function loadObject(name, file){
  var request = new XMLHttpRequest();
  request.open("GET", file);
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      initBuffer(name, JSON.parse(request.responseText));
      bufferOK[name] = 1;
    }
  };
  request.send();
}

function initBuffer(name, data) {
  vertexPositionBuffer[name] = gl.createBuffer();
  vertexNormalBuffer[name] = gl.createBuffer();
  vertexColorBuffer[name] = gl.createBuffer();
  vertexTextureCoordBuffer[name] = gl.createBuffer();
  vertexIndexBuffer[name] = gl.createBuffer();
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer[name]);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertexPositions), gl.STATIC_DRAW);
  vertexPositionBuffer[name].itemSize = 3;
  vertexPositionBuffer[name].numItems = data.vertexPositions.length/3;  

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer[name]);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertexNormals), gl.STATIC_DRAW);
  vertexNormalBuffer[name].itemSize = 3;
  vertexNormalBuffer[name].numItems = data.vertexNormals.length/3;

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer[name]);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertexColors), gl.STATIC_DRAW);
  vertexColorBuffer[name].itemSize = 3;
  vertexColorBuffer[name].numItems = data.vertexColors.length/3;

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer[name]);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertexTextureCoords), gl.STATIC_DRAW);
  vertexTextureCoordBuffer[name].itemSize = 3;
  vertexTextureCoordBuffer[name].numItems = data.vertexTextureCoords.length/3;

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer[name]);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STREAM_DRAW);
  vertexIndexBuffer[name].itemSize = 1;
  vertexIndexBuffer[name].numItems = data.indices.length;
}

function drawBuffer(name){
  if(vertexPositionBuffer[name]){
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer[name]);
    gl.vertexAttribPointer(currentProgram.vertexPositionAttribute, vertexPositionBuffer[name].itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer[name]);
    gl.vertexAttribPointer(currentProgram.vertexNormalAttribute, vertexNormalBuffer[name].itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer[name]);
    gl.vertexAttribPointer(currentProgram.vertexColorAttribute, vertexColorBuffer[name].itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer[name]);
    gl.vertexAttribPointer(currentProgram.textureCoordAttribute, vertexTextureCoordBuffer[name].itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer[name]);

    gl.drawElements(gl.TRIANGLES, vertexIndexBuffer[name].numItems, gl.UNSIGNED_SHORT, 0);
  }
}