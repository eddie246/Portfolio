import * as CANNON from 'cannon-es';
import { threeToCannon, ShapeType } from 'three-to-cannon';

import * as dat from 'dat.gui';

export default class Text {
  constructor(scene, resources, physics) {
    this.scene = scene;
    this.resources = resources;
    this.physics = physics;

    this.textModel = this.resources.items.textModel.scene;
    this.positions = {
      // Skills: new CANNON.Vec3(0, 4, 0),
      Eddie: new CANNON.Vec3(-2.45, 3, 6.22),
    };

    this.gui = new dat.GUI();

    this.setText();
  }

  setText() {
    this.scene.add(this.textModel);
    this.textModel.traverse((child) => {
      if (child.material) {
        console.log(child.quaternion);
        child.material.metalness = 0;

        const shape = threeToCannon(child, { type: ShapeType.BOX });
        // const shape = new CANNON.Box(new CANNON.Vec3(1.7, 0.5, 0.5));

        const body = new CANNON.Body({
          mass: 1,
          // position: this.positions[child.name] || new CANNON.Vec3(20, 20, 20),
          position: child.position,
          quaternion: child.quaternion,
          shape: shape.shape,
          material: this.physics.defaultMaterial,
          sleepTimeLimit: 100,
        });

        this.physics.world.addBody(body);

        if (child.name === 'Eddie') {
          this.gui.add(body.position, 'x', -10, 10, 0.01).name('x coords');
          this.gui.add(body.position, 'z', -10, 10, 0.01).name('z coords');
          this.gui.add(body.position, 'y', 0, 5, 0.01).name('y coords');

          this.gui
            .add(body.quaternion, 'x', -10, 10, 0.01)
            .name('x quaternion');
          this.gui
            .add(body.quaternion, 'z', -10, 10, 0.01)
            .name('z quaternion');
          this.gui
            .add(body.quaternion, 'y', -10, 10, 0.01)
            .name('y quaternion');
          this.gui
            .add(body.quaternion, 'w', -10, 10, 0.01)
            .name('w quaternion');

          // body.quaternion.setFromAxisAngle(
          //   new CANNON.Vec3(0, 1, 0),
          //   Math.PI / 1
          // );
        }

        this.physics.updatePhysics(
          {
            mesh: child,
            body: body,
          },
          {
            all: true,
          }
        );
      }
    });
  }
}
