function drawScene() {

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    
    mProjection = M4x4.makePerspective(uFov, gl.viewportWidth / gl.viewportHeight, uNear, uFar);
    
    uWorld = M4x4.makeTranslate3(0,0,0);  
    uView = M4x4.makeTranslate3(0,0,0);
    
    uView = M4x4.translate3(camera.translate[0],0,0,uView);
    uView = M4x4.translate3(0,-camera.translate[1],0,uView);
    uView = M4x4.translate3(0,0,camera.translate[2],uView);
    uView = M4x4.rotate(camera.rotate[0],V3.$(1,0,0),uView);
    uView = M4x4.rotate(camera.rotate[1],V3.$(0,1,0),uView);

    M4x4.mul(uView,uWorld,uWorldView);
    M4x4.mul(mProjection,uWorldView,uWorldViewProj);
    M4x4.inverseOrthonormal(uView,uViewInv);

	camera.eye = V3.$(-uViewInv[12],-uViewInv[13],-uViewInv[14]);

    bindTexture('caustics'+parseInt(uTime*30 % 33), 1);

    drawSkybox();
    
    simulate();
    drawJellyfish();

    drawRays();

    drawPlankton();

    gl.flush();

}



