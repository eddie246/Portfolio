import * as THREE from 'three';
import gsap from 'gsap';

export default class Companion {
  constructor(resources, time, leader) {
    this.resources = resources;
    this.time = time;
    this.leader = leader;

    this.setCompanion();
    this.updateFrame();
    this.eventListeners();

    // this.move();
  }

  setCompanion() {
    /**
     * THREE
     */
    this.model = this.resources.items.dogModel.scene;
    this.model.scale.set(0.5, 0.5, 0.5);
    this.model.children[0].position.y = -2.1;

    this.model.traverse((child) => {
      if (child.material) {
        child.material.metalness = 0;
        if (child.material.name === 'Brown') {
          child.material.color = new THREE.Color('#381F18');
        } else if (child.material.name === 'Beige') {
          child.material.color = new THREE.Color('#E7CC9D');
        }
      }
    });

    /**
     * Companion Animations
     */

    // Animation mixer
    this.animations = this.resources.items.dogModel.animations;
    this.mixer = new THREE.AnimationMixer(this.model);

    // Idle Animation
    this.idleAnimation = this.mixer.clipAction(this.animations[0]);
    this.idleAnimation.play();

    // Walk/Run animation
    this.walkAnimation = this.mixer.clipAction(this.animations[2]);
    this.walkAnimation.play();
    this.walkAnimation.weight = 0;
  }

  eventListeners() {
    window.addEventListener('keydown', (e) => {
      this.animationController();
    });

    window.addEventListener('keyup', (e) => {
      this.animationController();
    });
  }

  updateFrame() {
    this.time.on('tick', () => {
      this.move();

      if (this.mixer) {
        this.mixer.update(this.time.delta / 300);
      }
    });
  }

  animationController(key) {
    if (
      this.leader.keysPressed['KeyW'] ||
      this.leader.keysPressed['KeyA'] ||
      this.leader.keysPressed['KeyS'] ||
      this.leader.keysPressed['KeyD']
    ) {
      gsap.to(this.walkAnimation, { weight: 1, duration: 1 });
      gsap.to(this.idleAnimation, { weight: 0, duration: 1 });
    } else {
      gsap.to(this.idleAnimation, { weight: 1, duration: 3, delay: 0.5 });
      gsap.to(this.walkAnimation, { weight: 0, duration: 1 });
    }
  }

  move() {
    const leader = this.leader.model;
    this.model.position.y = 1;
    gsap.to(this.model.position, {
      x: leader.position.x + 2,
      duration: 0.4,
    });
    gsap.to(this.model.position, {
      z: leader.position.z + 2,
      duration: 0.4,
    });
    gsap.to(this.model.position, {
      y: leader.position.y,
      duration: 0.4,
    });
    this.model.rotation.y = this.leader.playerDirection;
  }
}
