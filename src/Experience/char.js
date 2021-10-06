import * as THREE from 'three';
import gsap from 'gsap';

export default class Character {
  constructor(resources, physics, time) {
    this.resources = resources;
    this.physics = physics;
    this.time = time;

    // Player Details
    this.keysPressed = {};

    this.playerMoveSpeed = 0.5;
    this.maxPlayerMoveSpeed = 1.5;
    console.log(this.time.delta, this.maxPlayerMoveSpeed);

    this.playerDirection = Math.PI / 2;

    this.positionHistory = null;

    // Player Animations
    this.mixer = null;

    this.setCharacter();
    this.eventListeners();
    this.updateFrame();

    // this.moveSpeedBasedOnRefreshrate();
  }

  // moveSpeedBasedOnRefreshrate() {
  //   window.setTimeout(() => {
  //     const playerMoveSpeedFPS = 0.15 * this.time.delta;
  //     if (playerMoveSpeedFPS >= 2.4 || playerMoveSpeedFPS <= 1) {
  //       this.maxPlayerMoveSpeed = 1.5;
  //       this.moveSpeedBasedOnRefreshrate();
  //     } else {
  //       this.maxPlayerMoveSpeed = playerMoveSpeedFPS;
  //     }
  //     console.log(this.maxPlayerMoveSpeed);
  //   }, 1000);
  // }

  updateFrame() {
    this.time.on('tick', () => {
      this.move();
      this.maxPlayerMoveSpeed = 0.15 * this.time.delta;

      if (this.mixer) {
        this.mixer.update(this.time.delta / 800);
      }
    });
  }

  // executeCrossFade(startAction, endAction, duration) {
  //   this.setWeight(endAction, 1);
  //   endAction.time = 0;

  //   startAction.crossFadeTo(endAction, duration, true);
  // }

  setWeight(action, weight) {
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
  }

  setCharacter() {
    /**
     * THREE
     */
    // Character model
    // this.model = this.resources.items.foxModel.scene;
    this.model = this.resources.items.robotModel.scene;
    // this.model = this.resources.items.dogModel.scene;

    /**
     *  Player Animations
     */
    // Animation debugging
    // this.mixer = new THREE.AnimationMixer(this.model);
    // console.log(this.resources.items.dogModel);
    // //Dog walk duration must be 1.25
    // // this.resources.items.dogModel.animations[3].duration = 1.25;
    // const action = this.mixer.clipAction(
    //   this.resources.items.dogModel.animations[3]
    // );

    // action.play();

    // Animation mixer
    this.animations = this.resources.items.robotModel.animations;
    this.mixer = new THREE.AnimationMixer(this.model);
    // console.log(this.animations);

    // Idle Animation
    this.idleAnimation = this.mixer.clipAction(this.animations[1]);
    this.idleAnimation.play();

    // Walk/Run animation
    this.walkAnimation = this.mixer.clipAction(this.animations[5]);
    this.walkAnimation.play();
    this.walkAnimation.weight = 0;

    // Jump animation
    this.jumpAnimation = this.mixer.clipAction(this.animations[2]);
    this.jumpAnimation.repetitions = 1;

    // Punch animation
    this.punchAnimation = this.mixer.clipAction(this.animations[4]);
    this.punchAnimation.repetitions = 1;

    /**
     *  Scene settings
     */
    // Fox
    // this.model.scale.set(0.01, 0.01, 0.01);

    // Robot
    this.model.scale.set(0.5, 0.5, 0.5);
    // this.model.scale.set(0.3, 0.3, 0.3);
    this.model.children[0].position.y = -2;
    this.model.rotation.y = this.playerDirection;

    this.model.traverse((child) => {
      // child.material = new THREE.MeshBasicMaterial();
      if (child.material) {
        // console.log(child.material);
        child.material.metalness = 0;
        if (child.material.name === 'Main') {
          child.material.color = new THREE.Color('#DFA33E');
        } else if (child.material.name === 'Grey') {
          child.material.color = new THREE.Color('#B6B5AD');
        } else if (child.material.name === 'Black') {
          child.material.color = new THREE.Color('#444444');
        }
      }
    });

    // this.model = new THREE.Mesh(
    //   new THREE.BoxBufferGeometry(1, 2, 1),
    //   new THREE.MeshBasicMaterial()
    // );

    /**
     * CANNON
     */
    this.physics.updatePhysics(
      {
        mesh: this.model,
        body: this.physics.charPhysicsWorld,
      },
      { all: false }
    );
  }

  eventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keysPressed[e.code] = true;
      this.updateDirection();
      this.animationController();

      if (e.code === 'Space') {
        this.jump();
      }
    });

    window.addEventListener('keyup', (e) => {
      delete this.keysPressed[e.code];
      this.updateDirection();
      this.animationController();
    });

    window.addEventListener('click', () => {
      console.log('punch');
      this.punch();
    });
  }

  animationController(key) {
    if (
      this.keysPressed['KeyW'] ||
      this.keysPressed['KeyA'] ||
      this.keysPressed['KeyS'] ||
      this.keysPressed['KeyD']
    ) {
      gsap.to(this.walkAnimation, { weight: 1, duration: 1 });
      gsap.to(this.idleAnimation, { weight: 0, duration: 1 });
    } else {
      gsap.to(this.idleAnimation, { weight: 1, duration: 3, delay: 0.5 });
      gsap.to(this.walkAnimation, { weight: 0, duration: 1 });
    }
  }

  punch() {
    this.punchAnimation.stop();
    this.idleAnimation.weight = 0;
    gsap.to(this.walkAnimation, { weight: 0, duration: 0.3 });
    this.punchAnimation.play();

    gsap.to(this.idleAnimation, { weight: 1, duration: 2, delay: 1 });
  }

  jump() {
    const playerVelocity = this.physics.charPhysicsWorld.velocity;
    if (playerVelocity.y < 0.1 && playerVelocity.y > 0) {
      playerVelocity.y += 5;

      this.jumpAnimation.stop();
      this.jumpAnimation.play();
      gsap.to(this.walkAnimation, { weight: 0, duration: 0.3 });
    }
  }

  move() {
    const playerVelocity = this.physics.charPhysicsWorld.velocity;

    this.positionHistory = this.model.position;

    if (
      (this.keysPressed['KeyA'] && this.keysPressed['KeyW']) ||
      (this.keysPressed['KeyA'] && this.keysPressed['KeyS'])
    ) {
      playerVelocity.z >= this.maxPlayerMoveSpeed / 2
        ? (playerVelocity.z = this.maxPlayerMoveSpeed / 2)
        : (playerVelocity.z += this.playerMoveSpeed);
    } else if (this.keysPressed['KeyA']) {
      playerVelocity.z >= this.maxPlayerMoveSpeed
        ? (playerVelocity.z = this.maxPlayerMoveSpeed)
        : (playerVelocity.z += this.playerMoveSpeed);
    }
    if (
      (this.keysPressed['KeyD'] && this.keysPressed['KeyW']) ||
      (this.keysPressed['KeyD'] && this.keysPressed['KeyS'])
    ) {
      playerVelocity.z <= -this.maxPlayerMoveSpeed / 2
        ? (playerVelocity.z = -this.maxPlayerMoveSpeed / 2)
        : (playerVelocity.z -= this.playerMoveSpeed);
    } else if (this.keysPressed['KeyD']) {
      playerVelocity.z <= -this.maxPlayerMoveSpeed
        ? (playerVelocity.z = -this.maxPlayerMoveSpeed)
        : (playerVelocity.z -= this.playerMoveSpeed);
    }
    if (this.keysPressed['KeyW']) {
      playerVelocity.x <= -this.maxPlayerMoveSpeed
        ? (playerVelocity.x = -this.maxPlayerMoveSpeed)
        : (playerVelocity.x -= this.playerMoveSpeed);
    }
    if (this.keysPressed['KeyS']) {
      playerVelocity.x >= this.maxPlayerMoveSpeed
        ? (playerVelocity.x = this.maxPlayerMoveSpeed)
        : (playerVelocity.x += this.playerMoveSpeed);
    }
  }

  updateDirection() {
    if (this.keysPressed['KeyW']) {
      if (this.keysPressed['KeyA']) this.playerDirection = (Math.PI * 7) / 4;
      else if (this.keysPressed['KeyD'])
        this.playerDirection = (Math.PI * 5) / 4;
      else this.playerDirection = -Math.PI / 2;
    } else if (this.keysPressed['KeyS']) {
      if (this.keysPressed['KeyA']) this.playerDirection = Math.PI / 4;
      else if (this.keysPressed['KeyD'])
        this.playerDirection = (Math.PI * 3) / 4;
      else this.playerDirection = Math.PI / 2;
    } else if (this.keysPressed['KeyA']) this.playerDirection = 0;
    else if (this.keysPressed['KeyD']) this.playerDirection = Math.PI;

    this.model.rotation.y = this.playerDirection;
    // gsap.to(this.model.rotation, { y: this.playerDirection, duration: 0.1 });
  }
}
