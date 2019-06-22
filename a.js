function myOrbit () {
  const sensitivityX = 1
  const sensitivityY = 1
  const cam = this._renderer._curCamera;

  const mouseInCanvas =
    this.mouseX < this.width &&
    this.mouseX > 0 &&
    this.mouseY < this.height &&
    this.mouseY > 0;
  if (!mouseInCanvas) {
    return cam
  };


  const scaleFactor = this.height < this.width ? this.height : this.width;

  if (this.mouseIsPressed) {
    if (this.mouseButton === this.LEFT) {
      deltaTheta =
        -sensitivityX * (this.mouseX - this.pmouseX) / scaleFactor;
      deltaPhi = sensitivityY * (this.mouseY - this.pmouseY) / scaleFactor;

      let diffX = cam.eyeX - cam.centerX;
      let diffY = cam.eyeY - cam.centerY;
      let diffZ = cam.eyeZ - cam.centerZ;

      // get spherical coorinates for current camera position about origin
      let camRadius = Math.sqrt(diffX * diffX + diffY * diffY + diffZ * diffZ);
      let camTheta = Math.atan2(diffX, diffZ); // equatorial angle
      let camPhi = Math.acos(Math.max(-1, Math.min(1, diffY / camRadius))); // polar angle

      // add change
      camTheta += deltaTheta;
      camPhi += deltaPhi;


      this._renderer._curCamera._orbit(deltaTheta, deltaPhi, 0);
    }
  }

  return {
    deltaTheta: deltaTheta,
    deltaPhi: deltaPhi
  }
}
