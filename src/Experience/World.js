//THREE
import * as THREE from 'three';
import * as dat from 'dat.gui';
import Experience from './Experience.js';

import Char from './char.js';
import Companion from './companion.js';

//PHYSICS
import * as CANNON from 'cannon-es';

import Physics from './physics.js';
import Foliage from './Foliage.js';
import Text from './Text.js';

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;

    //DEBUG MENU ONLY
    // this.gui = new dat.GUI();

    this.resources.on('groupEnd', (_group) => {
      this.physics = new Physics(this.time, this.resources);

      if (_group.name === 'base') {
        this.setWorld();

        this.setLight();
      }
    });
  }

  setWorld() {
    this.char = new Char(this.resources, this.physics, this.time);
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

    // for (const child of text.children) {
    //   if (child.name === 'Skills') {
    //     const textBox = new CANNON.Box(new CANNON.Vec3(1.7, 0.5, 0.5));

    //     const body = new CANNON.Body({
    //       mass: 1,
    //       position: new CANNON.Vec3(0, 4, 0),
    //       shape: textBox,
    //       material: this.physics.defaultMaterial,
    //     });

    //     this.scene.add(child);

    //     this.physics.world.addBody(body);

    //     this.physics.updatePhysics(
    //       {
    //         mesh: child,
    //         body: body,
    //       },
    //       {
    //         all: true,
    //       }
    //     );
    //   }
    //   if (child.name === 'TechStack') {
    //     const textBox = new CANNON.Box(new CANNON.Vec3(1.7, 0.5, 0.5));

    //     const body = new CANNON.Body({
    //       mass: 1,
    //       position: new CANNON.Vec3(2, 4, 2),
    //       shape: textBox,
    //       material: this.physics.defaultMaterial,
    //     });

    //     this.scene.add(child);

    //     this.physics.world.addBody(body);

    //     this.physics.updatePhysics(
    //       {
    //         mesh: child,
    //         body: body,
    //       },
    //       {
    //         all: true,
    //       }
    //     );
    //   }
    // }

    floor.rotation.y = Math.PI / 2;

    // const floor = new THREE.Mesh(
    this.scene.add(floor);
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
