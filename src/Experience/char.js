import * as THREE from 'three';
import gsap from 'gsap';

export default class Character {
  constructor(resources, physics, time, touch) {
    this.resources = resources;
    this.physics = physics;
    this.time = time;
    this.touch = touch;

    // Player Details
    this.keysPressed = {};

    this.playerMoveSpeed = 0.5;
    this.maxPlayerMoveSpeed = 1.5;

    this.playerDirection = Math.PI / 2;

    this.positionHistory = null;

    // Player Animations
    this.mixer = null;

    this.setCharacter();
    this.eventListeners();
    if (this.touch) {
      this.touchControls();
    }
    this.updateFrame();
  }

  updateFrame() {
    this.time.on('tick', () => {
      this.move();
      this.maxPlayerMoveSpeed = 0.15 * this.time.delta;

      if (this.mixer) {
        this.mixer.update(this.time.delta / 800);
      }
    });
  }

  setWeight(action, weight) {
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
  }

  touchControls() {
    this.touch.manager.on('move', (data, moveData) => {
      const angle = moveData.angle.degree;
      if ((angle < 22.5 && angle > 0) || (angle > 0 && angle > 337.5)) {
        this.keysPressed = {
          KeyD: true,
        };
      } else if (angle > 22.5 && angle < 67.5) {
        this.keysPressed = {
          KeyD: true,
          KeyW: true,
        };
      } else if (angle > 67.5 && angle < 112.6) {
        this.keysPressed = {
          KeyW: true,
        };
      } else if (angle > 112.6 && angle < 157.5) {
        this.keysPressed = {
          KeyW: true,
          KeyA: true,
        };
      } else if (angle > 157.5 && angle < 202.5) {
        this.keysPressed = {
          KeyA: true,
        };
      } else if (angle > 202.5 && angle < 247.5) {
        this.keysPressed = {
          KeyA: true,
          KeyS: true,
        };
      } else if (angle > 247.5 && angle < 292.5) {
        this.keysPressed = {
          KeyS: true,
        };
      } else if (angle > 292.5 && angle < 337.5) {
        this.keysPressed = {
          KeyS: true,
          KeyD: true,
        };
      }
      this.animationController();
      this.updateDirection();
    });
    this.touch.manager.on('end', () => {
      this.keysPressed = {};
      this.animationController();
      this.updateDirection();
    });

    document.querySelector('.button').addEventListener('touchstart', () => {
      this.jump();
    });
  }

  setCharacter() {
    /**
     * THREE
     */
    // Character model
    this.model = this.resources.items.robotModel.scene;

    /**
     *  Player Animations
     */

    // Animation mixer
    this.animations = this.resources.items.robotModel.animations;
    this.mixer = new THREE.AnimationMixer(this.model);

    // Idle
    this.idleAnimation = this.mixer.clipAction(this.animations[0]);
    this.idleAnimation.play();

    // Walk/Run
    this.walkAnimation = this.mixer.clipAction(this.animations[2]);
    this.walkAnimation.play();
    this.walkAnimation.weight = 0;

    // Jump
    this.jumpAnimation = this.mixer.clipAction(this.animations[1]);
    this.jumpAnimation.repetitions = 1;

    // Punch
    // this.punchAnimation = this.mixer.clipAction(this.animations[2]);
    // this.punchAnimation.repetitions = 1;

    /**
     *  Scene settings
     */
    // Robot
    this.model.scale.set(0.5, 0.5, 0.5);
    this.model.children[0].position.y = -2;
    this.model.rotation.y = this.playerDirection;

    this.model.traverse((child) => {
      if (child.material) {
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

  jump() {
    const playerVelocity = this.physics.charPhysicsWorld.velocity;
    if (playerVelocity.y < 0.2 && playerVelocity.y > -0.2) {
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
