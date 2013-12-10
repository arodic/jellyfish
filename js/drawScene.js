var vecX = V3.$(1,0,0);
var vecY = V3.$(0,1,0);

function drawScene() {

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    
    M4x4.makePerspective(uFov, gl.viewportWidth / gl.viewportHeight, uNear, uFar, uProjection);
    
    M4x4.makeTranslate3(0,0,0,uWorld);  
    M4x4.makeTranslate3(0,0,0,uView);
    
    M4x4.translate3Self(camera.translate[0],0,0,uView);
    M4x4.translate3Self(0,-camera.translate[1],0,uView);
    M4x4.translate3Self(0,0,camera.translate[2],uView);
    M4x4.rotate(camera.rotate[0],vecX,uView,uView);
    M4x4.rotate(camera.rotate[1],vecY,uView,uView);

    M4x4.mul(uView,uWorld,uWorldView);
    M4x4.mul(uProjection,uWorldView,uWorldViewProj);
    M4x4.inverseOrthonormal(uView,uViewInv);

	camera.eye[0] = -uViewInv[12];
    camera.eye[1] = -uViewInv[13];
    camera.eye[2] = -uViewInv[14];

    bindTexture('caustics'+parseInt(uTime*30 % 33), 1);

    drawSkybox();
    drawPlankton();
    
    simulate();
    drawJellyfish();

    // drawRays();

    gl.flush();

}



