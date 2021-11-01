import * as THREE from 'three';

export default class Raycast {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.objToDetect = [];
    this.currentIntersect = null;

    this.detectMouse();
  }

  detectMouse() {
    this.mouse = new THREE.Vector2();

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.outerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.outerHeight) * 2 + 1;
    });
  }
}
