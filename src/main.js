import * as THREE from 'three';
import { Visualiser } from "./visualiser";
import { indexToAxis } from './util'

const visualiser = new Visualiser();

/** Creating various UI elements. */

let cubeControlsTable = document.createElement("table");
document.body.appendChild(cubeControlsTable);

let addCubeBtn = document.createElement("button");
addCubeBtn.textContent = "add new cube";
addCubeBtn.onclick = addCubeToVisualiser;
document.body.appendChild(addCubeBtn);

/**
  * Wrapper function to add a new cube to the scene/visualiser and update the
  * controls table.
  */
function addCubeToVisualiser() {
  let cube = visualiser.add_cube(1, new THREE.Vector3(0, 0, 0));
  updateCubeControls(cube);
}

/**
  * Create a new row in the controls table to allow controlling of a cube.
  * @param {Cube} obj - cube object to be controlled by this row
  */
function updateCubeControls(obj) {
  let tr = document.createElement("tr");

  let idCol = document.createElement("td");
  let idText = document.createTextNode("cube " + obj.id);
  idCol.appendChild(idText);
  tr.appendChild(idCol);

  let propertiesCol = document.createElement("td");

  propertiesCol.appendChild(document.createTextNode("rotation "));
  for (let i = 0 ; i < 3; i++) {
    let axis = indexToAxis(i);

    let label = document.createElement("label");
    label.textContent = axis + ": ";

    let input = document.createElement("input");
    input.type = "number";
    input.size = 3;
    input.addEventListener("input", (_) => {
      obj.setRotationAxis(axis, input.value);
    });

    label.appendChild(input);
    propertiesCol.append(label);
  }

  propertiesCol.appendChild(document.createTextNode(" position "));
  for (let i = 0 ; i < 3; i++) {
    let axis = indexToAxis(i);

    let label = document.createElement("label");
    label.textContent = axis + ": ";

    let input = document.createElement("input");
    input.type = "number";
    input.size = 3;
    input.step = 0.1
    input.addEventListener("input", (_) => {
      obj.setPositionAxis(axis, input.value);
    });

    label.appendChild(input);
    propertiesCol.append(label);
  }
  tr.appendChild(propertiesCol);

  let deleteCol = document.createElement("td");
  let deleteCubeBtn = document.createElement("button");
  deleteCubeBtn.textContent = "delete cube";
  deleteCubeBtn.onclick = () => {
    visualiser.delete_cube(obj.id);
    cubeControlsTable.removeChild(tr);
  };
  deleteCol.appendChild(deleteCubeBtn);
  tr.appendChild(deleteCol);

  cubeControlsTable.append(tr);
}

addCubeToVisualiser();
