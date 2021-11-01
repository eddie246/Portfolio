import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

export default class Objects {
  constructor(scene, sceneCss, raycast) {
    this.scene = scene;
    this.sceneCss = sceneCss;
    this.raycast = raycast;

    this.rotate = [];
    this.links = [
      {
        href: 'https://www.eddie-wang.dev/',
        src: '/assets/textures/home.jpg',
        name: 'homepage',
      },
      {
        src: '/assets/textures/all.jpg',
        name: 'test',
        href: '#',
      },
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
        textureWidth: 480,
        textureHeight: 480,
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
          // transparent: true,
        });
        model.scene.children[0].url = this.links[i].href;
        model.scene.children[0].name = `${this.links[i].name}`;
        this.links[i].model = model.scene;
        if (i !== 0) {
          model.scene.children[0].material.opacity = 0;
          // model.scene.visible = false;
          model.scene.position.y += 2;
        }
        this.scene.add(model.scene);
        this.raycast.objToDetect.push(model.scene.children[0]);
      });
    }

    const gradientVertex = `
      varying vec3 vUv; 

      void main() {
      vUv = position; 

   
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `;
    const fragmentVertex = `
      uniform vec3 vlak3color1;
      uniform vec3 vlak3color2;

      varying vec3 vUv;
        void main() {
        // y < 0 = transparent, > 1 = opaque
        float alpha = smoothstep(-0.15, 0.2, vUv.x);
          
        // y < 1 = color1, > 2 = color2
        float colorMix = smoothstep(1.0, 2.0, vUv.x);
          
        gl_FragColor = vec4(mix(vlak3color1, vlak3color2, colorMix), alpha);
      }`;

    const rightPlane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(0.3, 0.94),
      new THREE.ShaderMaterial({
        type: 'next',
        transparent: true,
        uniforms: {
          vlak3color1: { value: new THREE.Color('black') },
          vlak3color2: { value: new THREE.Color('black') },
        },
        vertexShader: gradientVertex,
        fragmentShader: fragmentVertex,
      })
    );
    rightPlane.type = 'next';
    rightPlane.position.set(1.21, 2.556, -0.52);
    rightPlane.rotation.y = -0.15;

    const leftPlane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(0.3, 0.94),
      new THREE.ShaderMaterial({
        type: 'prev',
        transparent: true,
        uniforms: {
          vlak3color1: { value: new THREE.Color('black') },
          vlak3color2: { value: new THREE.Color('black') },
        },
        vertexShader: gradientVertex,
        fragmentShader: fragmentVertex,
        side: THREE.BackSide,
      })
    );
    leftPlane.type = 'prev';
    leftPlane.position.set(-1.127, 2.556, -0.515);
    leftPlane.rotation.y = 3.3;

    this.scene.add(rightPlane, leftPlane);
    this.raycast.objToDetect.push(rightPlane, leftPlane);

    this.nextScreen = () => {
      this.links[this.showing].model.children[0].material.opacity = 0;
      this.links[this.showing++].model.position.y += 2;
      // this.links[this.showing++].model.visible = false;
      if (this.links[this.showing] === undefined) {
        this.showing = 0;
      }
      this.links[this.showing].model.children[0].material.opacity = 1;
      // this.links[this.showing].model.visible = true;
      this.links[this.showing].model.position.y -= 2;
    };

    this.prevScreen = () => {
      this.links[this.showing].model.children[0].material.opacity = 0;
      this.links[this.showing--].model.position.y += 2;
      // this.links[this.showing++].model.visible = false;
      if (this.links[this.showing] === undefined) {
        this.showing = this.links.length - 1;
      }
      this.links[this.showing].model.children[0].material.opacity = 1;
      // this.links[this.showing].model.visible = true;
      this.links[this.showing].model.position.y -= 2;
    };

    window.addEventListener('click', () => {
      if (this.raycast.intersects.length) {
        if (this.raycast.intersects[0].object.type === 'next') {
          this.nextScreen();
        } else if (this.raycast.intersects[0].object.type === 'prev') {
          this.prevScreen();
        } else {
          if (this.raycast.intersects[0].object.url === '#') {
          } else {
            window.open(this.raycast.intersects[0].object.url, '_blank');
          }
        }
      }
    });

    window.addEventListener('mousemove', () => {
      if (this.raycast.intersects.length > 0) {
        leftPlane.visible = true;
        rightPlane.visible = true;
      } else {
        leftPlane.visible = false;
        rightPlane.visible = false;
      }
    });
  }

  setVert() {
    function Element(id, x, y, z, ry) {
      const div = document.createElement('div');
      div.style.width = '480px';
      div.style.height = '720px';
      div.style.backgroundColor = '#000';

      const search = document.createElement('input');
      search.placeholder = 'Input URL Here';
      search.style.width = '470px';
      search.style.backgroundColor = '#181818';
      search.style.color = '#ddd';
      search.style.border = 'none';
      div.appendChild(search);

      const iframe = document.createElement('iframe');
      iframe.style.width = '480px';
      iframe.style.height = '700px';
      iframe.style.border = '0px';
      iframe.src = ['https://www.youtube.com/embed/', id, '?rel=0'].join('');
      div.appendChild(iframe);

      search.addEventListener('keydown', (e) => {
        if (e.code === 'Enter') {
          if (search.value.includes('https://')) {
            iframe.src = search.value;
          } else {
            iframe.src = `https://${search.value}`;
          }

          search.value = iframe.src;
        }
      });

      const object = new CSS3DObject(div);
      object.position.set(x, y, z);
      object.scale.set(0.00326, 0.00328, 0.0031);
      object.rotation.y = ry;

      return object;
    }

    this.youtube = new Element('5qap5aO4i9A', -2.2, 1.53, -2.5, Math.PI / 4.55);

    this.sceneCss.add(this.youtube);
  }

  setLight() {
    const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.8);
    this.scene.add(light);
  }
}
