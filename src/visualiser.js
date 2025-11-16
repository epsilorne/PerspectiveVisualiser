import * as THREE from 'three';

import { VPCube } from "./cube"

import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer'
import { RenderPass } from 'three/addons/postprocessing/RenderPass'

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
      (window.innerHeight - DISPLAY_SIZE_OFFSET) / (window.innerHeight - DISPLAY_SIZE_OFFSET),
      0.1, 10000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    const rendererTarget = new THREE.WebGLRenderTarget(
      window.innerWidth * 2.5, window.innerHeight * 2.5,
    )

    let composer = new EffectComposer(renderer, rendererTarget);
    composer.addPass(new RenderPass(scene, camera));
    // TODO: fisheye effects shader pass

    // No need to assign to a variable
    new OrbitControls(camera, renderer.domElement);

    this.scene = scene;
    this.objectsList = new Map();
    this.createdCubes = 0;
    this.fisheyeEnabled = false;

    renderer.setSize(window.innerHeight - DISPLAY_SIZE_OFFSET, window.innerHeight - DISPLAY_SIZE_OFFSET);

    // Centre the display
    document.getElementById("canvasLocation").appendChild(renderer.domElement);

    camera.position.x = 5;
    camera.position.y = 2;
    camera.position.z = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.background = new THREE.Color().setHex(0xffffff);

    // Basic lighting (TODO: let users customise lights)
    const ambient = new THREE.AmbientLight(0xffffff, 0.2);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    scene.add(ambient);
    scene.add(dirLight);

    renderer.setAnimationLoop(() => {
      composer.render();
    })
  }

  /**
    * Add a cube to the scene, pushing it to the objects map.
    * @param {float} size
    * @param {THREE.Vector3} position
    */
  addCube(size, position) {
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
  deleteCube(id) {
    const cube = this.objectsList.get(id);
    this.scene.remove(cube.mesh);
    this.objectsList.delete(id);
  }

  /**
    * Set whether fisheye effect is enabled or not.
    */
  setFisheye(value) {
    this.fisheyeEnabled = value;
  }
}
