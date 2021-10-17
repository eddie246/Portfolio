import * as CANNON from 'cannon-es';
import { threeToCannon, ShapeType } from 'three-to-cannon';

import * as THREE from 'three';

import * as dat from 'dat.gui';

export default class Physics {
  constructor(time, resources, scene) {
    this.time = time;
    this.resources = resources;
    this.scene = scene;
    this.setPhysicsWorld();

    this.needsUpdatingAll = [];
    this.needsUpdatingPosition = [];

    this.setChar();
    this.setPhysicsWorldUpdate();
    this.setDebug();
    this.setDiner();
    this.setGas();
    this.setApartments();
    this.setConstruction();
  }

  setDebug() {
    this.gui = new dat.GUI();
  }

  setChar() {
    const defaultMaterial = new CANNON.Material('default');

    // const shape = new CANNON.Cylinder(0.5, 0.5, 2, 8);
    const shape = new CANNON.Sphere(1);

    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 0, 0),
      shape: shape,
      material: defaultMaterial,

      angularDamping: 1,
    });
    body.allowSleep = false;
    body.position.y = 1;
    body.position.z = -0.45;

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
        // friction: 0.003,
        friction: 0.01,
        restitution: 0.1,
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
    const diner = new CANNON.Box(new CANNON.Vec3(11, 4, 7.84));
    const trash = new CANNON.Box(new CANNON.Vec3(1, 1, 1.15));

    const pavementBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(-7, 0, -25.01),
    });

    pavementBody.addShape(pavement);
    pavementBody.addShape(diner, new CANNON.Vec3(0.07, 2, 1.52));
    pavementBody.addShape(trash, new CANNON.Vec3(11.73, 1.19, 6.62));

    this.world.addBody(pavementBody);
  }

  setGas() {
    //GAS STATION
    const pavement = new CANNON.Box(new CANNON.Vec3(16.5, 0.5, 15.5));
    const platform = new CANNON.Box(new CANNON.Vec3(12, 1, 11.7));
    const pump = new CANNON.Box(new CANNON.Vec3(1, 2, 1));
    const store = new CANNON.Box(new CANNON.Vec3(10, 6, 4.1));
    const storePillar = new CANNON.Box(new CANNON.Vec3(0.5, 6, 0.5));

    const pavementBody = new CANNON.Body();
    pavementBody.mass = 0;

    pavementBody.position.x = -6.43;
    pavementBody.position.z = 23.92;

    pavementBody.addShape(pavement);
    pavementBody.addShape(platform, new CANNON.Vec3(0, 0, 0.7));
    pavementBody.addShape(pump, new CANNON.Vec3(6.2, 0, -1.7));
    pavementBody.addShape(pump, new CANNON.Vec3(6.2, 0, -6.5));
    pavementBody.addShape(store, new CANNON.Vec3(0, 0, 7.7));
    pavementBody.addShape(storePillar, new CANNON.Vec3(11, 0, 11.2));
    pavementBody.addShape(storePillar, new CANNON.Vec3(11, 0, 3.5));

    //PARKING LOT
    const longPavement = new CANNON.Box(new CANNON.Vec3(16.5, 0.5, 1.9));
    const shortPavement = new CANNON.Box(new CANNON.Vec3(6.7, 0.5, 1.9));
    const longHPavement = new CANNON.Box(new CANNON.Vec3(1.8, 0.5, 16));
    const shortHPavement = new CANNON.Box(new CANNON.Vec3(1.7, 0.5, 8));
    const parkingOffice = new CANNON.Box(new CANNON.Vec3(4, 6, 1.6));

    const blueCar = new CANNON.Box(new CANNON.Vec3(3.6, 1.8, 1.4));
    const whiteCar = new CANNON.Box(new CANNON.Vec3(3.6, 1.8, 1.6));

    const parkingBody = new CANNON.Body();
    parkingBody.mass = 0;

    parkingBody.position.x = -6.43;
    parkingBody.position.z = 45;

    parkingBody.addShape(longPavement, new CANNON.Vec3(0, 0, 22.02));
    parkingBody.addShape(shortPavement, new CANNON.Vec3(-9.95, 0, 2.9));
    parkingBody.addShape(longHPavement, new CANNON.Vec3(14.83, 0, 8.06));
    parkingBody.addShape(shortHPavement, new CANNON.Vec3(-14.9, 0, 12.66));
    parkingBody.addShape(parkingOffice, new CANNON.Vec3(-9.43, 0, 2.9));
    parkingBody.addShape(
      blueCar,
      new CANNON.Vec3(-7.86, 0, 7.08),
      new CANNON.Quaternion(0, -0.029995, 0, 0.99955)
    );
    parkingBody.addShape(
      whiteCar,
      new CANNON.Vec3(8.95, 0.14, 15),
      new CANNON.Quaternion(0, -0.13459, 0, 0.990901)
    );
    parkingBody.addShape(
      blueCar,
      new CANNON.Vec3(8.61, 0.14, 1.61),
      new CANNON.Quaternion(0, 0.054972, 0, 0.998487)
    );
    parkingBody.addShape(
      whiteCar,
      new CANNON.Vec3(-4.36, 0.37, -40.2),
      new CANNON.Quaternion(0, 0.389418, 0, 0.921061)
    );

    // Add Obj to physics world
    this.world.addBody(pavementBody);
    this.world.addBody(parkingBody);
  }

  setApartments() {
    const pavement = new CANNON.Box(new CANNON.Vec3(16.5, 0.5, 15.5));
    const aptFoundation = new CANNON.Box(new CANNON.Vec3(12.8, 1, 12.55));
    const wall = new CANNON.Box(new CANNON.Vec3(1, 5, 10.6));
    const corner = new CANNON.Box(new CANNON.Vec3(1.2, 5, 1.2));
    const mailBox = new CANNON.Box(new CANNON.Vec3(0.8, 1.5, 0.8));
    const linkedIn = new CANNON.Box(new CANNON.Vec3(1, 0.2, 1));
    const mapBox = new CANNON.Box(new CANNON.Vec3(1, 0.3, 2.3));
    const octoCat = new CANNON.Box(new CANNON.Vec3(0.8, 1, 0.4));
    const SUV = new CANNON.Box(new CANNON.Vec3(2, 2, 3.8));

    const apartmentBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(-58, 0, -25),
    });

    apartmentBody.addShape(pavement);
    apartmentBody.addShape(aptFoundation, new CANNON.Vec3(-1.17, 0.11, -1.6));
    apartmentBody.addShape(wall, new CANNON.Vec3(9.16, 2, -3.24));
    apartmentBody.addShape(
      wall,
      new CANNON.Vec3(-2.68, 2, 8.47),
      new CANNON.Quaternion(0, 0.706825, 0, 0.707388)
    );
    apartmentBody.addShape(
      corner,
      new CANNON.Vec3(8.14, 2, 7.56),
      new CANNON.Quaternion(0, 0.380188, 0, 0.924909)
    );
    apartmentBody.addShape(mailBox, new CANNON.Vec3(15.77, 2, -3.92));
    apartmentBody.addShape(
      linkedIn,
      new CANNON.Vec3(17.13, 0.6, 1.27),
      new CANNON.Quaternion(0, 0, -0.174108, 0.984727)
    );
    apartmentBody.addShape(
      mapBox,
      new CANNON.Vec3(25.46, 0.27, -5.16),
      new CANNON.Quaternion(0, 0.509841, 0, 0.860269)
    );
    apartmentBody.addShape(
      octoCat,
      new CANNON.Vec3(25.46, 1.63, -5.09),
      new CANNON.Quaternion(0, 0.509841, 0, 0.860269)
    );
    apartmentBody.addShape(
      SUV,
      new CANNON.Vec3(19.67, 1.64, 8.72),
      new CANNON.Quaternion(-0.0433942, 0.495441, -0.0452488, 0.866376)
    );

    this.world.addBody(apartmentBody);
  }

  setConstruction() {
    const pavement = new CANNON.Box(new CANNON.Vec3(18, 0.48, 30));
    const crane = new CANNON.Box(new CANNON.Vec3(3.7, 2, 3.7));
    const container = new CANNON.Box(new CANNON.Vec3(5.2, 3, 2.2));
    const fireStation = new CANNON.Box(new CANNON.Vec3(10.5, 5, 10.8));
    const endPillar = new CANNON.Box(new CANNON.Vec3(0.65, 5, 0.65));
    const pillar = new CANNON.Box(new CANNON.Vec3(0.65, 5, 0.38));
    const firetruck = new CANNON.Box(new CANNON.Vec3(2, 5, 7.2));
    const taxi = new CANNON.Box(new CANNON.Vec3(1.8, 2, 4.5));

    const constructionBody = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(-60, 0, 38.5),
    });

    constructionBody.addShape(pavement);
    constructionBody.addShape(crane, new CANNON.Vec3(-7.64, 0.45, -4.93));
    constructionBody.addShape(
      container,
      new CANNON.Vec3(-8.75, 1.93, -19.02),
      new CANNON.Quaternion(0, -0.37556, 0, 0.926798)
    );
    constructionBody.addShape(fireStation, new CANNON.Vec3(0.84, 2, 14.84));
    constructionBody.addShape(endPillar, new CANNON.Vec3(12.15, 2, 4.72));
    constructionBody.addShape(endPillar, new CANNON.Vec3(12.15, 2, 25.25));
    constructionBody.addShape(pillar, new CANNON.Vec3(12.13, 2, 20.92));
    constructionBody.addShape(pillar, new CANNON.Vec3(12.13, 2, 16.97));
    constructionBody.addShape(pillar, new CANNON.Vec3(12.13, 2, 13.01));
    constructionBody.addShape(pillar, new CANNON.Vec3(12.13, 2, 9.06));
    constructionBody.addShape(
      firetruck,
      new CANNON.Vec3(28.24, 2, 26.14),
      new CANNON.Quaternion(0, 0.509841, 0, 0.860263)
    );
    constructionBody.addShape(
      taxi,
      new CANNON.Vec3(24.33, 0.36, -28.53),
      new CANNON.Quaternion(0, 0.223106, 0, 0.974794)
    );

    this.world.addBody(constructionBody);

    boxDebug(11, taxi, constructionBody, this.scene, this.gui);

    function boxDebug(index, obj, body, scene, gui) {
      const box = new THREE.Mesh(
        new THREE.BoxBufferGeometry(
          obj.halfExtents.x * 2,
          obj.halfExtents.y * 2,
          obj.halfExtents.z * 2
        ),
        new THREE.MeshBasicMaterial({ wireframe: true })
      );
      scene.add(box);

      box.position.x = body.position.x + body.shapeOffsets[index].x;
      box.position.y = body.position.y + body.shapeOffsets[index].y;
      box.position.z = body.position.z + body.shapeOffsets[index].z;
      box.quaternion.copy(body.shapeOrientations[index]);

      //Rotation
      gui
        .add(box.rotation, 'x', -Math.PI, Math.PI, 0.01)
        .name('rotation x')
        .onChange(() => {
          console.log(box.quaternion);
        });
      gui
        .add(box.rotation, 'y', -Math.PI, Math.PI, 0.01)
        .name('rotation y')
        .onChange(() => {
          console.log(box.quaternion);
        });
      gui
        .add(box.rotation, 'z', -Math.PI, Math.PI, 0.01)
        .name('rotation z')
        .onChange(() => {
          console.log(box.quaternion);
        });

      //Positions
      gui
        .add(body.shapeOffsets[index], 'x', -50, 50, 0.01)
        .name('x coords')
        .onChange(() => {
          box.position.x = body.position.x + body.shapeOffsets[index].x;
          box.position.y = body.position.y + body.shapeOffsets[index].y;
          box.position.z = body.position.z + body.shapeOffsets[index].z;
        });
      gui
        .add(body.shapeOffsets[index], 'z', -50, 50, 0.01)
        .name('z coords')
        .onChange(() => {
          box.position.x = body.position.x + body.shapeOffsets[index].x;
          box.position.y = body.position.y + body.shapeOffsets[index].y;
          box.position.z = body.position.z + body.shapeOffsets[index].z;
        });
      gui
        .add(body.shapeOffsets[index], 'y', 0, 2, 0.01)
        .name('y coords')
        .onChange(() => {
          box.position.x = body.position.x + body.shapeOffsets[index].x;
          box.position.y = body.position.y + body.shapeOffsets[index].y;
          box.position.z = body.position.z + body.shapeOffsets[index].z;
        });
    }
  }

  setPhysicsWorldUpdate() {
    this.time.on('tick', () => {
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
