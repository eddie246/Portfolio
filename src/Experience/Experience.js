import * as THREE from 'three';
import gsap from 'gsap';
import Time from './Utils/Time.js';
import Sizes from './Utils/Sizes.js';
import Stats from './Utils/Stats.js';

import Resources from './Resources.js';
import Renderer from './Renderer.js';
import Camera from './Camera.js';
import World from './World.js';

import assets from './assets.js';

export default class Experience {
  static instance;

  constructor(_options = {}) {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;

    // Options
    this.targetElement = _options.targetElement;

    if (!this.targetElement) {
      console.warn("Missing 'targetElement' property");
      return;
    }

    this.time = new Time();
    this.sizes = new Sizes();
    this.setConfig();
    this.setStats();
    this.setScene();
    this.setCamera();
    this.setRenderer();
    this.setResources();
    this.setWorld();

    this.sizes.on('resize', () => {
      this.resize();
    });

    this.update();

    //Camera Stuff
    this.cameraCoords = { x: 30, y: 20, z: 30 };
    this.cameraFollow();
    // this.camera.instance.quaternion.set(
    //   -0.2706115851600799,
    //   0.6532743794818335,
    //   0.2706100886698562,
    //   0.6532779921288233
    // );

    this.camera.instance.quaternion.set(
      -0.19696916101934828,
      0.6791181468372861,
      0.19696982766009027,
      0.679120445307884
    );

    console.log(this.camera.modes.debug.instance.position);
  }

  cameraFollow() {
    this.time.on('tick', () => {
      if (this.world.char) {
        const characterDetails = this.world.char;
        gsap.to(this.cameraCoords, {
          duration: 0.1,
          x: characterDetails.model.position.x + 30,
        });
        // gsap.to(this.cameraCoords, {
        //   duration: 0.1,
        //   y: characterDetails.model.position.y + 30,
        // });
        gsap.to(this.cameraCoords, {
          duration: 0.1,
          z: characterDetails.model.position.z,
        });

        // this.cameraCoords.x = characterDetails.model.position.x + 30;
        // this.cameraCoords.y = characterDetails.model.position.y + 30;
        // this.cameraCoords.z = characterDetails.model.position.z;

        // Causes jitter
        // this.camera.instance.lookAt(
        //   new THREE.Vector3(
        //     characterDetails.model.position.x,
        //     characterDetails.model.position.y,
        //     characterDetails.model.position.z
        //   )
        // );
        // console.log(this.camera.instance.quaternion);
      }

      // this.camera.modes.debug.instance.position.set(
      //   this.cameraCoords.x,
      //   this.cameraCoords.y,
      //   this.cameraCoords.z
      // );

      this.camera.instance.position.set(
        this.cameraCoords.x,
        this.cameraCoords.y,
        this.cameraCoords.z
      );
    });
  }

  setConfig() {
    this.config = {};

    // Debug
    this.config.debug = window.location.hash === '#debug';

    // Pixel ratio
    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);

    // Width and height
    const boundings = this.targetElement.getBoundingClientRect();
    this.config.width = boundings.width;
    this.config.height = boundings.height || window.innerHeight;
  }

  setStats() {
    if (this.config.debug) {
      this.stats = new Stats(true);
    }
  }

  setScene() {
    this.scene = new THREE.Scene();
  }

  setCamera() {
    this.camera = new Camera();
  }

  setRenderer() {
    this.renderer = new Renderer({ rendererInstance: this.rendererInstance });

    this.targetElement.appendChild(this.renderer.instance.domElement);
  }

  setResources() {
    this.resources = new Resources(assets);
  }

  setWorld() {
    this.world = new World();
  }

  update() {
    if (this.stats) this.stats.update();

    this.camera.update();

    if (this.world) this.world.update();

    if (this.renderer) this.renderer.update();

    window.requestAnimationFrame(() => {
      this.update();
    });
  }

  resize() {
    // Config
    const boundings = this.targetElement.getBoundingClientRect();
    this.config.width = boundings.width;
    this.config.height = boundings.height;

    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);

    if (this.camera) this.camera.resize();

    if (this.renderer) this.renderer.resize();

    if (this.world) this.world.resize();
  }

  destroy() {}
}
