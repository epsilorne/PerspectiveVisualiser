import * as THREE from 'three';
import { Axis } from './util'

const CUBE_MATERIAL = new THREE.MeshStandardMaterial({color: 0xaaaaaa});
const WF_MATERIAL = new THREE.MeshStandardMaterial({color: 0x000000, wireframe: true});
const VP_DISTANCE = -10000;

/**
  * Represents a perspective line starting from a cube vertex and extending
  * 'infinitely'.
  */
class PerspectiveLine {
  /**
    * @param {THREE.Vector3} position - starting position (i.e. cube vertex)
    * @param {Axis} vpDirection - direction towards the vanishing point
    * @param {THREE.MeshBasicMaterial} lineMaterial - perspective line material
    */
  constructor(position, vpDirection, lineMaterial) {
    let vpPosition;
    switch(vpDirection) {
      case Axis.X:
        vpPosition = new THREE.Vector3(VP_DISTANCE, position.y, position.z);
        break;
      case Axis.Y:
        vpPosition = new THREE.Vector3(position.x, VP_DISTANCE, position.z);
        break;
      case Axis.Z:
        vpPosition = new THREE.Vector3(position.x, position.y, VP_DISTANCE);
        break;
    }

    const points = [position, vpPosition]
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
   
    // Actual THREE.Object3D
    this.line = new THREE.Line(geometry, lineMaterial);
  }
}

/**
  * Represents a cube with perspective lines towards the vanishing points.
  */
export class VPCube {
  /**
    * @param {float} size - size of the cube
    * @param {THREE.Vector3} position - position of the cube
    */
  constructor(size, position) {
    this.id = -1;
    this.size = size;
    this.position = position;
    this.perspectiveLines = [];
    this.lineMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});

    // Actual THREE.Object3D
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(size, size, size),
      CUBE_MATERIAL
    );

    //
    this.wireframe = new THREE.Mesh(
      new THREE.BoxGeometry(size, size, size),
      WF_MATERIAL
    );
    this.wireframe.renderOrder = 1;
    this.mesh.add(this.wireframe);

    this.addPerspectiveLines();
  }

  /**
    * Create vanishing points for a cube and add them as child meshes/objects.
    */
  addPerspectiveLines() {
    const lineOffset = this.size / 2;

    // Vanishing points to Z
    this.perspectiveLines.push(new PerspectiveLine(new
      THREE.Vector3(lineOffset, lineOffset, lineOffset),
      Axis.Z, this.lineMaterial)
    );
    this.perspectiveLines.push(new PerspectiveLine(new
      THREE.Vector3(-lineOffset, lineOffset, lineOffset),
      Axis.Z, this.lineMaterial)
    );
    this.perspectiveLines.push(new PerspectiveLine(new
      THREE.Vector3(lineOffset, -lineOffset, lineOffset),
      Axis.Z, this.lineMaterial)
    );
    this.perspectiveLines.push(new PerspectiveLine(new
      THREE.Vector3(-lineOffset, -lineOffset, lineOffset),
      Axis.Z, this.lineMaterial)
    );

    // Vanishing points to Y
    this.perspectiveLines.push(new PerspectiveLine(new
      THREE.Vector3(lineOffset, lineOffset, lineOffset),
      Axis.Y, this.lineMaterial)
    );
    this.perspectiveLines.push(new PerspectiveLine(new
      THREE.Vector3(-lineOffset, lineOffset, lineOffset),
      Axis.Y, this.lineMaterial)
    );
    this.perspectiveLines.push(new PerspectiveLine(new
      THREE.Vector3(lineOffset, lineOffset, -lineOffset),
      Axis.Y, this.lineMaterial)
    );
    this.perspectiveLines.push(new PerspectiveLine(new
      THREE.Vector3(-lineOffset, lineOffset, -lineOffset),
      Axis.Y, this.lineMaterial)
    );

    // Vanishing points to X
    this.perspectiveLines.push(new PerspectiveLine(new
      THREE.Vector3(lineOffset, lineOffset, lineOffset),
      Axis.X, this.lineMaterial)
    );
    this.perspectiveLines.push(new PerspectiveLine(new
      THREE.Vector3(lineOffset, lineOffset, -lineOffset),
      Axis.X, this.lineMaterial)
    );
    this.perspectiveLines.push(new PerspectiveLine(new
      THREE.Vector3(lineOffset, -lineOffset, lineOffset),
      Axis.X, this.lineMaterial)
    );
    this.perspectiveLines.push(new PerspectiveLine(new
      THREE.Vector3(lineOffset, -lineOffset, -lineOffset),
      Axis.X, this.lineMaterial)
    );

    this.perspectiveLines.forEach((p) => this.mesh.add(p.line));
  }

  /**
    * Set the entire rotation of a cube.
    * @param {float} x - degrees
    * @param {float} y - degrees
    * @param {float} z - degrees
    */
  setRotation(x, y, z) {
    this.mesh.rotation.set(
      THREE.MathUtils.degToRad(parseFloat(x) || 0),
      THREE.MathUtils.degToRad(parseFloat(y) || 0),
      THREE.MathUtils.degToRad(parseFloat(z) || 0)
    );
  }

  /**
    * Set the rotation of a single axis of the cube.
    * @param {Axis} axis - X, Y or Z
    * @param {float} amount - how much to rotate by in degrees
    */
  setRotationAxis(axis, amount) {
    let rads = THREE.MathUtils.degToRad(parseFloat(amount)) || 0;
    switch(axis) {
      case Axis.X:
        this.mesh.rotation.x = rads;
        break;
      case Axis.Y:
        this.mesh.rotation.y = rads;
        break;
      case Axis.Z:
        this.mesh.rotation.z = rads;
        break;
    }
  }

  /**
    * Set world-space position of a cube.
    * @param {float} x
    * @param {float} y
    * @param {float} z
    */
  setPosition(x, y, z) {
    this.mesh.position.set(x, y, z);
  }

  /**
    * Set world-space position of a single axis of the cube.
    * @param {float} x
    * @param {float} y
    * @param {float} z
    */
  setPositionAxis(axis, amount) {
    switch(axis) {
      case Axis.X:
        this.mesh.position.x = amount;
        break;
      case Axis.Y:
        this.mesh.position.y = amount;
        break;
      case Axis.Z:
        this.mesh.position.z = amount;
        break;
    }
  }

  /**
    * Set the visiblity of each perspective line.
    * @param {bool} value
    */
  setPerspectiveLineVisibility(value) {
    this.perspectiveLines.forEach((pl) => {
      pl.line.visible = value;
    });
  }
}
