import * as THREE from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { gsap } from 'gsap';

import Objects from './objects';

import * as dat from 'dat.gui';

export default class Experience {
  constructor() {
    this.setScene();
    this.setCamera();
    this.setRenderer();
    this.setControls();

    this.objects = new Objects(this.scene, this.sceneCss);

    window.addEventListener('resize', () => {
      // console.log(
      //   window.outerWidth,
      //   window.innerHeight
      //   // document.documentElement.scrollHeight
      // );
      // this.sizes = {
      //   current: window.outerHeight,
      //   future: document.documentElement.scrollHeight,
      // };

      // this.camera.aspect =
      //   window.outerWidth / document.documentElement.scrollHeight;
      this.camera.aspect = window.outerWidth / window.outerHeight;
      this.camera.updateProjectionMatrix();

      //update this.renderer
      this.renderer.setSize(window.outerWidth, window.outerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      this.rendererCss.setSize(window.outerWidth, window.outerHeight);
    });

    this.setTick();
    this.keyListener();
  }

  keyListener() {
    window.addEventListener('keydown', (e) => {
      console.log(e.code);
    });
  }

  setScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#1F2833');

    this.sceneCss = new THREE.Scene();
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.outerWidth / window.outerHeight,
      0.1,
      100
    );
    this.camera.position.set(-1.27, 3.58, 2.29);
    this.camera.layers.enable(1);

    this.camera.lookAt(new THREE.Vector3(0.06, 1.76, -0.8));
    this.scene.add(this.camera);
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    this.renderer.setClearColor(0xffffff, 0);
    this.renderer.setSize(window.outerWidth, window.outerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(this.renderer.domElement);
    this.renderer.domElement.classList.add('background-canvas');

    this.rendererCss = new CSS3DRenderer();
    this.rendererCss.setSize(window.outerWidth, window.outerHeight);
    this.rendererCss.domElement.style.position = 'absolute';
    this.rendererCss.domElement.style.top = 0;
    document.body.appendChild(this.rendererCss.domElement);
  }

  setControls() {
    window.addEventListener('mousemove', (e) => {
      gsap.to(this.camera.position, {
        x: e.clientX / window.outerWidth - 0.5 - 1.27,
        duration: 0.5,
      });
      gsap.to(this.camera.position, {
        z: e.clientY / window.outerHeight - 0.5 + 2.29,
        duration: 0.5,
      });

      this.objects.mouse.position.z =
        0.246 + (e.clientY / window.outerHeight - 0.5) * 0.8;
      this.objects.mouse.position.x =
        1.5 + (e.clientX / window.outerWidth - 0.5) * 0.8;

      gsap.to(this.objects.youtube.position, {
        x: -1.2 - e.clientX / window.outerWidth - 0.5,
        duration: 0.5,
      });
      gsap.to(this.objects.youtube.position, {
        z: -1.5 - e.clientY / window.outerHeight - 0.5,
        duration: 0.5,
      });

      // this.objects.youtube.position.x =
      //   -1.2 - e.clientX / window.outerWidth - 0.5;
      // this.objects.youtube.position.z =
      //   -0.7 - e.clientY / window.outerHeight - 0.5;
    });
  }

  setTick() {
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Render
      this.renderer.render(this.scene, this.camera);
      this.rendererCss.render(this.sceneCss, this.camera);

      if (this.objects.cubeCamera1) {
        this.objects.cubeCamera1.update(this.renderer, this.scene);
      }

      for (const item of this.objects.rotate) {
        item.rotation.z += 0.08;
      }

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }
}
