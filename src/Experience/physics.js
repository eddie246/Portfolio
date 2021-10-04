import CANNON from "cannon";
import * as THREE from "three";

import { threeToCannon, ShapeType } from "three-to-cannon";

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
  }

  setChar() {
    const defaultMaterial = new CANNON.Material("default");
    //Cube
    const shape = new CANNON.Box(
      new CANNON.Vec3(
        this.playerDimentions.x / 2,
        this.playerDimentions.y / 2,
        this.playerDimentions.z / 2
      )
    );

    // //Cylinder
    // const shape = new CANNON.Cylinder(0.5, 0.5, 2, 10);

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
    const defaultMaterial = new CANNON.Material("default");
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.003,
        restitution: 0.0,
      }
    );

    world.addContactMaterial(defaultContactMaterial);
    world.defaultContactMaterial = defaultContactMaterial;
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

  setPhysicsWorldUpdate() {
    this.time.on("tick", () => {
      this.world.step(1 / 60, this.time.delta, 3);

      //Update all for physics
      for (const obj of this.needsUpdatingAll) {
        obj.mesh.position.copy(obj.body.position);
        obj.mesh.quaternion.copy(obj.body.quaternion);
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
