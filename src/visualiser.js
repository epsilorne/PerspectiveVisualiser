import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { VPCube } from "./cube"

/** In pixels, how much shorter should the display be? (So that the UI controls
  * are easily accessible without scorlling.) */
const DISPLAY_SIZE_OFFSET = 250;

/**
  * Represents the 'model' of this application; contains the necessary Three.js
  * components to render objects, add/remove components, and set other things.
  */
export class Visualiser {
  constructor() {
    this.fov = 45;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / (window.innerHeight - DISPLAY_SIZE_OFFSET),
      0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true
    });

    // No need to assign to a variable
    new OrbitControls(camera, renderer.domElement);

    this.scene = scene;
    this.objectsList = new Map();
    this.createdCubes = 0;

    renderer.setSize(window.innerWidth, window.innerHeight - DISPLAY_SIZE_OFFSET);
    document.body.appendChild(renderer.domElement);

    camera.position.x = 5;
    camera.position.y = 2;
    camera.position.z = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.background = new THREE.Color().setHex(0xffffff);

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    })
  }

  /**
    * Add a cube to the scene, pushing it to the objects map.
    * @param {float} size
    * @param {THREE.Vector3} position
    */
  add_cube(size, position) {
    const cube = new VPCube(size, position);
    cube.id = this.createdCubes++;
    this.scene.add(cube.mesh);
    this.objectsList.set(cube.id, cube);

    return cube;
  }

  /**
    * Remove a cube from the scene and objects map.
    * @param {int} id - id of the cube to be removed
    */
  delete_cube(id) {
    const cube = this.objectsList.get(id);
    this.scene.remove(cube.mesh);
    this.objectsList.delete(id);
  }
}
