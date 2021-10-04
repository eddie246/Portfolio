import * as THREE from "three";
import Experience from "./Experience.js";

import Char from "./char.js";
import Companion from "./companion.js";

import Physics from "./physics.js";

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;

    this.resources.on("groupEnd", (_group) => {
      this.physics = new Physics(this.time, this.resources);
      if (_group.name === "base") {
        this.setDummy();
      }

      this.setLight();
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
    this.resources.items.grassTexture.anisotropy = 0;
    // this.resources.items.grassTexture.magFilter = THREE.NearestFilter;
    // this.resources.items.grassTexture.minFilter = THREE.NearestFilter;

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

    const grassMaterial = new THREE.MeshBasicMaterial({
      color: "#53a113",
      map: this.resources.items.grassTexture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    grassMaterial.blending = THREE.CustomBlending;
    grassMaterial.blendSrc = THREE.OneFactor;
    grassMaterial.blendDst = THREE.OneMinusSrcAlphaFactor;

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
      console.log(child);
      child.material = grassMaterial;
    });

    console.log("grass", this.resources.items.grassTexture);

    console.log(floor);
    floor.rotation.y = Math.PI / 2;

    // const floor = new THREE.Mesh(
    this.scene.add(floor);
  }

  setLight() {
    const ambientLight = new THREE.AmbientLight(0x404040, 3);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0x404040, 2);
    directionalLight.position.set(0, 30, 20);
    console.log(directionalLight);
    this.scene.add(directionalLight);
  }

  resize() {}

  update() {}

  destroy() {}
}
