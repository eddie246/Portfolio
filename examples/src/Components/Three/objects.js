import * as THREE from 'three';
import * as dat from 'dat.gui';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

import fanVertexShader from '../Three/shaders/fan/vertex.glsl';
import fanFragmentShader from '../Three/shaders/fan/fragment.glsl';

export default class Objects {
  constructor(scene, sceneCss) {
    this.scene = scene;
    this.sceneCss = sceneCss;

    this.rotate = [];
    this.links = [
      { href: 'https://www.eddie-wang.dev/', src: '/assets/textures/home.jpg' },
      { src: '/assets/textures/setup.jpg' },
    ];
    this.showing = 0;

    this.setLoader();
    this.setDesk();
    this.setWide();
    this.setVert();
    this.setLight();
  }

  setLoader() {
    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();
  }

  setDesk() {
    const setupTexture = this.textureLoader.load(
      '/assets/textures/setupdlt.jpg'
    );
    setupTexture.flipY = false;

    const basicMaterial = new THREE.MeshBasicMaterial({
      map: setupTexture,
    });

    const emissiveGreen = new THREE.MeshBasicMaterial({
      color: '#55FF5D',
    });
    const emissiveWhite = new THREE.MeshBasicMaterial({
      color: '#fff',
    });

    this.gltfLoader.load('/assets/models/myroom.glb', (model) => {
      model.scene.traverse((child) => {
        if (child.material) {
          if (child.name.includes('Glass')) {
            child.visible = false;
          } else if (child.name.includes('BladeV')) {
            child.material = basicMaterial;
            this.rotate.push(child);
          } else if (child.name === 'RTX') {
            child.material = emissiveGreen;
          } else if (child.name === 'AIO') {
            child.material = emissiveWhite;
          } else {
            child.material = basicMaterial;
          }

          if (
            child.name === 'Base' ||
            child.name === 'MB' ||
            child.name === 'CPU' ||
            child.name.includes('Blade') ||
            child.name.includes('Glass')
          ) {
            child.layers.set(1);
          }

          if (child.name === 'Mouse') {
            this.mouse = child;
          }
        }
      });

      // mirror test
      const transparentReflector = `uniform vec3 color;
		  uniform sampler2D tDiffuse;
		  varying vec4 vUv;

		  #include <logdepthbuf_pars_fragment>

		  float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		  }

		  vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		  }

		  void main() {

			  #include <logdepthbuf_fragment>

			  vec4 base = texture2DProj( tDiffuse, vUv );
			  gl_FragColor = vec4( blendOverlay( base.rgb, color ), 0.12 );
		}`;

      const largeGlass = new THREE.PlaneGeometry(1.2, 1.1);
      const largeMirror = new Reflector(largeGlass, {
        clipBias: 0.003,
        textureWidth: window.innerWidth,
        textureHeight: window.innerHeight,
        color: 0xffffff,
      });

      largeMirror.rotation.y = -Math.PI / 2;
      largeMirror.material.transparent = true;
      largeMirror.material.fragmentShader = transparentReflector;
      largeMirror.position.set(1.5, 2.29, 0);

      const tallGlass = new THREE.PlaneGeometry(0.55, 1.15);
      const tallMirror = new Reflector(tallGlass, {
        clipBias: 0.003,
        textureWidth: window.innerWidth,
        textureHeight: window.innerHeight,
        color: 0xffffff,
      });

      tallMirror.material.transparent = true;
      tallMirror.material.fragmentShader = transparentReflector;
      tallMirror.position.set(1.8, 2.29, 0.63);

      model.scene.scale.set(0.5, 0.5, 0.5);
      this.scene.add(model.scene, largeMirror, tallMirror);
    });
  }

  setWide() {
    for (let i = 0; i < this.links.length; i++) {
      this.links[i].image = this.textureLoader.load(this.links[i].src);
      this.links[i].image.flipY = false;
      this.gltfLoader.load('/assets/models/widescreen.glb', (model) => {
        model.scene.scale.set(0.5, 0.5, 0.5);
        model.scene.children[0].material = new THREE.MeshBasicMaterial({
          map: this.links[i].image,
          transparent: true,
        });
        this.links[i].model = model.scene;
        if (i !== 0) model.scene.children[0].material.opacity = 0;
        this.scene.add(model.scene);
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.links[this.showing++].model.children[0].material.opacity = 0;
        if (this.links[this.showing] === undefined) {
          this.showing = 0;
        }
        this.links[this.showing].model.children[0].material.opacity = 1;
      }
    });
  }

  setVert() {
    // var element = document.createElement('div');
    // element.style.width = '100px';
    // element.style.height = '100px';
    // element.style.opacity = 1.0;
    // element.style.background = new THREE.Color(
    //   Math.random() * 0xff0000
    // ).getStyle();

    // var object = new CSS3DObject(element);
    // object.position.set(1, 2, 0);
    // this.sceneCss.add(object);
    function Element(id, x, y, z, ry) {
      const div = document.createElement('div');
      div.style.width = '480px';
      div.style.height = '720px';
      div.style.backgroundColor = '#000';

      const iframe = document.createElement('iframe');
      iframe.style.width = '480px';
      iframe.style.height = '720px';
      iframe.style.border = '0px';
      iframe.src = ['https://www.youtube.com/embed/', id, '?rel=0'].join('');
      div.appendChild(iframe);

      const object = new CSS3DObject(div);
      object.position.set(x, y, z);
      object.scale.set(0.00327, 0.00328, 0.0031);
      object.rotation.y = ry;
      // object.rotation.x += 0.1;

      return object;
    }

    this.youtube = new Element('5qap5aO4i9A', -2.3, 1.53, -1.5, Math.PI / 4.55);

    this.sceneCss.add(this.youtube);
  }

  setLight() {
    // const light = new THREE.AmbientLight(0xffffff, 0.3);
    const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.8);
    this.scene.add(light);
  }
}
