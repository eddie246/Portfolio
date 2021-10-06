import * as THREE from 'three';
import * as dat from 'dat.gui';
import Experience from './Experience.js';

import Char from './char.js';
import Companion from './companion.js';

import Physics from './physics.js';

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;

    //DEBUG MENU ONLY
    this.gui = new dat.GUI();

    this.resources.on('groupEnd', (_group) => {
      this.physics = new Physics(this.time, this.resources);
      if (_group.name === 'base') {
        this.setDummy();

        this.setLight();
      }
    });
  }

  setDummy() {
    this.char = new Char(this.resources, this.physics, this.time);
    this.companion = new Companion(this.resources, this.time, this.char);
    this.scene.add(this.char.model, this.companion.model);

    const floor = new THREE.Group();

    const diner = this.resources.items.dinerModel.scene;
    const apartments = this.resources.items.apartmentsModel.scene;
    const gas = this.resources.items.gasModel.scene;
    const construction = this.resources.items.constructionModel.scene;
    const floorPlane = this.resources.items.floorModel.scene;
    const grass = this.resources.items.grassModel.scene;

    floor.add(diner, apartments, gas, construction, grass, floorPlane);

    this.resources.items.dinerTexture.flipY = false;
    this.resources.items.apartmentsTexture.flipY = false;
    this.resources.items.gasTexture.flipY = false;
    this.resources.items.constructionTexture.flipY = false;
    this.resources.items.floorTexture.flipY = false;
    this.resources.items.grassTexture.flipY = false;
    this.resources.items.dandelionTexture.flipY = false;
    this.resources.items.pFlowerTexture.flipY = false;

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

    const grassMaterial = new THREE.MeshStandardMaterial({
      color: '#53a113',
      map: this.resources.items.grassTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    grassMaterial.blending = THREE.CustomBlending;
    grassMaterial.blendSrc = THREE.OneFactor;
    grassMaterial.blendDst = THREE.OneMinusSrcAlphaFactor;

    const dandelionMaterial = new THREE.MeshStandardMaterial({
      // color: '#aaaaaa',
      map: this.resources.items.dandelionTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      metalness: 0,
    });

    const pFlowerMaterial = new THREE.MeshStandardMaterial({
      // color: '#aaaaaa',
      map: this.resources.items.pFlowerTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      flatShading: true,
    });

    dandelionMaterial.blending = THREE.CustomBlending;
    dandelionMaterial.blendSrc = THREE.OneFactor;
    dandelionMaterial.blendDst = THREE.OneMinusSrcAlphaFactor;

    diner.traverse((child) => {
      child.material = dinerMaterial;
    });
    apartments.traverse((child) => {
      child.material = apartmentsMaterial;
    });
    gas.traverse((child) => {
      child.material = gasMaterial;
    });
    construction.traverse((child) => {
      child.material = constructionMaterial;
    });
    floorPlane.traverse((child) => {
      child.material = floorMaterial;
    });
    grass.traverse((child) => {
      if (child.name[0] === 'G') {
        child.material = grassMaterial;
      } else if (child.name[0] === 'D') {
        console.log(child);
        child.material = dandelionMaterial;
        console.log(child.material);
      } else if (child.name[0] === 'P') {
        child.material = pFlowerMaterial;
      } else if (child.name[0] === 'T') {
        console.log('text', child);
        child.material.metalness = 0;
        child.material.color = new THREE.Color('white');
      }
    });

    console.log(floor);
    floor.rotation.y = Math.PI / 2;

    // const floor = new THREE.Mesh(
    this.scene.add(floor);
  }

  setLight() {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
    this.scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1a381a, 1);
    hemiLight.position.set(3, 6.25, 7);
    this.scene.add(hemiLight);

    // const directionalLight = new THREE.DirectionalLight(0x404040, 2);
    // directionalLight.position.set(27.49, 38.32, 23.15);
    // directionalLight.lookAt(new THREE.Vector3(0, -60, 20));
    // this.scene.add(directionalLight);

    this.parameters = { color: 0xffffff, groundColor: 0x2600 };
    this.gui.add(hemiLight.position, 'x', -10, 10, 0.01).name('hemi x');
    this.gui.add(hemiLight.position, 'y', -0, 10, 0.01).name('hemi y');
    this.gui.add(hemiLight.position, 'z', -10, 10, 0.01).name('directional z');

    this.gui
      .addColor(this.parameters, 'color')
      .onChange(() => hemiLight.color.set(this.parameters.color));
    this.gui
      .addColor(this.parameters, 'groundColor')
      .onChange(() => hemiLight.groundColor.set(this.parameters.groundColor));
  }

  resize() {}

  update() {}

  destroy() {}
}
