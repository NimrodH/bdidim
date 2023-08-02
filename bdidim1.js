"use strict"
var scene = window.scene;
let currentSession = null;
/////////////////// COLORS & ROTATIONS //////////////////////////
///colors and rotations vectors
const baseColor = new BABYLON.Color3(0.54, 0.13, 0.54)
const notSelectedColor = new BABYLON.Color3(1, 0, 1);//pink
const selectedColor = new BABYLON.Color3(1, 1, 0);//yellow
const blueColor = new BABYLON.Color3(0, 0, 1);
const redColor = new BABYLON.Color3(1, 0, 0);
const blackColor = new BABYLON.Color3(0, 0, 0);
const greenColor = new BABYLON.Color3(0, 1, 0);

const rotationO = new BABYLON.Vector3(0, 0, 0);//only for model
const rotationX = new BABYLON.Vector3(1.5708, 0, 0);
const rotationY = new BABYLON.Vector3(0, 1.5708, 0);
const rotationZ = new BABYLON.Vector3(0, 0, 1.5708);//Math.PI / 2 get diferent value in its last digit here and when called from mesh

const colorsObj = [
    { "colorName": "blue", "colorVector": blueColor },
    { "colorName": "base", "colorVector": baseColor },
    { "colorName": "red", "colorVector": redColor },
    { "colorName": "green", "colorVector": greenColor },
    { "colorName": "black", "colorVector": blackColor },
    { "colorName": "selected", "colorVector": selectedColor },
    { "colorName": "notSelected", "colorVector": notSelectedColor }
];

function rotationVector2Name(vector) {
    if (vector.y > 0) { return "Y" };
    if (vector.z > 0) { return "Z" };
    if (vector.x > 0) { return "X" };
    return "X";
}

function rotationName2Vector(theName) {
    switch (theName) {
        case "X":
            return rotationX
            break;
        case "Y":
            return rotationY
            break;
        case "Z":
            return rotationZ
            break;
        default:
            return rotationO
            break;
    }
}
function colorName2Vector(theColorName) {
    return colorsObj.filter(c => c.colorName == theColorName)[0].colorVector;
}

function colorVector2Name(theColorVector) {
    return colorsObj.filter(c => c.colorVector == theColorVector)[0].colorName;
}
/////////////////// end COLORS & ROTATIONS //////////////////////////

///we can't use split(".") because we have: b2.p-0.5
function fullName2Private(theFullName) {
    let firstDot = theFullName.indexOf(".") + 1;
    return theFullName.substr(firstDot);
}

//const tableURL = 'https://9ewp86ps3e.execute-api.us-east-1.amazonaws.com/development/model';
//const usersURL = 'https://9ewp86ps3e.execute-api.us-east-1.amazonaws.com/development/users';
let selectedConnection;///the sphere that was clicked on one of the elements outside the model


///move block and connect it to model
function animate(box, oldPos, newPos, scene) {
    const frameRate = 40;
    const xSlide = new BABYLON.Animation("xSlide", "position", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    const keyFrames = [];
    keyFrames.push({
        frame: 0,
        value: oldPos
    });
    keyFrames.push({
        frame: 2 * frameRate,
        value: newPos
    });

    xSlide.setKeys(keyFrames);
    scene.beginDirectAnimation(box, [xSlide], 0, 2 * frameRate, false, 1, add2model);

    function add2model() {

    }
   }
 

    function getTop(model) {
        model.refreshBoundingInfo();
        model.computeWorldMatrix(true);
        var boundingInfo = model.getHierarchyBoundingVectors();
        return boundingInfo.max.y;


    }


    function createNearMenu(mode) {
 
    }


    function setSelectedConnectionColor(theColor) {
        let vectorColor = colorName2Vector(theColor);
        if (selectedConnection) {
            selectedConnection.parent.material.diffuseColor = vectorColor;
            if (currentSession) {
                currentSession.reportClick("color", theColor, selectedConnection.parent);
            }
        }
    }
    function colorBlue() {
        setSelectedConnectionColor("blue");
    }
    function colorRed() {
        setSelectedConnectionColor("red");
    }
    function colorBlack() {
        setSelectedConnectionColor("black");
    }
    function colorGreen() {
        setSelectedConnectionColor("green");
    }

    ///return true if the block numbered "blockNumber"
    ///used by removeLastBlock & rebuild--> 
    function isBlockByBlockNum(block, blockNumber) {
        if (block.metadata) {
            return block.metadata.blockNum == blockNumber;
        } else {
            return false;
        }
    }
    ///return true if the sphere named "sphereName"
    ///used by removeLastBlock & rebuild--> 
    function isSphereBySphereName(sphere, sphereName) {
        if (sphere.name) {
            return sphere.name == sphereName;
        } else {
            return false;
        }
    }


    ///defign and highlite the conection sphere
    function doClickConnection(event) {
        let connectionSphere = event.source;
        let sphereParent = connectionSphere.parent
       
            let childs = sphereParent.getChildMeshes(false);
            for (let index = 0; index < childs.length; index++) {
                const element = childs[index];
                if (element.material.diffuseColor == notSelectedColor) {
                    element.material.diffuseColor = selectedColor;
                } else {
                    element.material.diffuseColor = notSelectedColor;
                }
            }
        
        
    }

    ///CREATE ELEMENTS (USED FOR MENU)
    ///add sphere to Block/wheel 
    function addMeshContactSphere(meshParent, meshPosition) {
        let tempSphere = BABYLON.MeshBuilder.CreateSphere("p" + meshPosition, { diameterZ: 1.2 })
        tempSphere.parent = meshParent;
        tempSphere.position.x = meshPosition;
        initMeshContactSphere(tempSphere);
    }

    ///set matirial and action to connection sphere (called from addMeshContactSphere and connect) 
    function initMeshContactSphere(tempSphere) {
        const myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
        myMaterial.diffuseColor = notSelectedColor;
        tempSphere.material = myMaterial;

        tempSphere.actionManager = new BABYLON.ActionManager(scene);
        tempSphere.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, doClickConnection))
    }

    ///create rectangle element (block)
    function meshBlock(scene, blockWidth, scaleFactor = 0.25, x = 0, y = 0.25, z = 0) {

        const scailingVector = new BABYLON.Vector3(scaleFactor, scaleFactor, scaleFactor);

        const box = BABYLON.MeshBuilder.CreateBox("b" + blockWidth, { width: blockWidth, height: 1 });
        const myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
        myMaterial.diffuseColor = baseColor;//new BABYLON.Color3(0.54, 0.13, 0.54);
        box.material = myMaterial;
        //box.position.x = 2;
        const blockWidthFloor = Math.floor(blockWidth / 2);
        if (blockWidthFloor == blockWidth / 2) { //זוגי
            for (let index = 0; index < blockWidthFloor; index++) {
                console.log(blockWidthFloor);
                addMeshContactSphere(box, -index - 0.5)
                addMeshContactSphere(box, index + 0.5)
            }
        } else { //פירדי
            for (let index = 0; index < blockWidthFloor + 1; index++) {
                addMeshContactSphere(box, index)
                if (index !== 0) {
                    addMeshContactSphere(box, -index)
                }
            }
        }
        box.scaling = scailingVector;
        //box.position.x = menuX;

        box.position.x = x;
        box.position.y = y;
        box.position.z = z;
        return box
    }
////////////////////// end of CREATE ELEMENTS ///////////////////////////