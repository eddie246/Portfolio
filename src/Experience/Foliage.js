import * as THREE from 'three';

//Shaders
import foliageVertexShader from './Shaders/Grass/vertex.glsl';
import foliageFragmentShader from './Shaders/Grass/fragment.glsl';

import treeVertexShader from './Shaders/Tree/vertex.glsl';
import treeFragmentShader from './Shaders/Tree/fragment.glsl';

export default class Foliage {
  constructor(scene, resources, time) {
    this.scene = scene;
    this.resources = resources;
    this.time = time;

    this.grass = this.resources.items.grassModel.scene;
    this.materials = {};

    this.setFoliage();
    this.updateShaders();
  }

  setFoliage() {
    this.scene.add(this.resources.items.grassModel.scene);
    this.setGrass();
    this.setDandelion();
    this.setPFlower();
    this.setBush();

    this.applyMaterial();
  }

  applyMaterial() {
    this.grass.traverse((child) => {
      if (child.name[0] === 'G') {
        child.material = this.materials.grassMaterial;
      } else if (child.name[0] === 'D') {
        child.material = this.materials.dandelionMaterial;
      } else if (child.name[0] === 'P') {
        child.material = this.materials.pFlowerMaterial;
      } else if (child.name[0] === 'W' || child.name[0] === 'B') {
        child.material = this.materials.bushMaterial;
      } else if (child.name[0] === 'L') {
        child.material = new THREE.MeshBasicMaterial({
          map: this.resources.items.floorTexture,
        });
      } else if (child.name[0] === 'F') {
        child.material = this.materials.bushMaterial;
      }
    });
  }

  setGrass() {
    this.resources.items.grassTexture.flipY = false;
    const grassMaterial = new THREE.ShaderMaterial({
      vertexShader: foliageVertexShader,
      fragmentShader: foliageFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#53a113') },
        uTexture: { value: this.resources.items.grassTexture },
      },
    });

    grassMaterial.blending = THREE.CustomBlending;
    grassMaterial.blendSrc = THREE.OneFactor;
    grassMaterial.blendDst = THREE.OneMinusSrcAlphaFactor;

    this.materials.grassMaterial = grassMaterial;
  }

  setDandelion() {
    this.resources.items.dandelionTexture.flipY = false;
    const dandelionMaterial = new THREE.ShaderMaterial({
      vertexShader: foliageVertexShader,
      fragmentShader: foliageFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#ffffff') },
        uTexture: { value: this.resources.items.dandelionTexture },
      },
    });

    dandelionMaterial.blending = THREE.CustomBlending;
    dandelionMaterial.blendSrc = THREE.OneFactor;
    dandelionMaterial.blendDst = THREE.OneMinusSrcAlphaFactor;

    this.materials.dandelionMaterial = dandelionMaterial;
  }

  setPFlower() {
    this.resources.items.pFlowerTexture.flipY = false;
    const pFlowerMaterial = new THREE.ShaderMaterial({
      vertexShader: foliageVertexShader,
      fragmentShader: foliageFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#ffffff') },
        uTexture: { value: this.resources.items.pFlowerTexture },
      },
    });

    this.materials.pFlowerMaterial = pFlowerMaterial;
  }

  setBush() {
    this.resources.items.floorTexture.flipY = false;
    const bushMaterial = new THREE.ShaderMaterial({
      vertexShader: treeVertexShader,
      fragmentShader: treeFragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#ffffff') },
        uTexture: { value: this.resources.items.floorTexture },
      },
    });

    this.materials.bushMaterial = bushMaterial;
  }

  updateShaders() {
    this.time.on('tick', () => {
      for (const material in this.materials) {
        this.materials[material].uniforms.uTime.value = this.time.elapsed;
      }
    });
  }
}
