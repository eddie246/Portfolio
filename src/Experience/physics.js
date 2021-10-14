import * as CANNON from 'cannon-es';
import { threeToCannon, ShapeType } from 'three-to-cannon';

import * as dat from 'dat.gui';

export default class Physics {
  constructor(time, resources) {
    this.time = time;
    this.resources = resources;
    this.setPhysicsWorld();

    this.needsUpdatingAll = [];
    this.needsUpdatingPosition = [];

    this.playerDimentions = {
      x: 1,
      y: 2,
      z: 1,
    };
    this.setChar();
    this.setPhysicsWorldUpdate();
    // this.setDebug();
    this.setDiner();
    this.setGas();
  }

  setDebug() {
    this.gui = new dat.GUI();
  }

  setChar() {
    const defaultMaterial = new CANNON.Material('default');
    //Cube
    // const shape = new CANNON.Box(
    //   new CANNON.Vec3(
    //     this.playerDimentions.x / 2,
    //     this.playerDimentions.y / 2,
    //     this.playerDimentions.z / 2
    //   )
    // );
    const shape = new CANNON.Cylinder(0.5, 0.5, 2, 8);

    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 0, 0),
      shape: shape,
      material: defaultMaterial,

      angularDamping: 1,
    });
    body.allowSleep = false;
    body.position.y = 1;

    this.world.addBody(body);
    this.charPhysicsWorld = body;
  }

  setPhysicsWorld() {
    const world = new CANNON.World();
    world.gravity.set(0, -5, 0);

    // Physics contact material
    const defaultMaterial = new CANNON.Material('default');
    this.defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.003,
        restitution: 0.0,
      }
    );

    world.addContactMaterial(this.defaultContactMaterial);
    world.defaultContactMaterial = this.defaultContactMaterial;
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.allowSleep = true;

    //floor flat
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body();
    floorBody.mass = 0;
    floorBody.addShape(floorShape);
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI / 2
    );
    world.addBody(floorBody);

    this.world = world;
  }

  setDiner() {
    //PAVEMENT
    const pavement = new CANNON.Box(new CANNON.Vec3(16.5, 0.5, 15.5));

    const pavementBody = new CANNON.Body();
    pavementBody.mass = 0;
    pavementBody.position.x = -3.54;
    pavementBody.position.z = -25.01;
    pavementBody.position.y = 0.3;

    // pavementBody.quaternion.setFromAxisAngle(
    //   new CANNON.Vec3(0, -1, 0),
    //   Math.PI / 2
    // );
    pavementBody.addShape(pavement);

    this.world.addBody(pavementBody);

    //DINER
    const diner = new CANNON.Box(new CANNON.Vec3(10, 15, 8));
    const dinerBody = new CANNON.Body();
    dinerBody.mass = 0;

    dinerBody.position.x = -3;
    dinerBody.position.z = -23;

    dinerBody.addShape(diner);
    this.world.addBody(dinerBody);

    //TRASH BIN
    const trash = new CANNON.Box(new CANNON.Vec3(1, 2, 1));
    const trashBody = new CANNON.Body();
    trashBody.mass = 0;

    trashBody.position.x = 7.73;
    trashBody.position.z = -18;
    trashBody.position.y = 0.2;

    trashBody.addShape(trash);
    this.world.addBody(trashBody);
  }

  setGas() {
    //GAS STATION
    const pavement = new CANNON.Box(new CANNON.Vec3(16.5, 0.5, 15.5));
    const pavementBody = new CANNON.Body();
    pavementBody.mass = 0;

    pavementBody.position.x = -3.54;
    pavementBody.position.z = 24.28;

    // this.gui.add(pavementBody.position, 'x', -10, 10, 0.01).name('x coords');
    // this.gui.add(pavementBody.position, 'z', 0, 50, 0.01).name('z coords');
    // this.gui.add(pavementBody.position, 'y', 0, 2, 0.01).name('y coords');

    pavementBody.addShape(pavement);
    this.world.addBody(pavementBody);
  }

  setPhysicsWorldUpdate() {
    this.time.on('tick', () => {
      this.world.step(1 / 60, this.time.delta, 3);

      //Update all for physics
      for (const obj of this.needsUpdatingAll) {
        // console.log(obj.mesh.position, obj.body.position);
        obj.mesh.position.copy(obj.body.position);
        // obj.mesh.position.x = obj.body.position.x;
        // obj.mesh.position.z = obj.body.position.z;
        // obj.mesh.position.y = obj.body.position.y;

        obj.mesh.quaternion.copy(obj.body.quaternion);
        // obj.mesh.quaternion.x = obj.body.quaternion.x;
        // obj.mesh.quaternion.z = obj.body.quaternion.z;
        // obj.mesh.quaternion.y = obj.body.quaternion.y;
        // obj.mesh.quaternion.w = obj.body.quaternion.w;
      }

      //Update position for physics
      for (const obj of this.needsUpdatingPosition) {
        obj.mesh.position.copy(obj.body.position);
      }
    });
  }

  updatePhysics(obj, settings) {
    if (settings.all) {
      this.needsUpdatingAll.push(obj);
    } else {
      this.needsUpdatingPosition.push(obj);
    }
  }
}
