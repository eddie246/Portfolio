//THREE
import * as THREE from 'three';
import Experience from './Experience.js';

import Char from './char.js';
import Companion from './companion.js';

import gsap from 'gsap';

import Physics from './physics.js';
import Foliage from './Foliage.js';
import Text from './Text.js';

import interactVertexShader from './Shaders/Interact/vertex.glsl';
import interactFragmentShader from './Shaders/Interact/fragment.glsl';

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;

    this.setLoading();
    this.setLight();

    this.resources.on('groupEnd', (_group) => {
      this.physics = new Physics(this.time, this.resources, this.scene);

      if (_group.name === 'base') {
        // this.experience.loaded = true;
        this.setWorld();
      }
    });
  }

  setLoading() {
    const fontLoader = new THREE.FontLoader();
    fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new THREE.TextBufferGeometry('Loading...', {
        font,
        size: 0.5,
        height: 0.2,
        curveSegments: 6,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
      });
      textGeometry.center();

      const loadingBar = new THREE.Mesh(
        // new THREE.BoxBufferGeometry(5, 1, 1),
        textGeometry,
        new THREE.MeshStandardMaterial()
      );

      loadingBar.position.set(18, 142.7, 30);
      loadingBar.rotation.y = Math.PI / 2.5;
      loadingBar.scale.x = 0.01;

      this.resources.loader.on('fileEnd', () => {
        const loadingProgress = this.resources.loader.currentLoading;

        gsap.to(loadingBar.scale, {
          x: loadingProgress[1] / loadingProgress[0],
          duration: 0.8,
        });

        if (loadingProgress[1] / loadingProgress[0] === 1) {
          const complete = new THREE.TextBufferGeometry('Complete!', {
            font,
            size: 0.5,
            height: 0.2,
            curveSegments: 6,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 4,
          });

          complete.center();
          loadingBar.geometry = complete;

          window.setTimeout(() => {
            this.experience.loaded = true;
            this.scene.remove(loadingBar);
          }, 2000);
        }
      });

      this.scene.add(loadingBar);
    });
  }

  setWorld() {
    this.experience.setTouch();
    this.char = new Char(
      this.resources,
      this.physics,
      this.time,
      this.experience.touch
    );
    this.companion = new Companion(this.resources, this.time, this.char);
    this.scene.add(this.char.model, this.companion.model);

    const floor = new THREE.Group();

    const diner = this.resources.items.dinerModel.scene;
    const apartments = this.resources.items.apartmentsModel.scene;
    const gas = this.resources.items.gasModel.scene;
    const construction = this.resources.items.constructionModel.scene;
    const floorPlane = this.resources.items.floorModel.scene;

    this.scene.add(diner, apartments, gas, construction, floorPlane);
    this.foliage = new Foliage(this.scene, this.resources, this.time);
    this.text = new Text(this.scene, this.resources, this.physics);

    this.resources.items.dinerTexture.flipY = false;
    this.resources.items.apartmentsTexture.flipY = false;
    this.resources.items.gasTexture.flipY = false;
    this.resources.items.constructionTexture.flipY = false;
    this.resources.items.floorTexture.flipY = false;

    const dinerMaterial = new THREE.MeshBasicMaterial({
      map: this.resources.items.dinerTexture,
    });
    const apartmentsMaterial = new THREE.MeshBasicMaterial({
      map: this.resources.items.apartmentsTexture,
    });
    const gasMaterial = new THREE.MeshBasicMaterial({
      map: this.resources.items.gasTexture,
    });
    const constructionMaterial = new THREE.MeshBasicMaterial({
      map: this.resources.items.constructionTexture,
    });
    const floorMaterial = new THREE.MeshBasicMaterial({
      map: this.resources.items.floorTexture,
    });

    diner.traverse((child) => {
      if (child.material) child.material = dinerMaterial;
    });
    apartments.traverse((child) => {
      if (child.material) child.material = apartmentsMaterial;
    });
    gas.traverse((child) => {
      if (child.material) child.material = gasMaterial;
    });
    construction.traverse((child) => {
      if (child.material) child.material = constructionMaterial;
    });
    floorPlane.traverse((child) => {
      if (child.material) child.material = floorMaterial;
    });

    this.setRay(floorPlane.children, floorMaterial);

    floor.rotation.y = Math.PI / 2;

    this.scene.add(floor);
  }

  setRay(objectsToTest, defaultMaterial) {
    const raycaster = new THREE.Raycaster();

    const mouse = new THREE.Vector2();
    window.addEventListener('mousemove', (e) => {
      mouse.x = (e.clientX / this.experience.sizes.width) * 2 - 1;
      mouse.y = -(e.clientY / this.experience.sizes.height) * 2 + 1;
    });

    const interactMaterial = new THREE.ShaderMaterial({
      vertexShader: interactVertexShader,
      fragmentShader: interactFragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#222222') },
        uTexture: { value: this.resources.items.floorTexture },
      },
    });

    let currentIntersect = null;

    this.time.on('tick', () => {
      raycaster.setFromCamera(mouse, this.experience.camera.instance);
      const intersects = raycaster.intersectObjects(objectsToTest);

      if (intersects.length > 1) {
        if (currentIntersect === null) {
          currentIntersect = intersects[0];

          if (
            currentIntersect.object.name === 'twitter_logo' ||
            currentIntersect.object.name === 'LinkedIn' ||
            currentIntersect.object.name === 'Mailbox' ||
            currentIntersect.object.name === 'Github'
          ) {
            document.body.style.cursor = 'pointer';
            currentIntersect.object.material = interactMaterial;
          }

          console.log('enter');
        }
      } else {
        if (currentIntersect) {
          currentIntersect = null;
          document.body.style.cursor = '';

          for (const item of objectsToTest) {
            item.material = defaultMaterial;
          }
        }
      }

      interactMaterial.uniforms.uTime.value = this.time.elapsed;
    });

    window.addEventListener('click', (e) => {
      if (currentIntersect && this.experience.loaded) {
        if (currentIntersect.object.name === 'twitter_logo') {
          window.open('https://twitter.com/eddiewang246', '_blank').focus();
        } else if (currentIntersect.object.name === 'LinkedIn') {
          window
            .open('https://www.linkedin.com/in/eddie-wang2/', '_blank')
            .focus();
        } else if (currentIntersect.object.name === 'Mailbox') {
          window.location.href = 'mailto:eddiewang12345@gmail.com';
        } else if (currentIntersect.object.name === 'Github') {
          window.open('https://github.com/eddie246', '_blank').focus();
        }

        if (this.experience.touch) {
          mouse.x = 0;
          mouse.y = 0;
        }
      }
    });
  }

  setLight() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    this.scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x0, 0.6);
    hemiLight.position.set(3, 6.25, 7);
    const hemiLight2 = new THREE.HemisphereLight(0xffffff, 0xdbffdb, 0.3);
    hemiLight2.position.set(3, 6.25, 7);
    this.scene.add(hemiLight, hemiLight2);

    // const directionalLight = new THREE.DirectionalLight(0x404040, 2);
    // directionalLight.position.set(27.49, 38.32, 23.15);
    // directionalLight.lookAt(new THREE.Vector3(0, -60, 20));
    // this.scene.add(directionalLight);

    //Dat gui debug

    // this.parameters = { color: 0xffffff, groundColor: 0x2600 };
    // this.gui.add(hemiLight.position, 'x', -10, 10, 0.01).name('hemi x');
    // this.gui.add(hemiLight.position, 'y', -0, 10, 0.01).name('hemi y');
    // this.gui.add(hemiLight.position, 'z', -10, 10, 0.01).name('directional z');

    // this.gui
    //   .addColor(this.parameters, 'color')
    //   .onChange(() => hemiLight.color.set(this.parameters.color));
    // this.gui
    //   .addColor(this.parameters, 'groundColor')
    //   .onChange(() => hemiLight.groundColor.set(this.parameters.groundColor));
  }

  resize() {}

  update() {}

  destroy() {}
}
