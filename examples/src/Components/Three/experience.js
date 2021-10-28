import * as THREE from 'three';

export default class Experience {
  constructor() {
    this.setScene();
    this.setCamera();
    this.setRenderer();

    window.addEventListener('resize', () => {
      this.camera.aspect =
        window.innerWidth / document.documentElement.scrollHeight;
      this.camera.updateProjectionMatrix();

      //update this.renderer
      this.renderer.setSize(
        window.innerWidth,
        document.documentElement.scrollHeight
      );
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    //Objects
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
    this.camera.position.z = 5;

    /**
     * Animate
     */
    this.setTick();
    // === THREE.JS EXAMPLE CODE END ===
  }

  setScene() {
    this.scene = new THREE.Scene();
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / document.documentElement.scrollHeight,
      0.1,
      100
    );
    this.camera.position.z = 3;
    this.scene.add(this.camera);
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setClearColor(0xffffff, 0);
    this.renderer.setSize(
      window.innerWidth,
      document.documentElement.scrollHeight
    );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(this.renderer.domElement);
    this.renderer.domElement.classList.add('background-canvas');
  }

  setControls() {
    // // Controls
    // const controls = new OrbitControls(this.camera, this.renderer.domElement);
    // controls.enableDamping = true;
  }

  setTick() {
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // // Update controls
      // controls.update();

      // Animate Test
      // this.camera.rotation.z = Math.sin(elapsedTime);

      // Render
      this.renderer.render(this.scene, this.camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }
}
