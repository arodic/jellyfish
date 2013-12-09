// JavaScript Document
var texture = {};

function initTextures() {
  loadTexture('jellyfish', 'images/jellyfish.png');
  loadTexture('luminescence', 'images/luminescence.png');
  loadTexture('plankton', 'images/plankton.jpg');
  loadTexture('blob', 'images/blob.jpg');
  loadTexture('halfBlob', 'images/halfBlob.jpg');
  
  for (var i=1; i <= 32; i++) {
    loadTexture('caustics'+i, 'images/caustics/caustics7.'+pad2(i-1)+'.jpg');
  }
}

function loadTexture(label, path) {
  var imageFile = new Image();
  imageFile.src = path;
  imageFile.onload = function() {
    texture[label] = gl.createTexture();
    texture[label].image = imageFile;
    handleLoadedTexture(texture[label], label);
  }
}

function handleLoadedTexture(textures, label) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.bindTexture(gl.TEXTURE_2D, textures);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textures.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

function bindTexture(name, i) {
  if(texture[name]){
    gl.activeTexture(gl["TEXTURE"+i]);
    gl.bindTexture(gl.TEXTURE_2D, texture[name]);
  }
}

function pad2(number) {
  return (parseInt(number) < 10 ? '0' : '') + parseInt(number)
}