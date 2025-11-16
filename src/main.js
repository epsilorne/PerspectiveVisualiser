import * as THREE from 'three';
import { Visualiser } from "./visualiser";
import { indexToAxis } from './util'

const visualiser = new Visualiser();

/** Creating various UI elements. */

let fisheyeLabel = document.createElement("label");
fisheyeLabel.textContent = "enable fisheye effect (does nothing right now)";

let fisheyeToggle = document.createElement("input");
fisheyeToggle.type = "checkbox";
fisheyeToggle.checked = false;
fisheyeToggle.addEventListener("click", (_) => {
  visualiser.setFisheye(fisheyeToggle.checked)
})
fisheyeLabel.appendChild(fisheyeToggle);
document.body.appendChild(fisheyeLabel);

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
  let cube = visualiser.addCube(1, new THREE.Vector3(0, 0, 0));
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

  let lineColourLabel = document.createElement("label");
  lineColourLabel.textContent = "perpsective line colour (hex):";
  let lineColourInput = document.createElement("input");
  lineColourInput.size = 6;
  lineColourInput.addEventListener("input", (_) => {
    let hexColour = parseInt(lineColourInput.value, 16);
    obj.lineMaterial.color.setHex(hexColour);
  })
  lineColourLabel.appendChild(lineColourInput);
  tr.appendChild(lineColourLabel);

  let lineVisibleLabel = document.createElement("label");
  lineVisibleLabel.textContent = "perspective lines visible: ";

  let lineVisibleToggle = document.createElement("input");
  lineVisibleToggle.type = "checkbox";
  lineVisibleToggle.checked = true;
  lineVisibleToggle.addEventListener("click", (_) => {
    obj.setPerspectiveLineVisibility(lineVisibleToggle.checked);
  })

  lineVisibleLabel.appendChild(lineVisibleToggle);
  tr.appendChild(lineVisibleLabel);

  let deleteCol = document.createElement("td");
  let deleteCubeBtn = document.createElement("button");
  deleteCubeBtn.textContent = "delete cube";
  deleteCubeBtn.onclick = () => {
    visualiser.deleteCube(obj.id);
    cubeControlsTable.removeChild(tr);
  };
  deleteCol.appendChild(deleteCubeBtn);
  tr.appendChild(deleteCol);

  cubeControlsTable.append(tr);
}

addCubeToVisualiser();
