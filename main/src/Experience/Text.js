import * as CANNON from 'cannon-es';
import { threeToCannon, ShapeType } from 'three-to-cannon';
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

    this.setText();
  }

  setText() {
    this.scene.add(this.textModel);
    const material = new CANNON.Material('default');
    this.textModel.traverse((child) => {
      if (child.material) {
        child.material.metalness = 0;

        const shape = threeToCannon(child, { type: ShapeType.BOX });

        const body = new CANNON.Body({
          mass:
            shape.shape.halfExtents.x *
            shape.shape.halfExtents.y *
            shape.shape.halfExtents.z,
          position: child.position,
          quaternion: child.quaternion,
          shape: shape.shape,
          material: material,
          sleepTimeLimit: 100,
        });

        if (child.name === 'TechStack') {
          body.mass = 0;
        }

        this.physics.world.addBody(body);

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
