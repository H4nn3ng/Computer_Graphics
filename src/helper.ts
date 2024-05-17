import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as dat from 'dat.gui';

// local from us provided utilities
import * as utils from './lib/utils';
import bunny from './models/bunny.obj';
import ImageWidget from './imageWidget';
//import {reset_drawing} from './main'


/*******************************************************************************
 * helper functions to build scene (geometry, light), camera and controls.
 ******************************************************************************/

// enum(s)
export enum Geometries { quad = "Quad", box = "Box", sphere = "Sphere", knot = "Knot", bunny = "Bunny" }
export enum Textures { Earth = "Earth", Colors = "Colors", Disturb = "Disturb", Checker = "Checker", Terracotta = "Terracotta", Plastic = "Plastic", wood_ceiling = "wood_ceiling", Lava = "Lava", Rock = "Rock", Environment = "indoor"}
export enum NormalMaps { uniform_normals = "Uniform", terracotta_normals = "Terracotta", plastic_normals = "Plastic", wood_ceiling_normals = "Wood", lava_normals = "Lava", rock_normals = "Rock"}
export enum Shaders { uv = "UV attribute", spherical = "Spherical", fixSpherical = "Spherical (fixed)", envMapping = "Environment Mapping", normalmap = "Normal Map" }


export class Settings extends utils.Callbackable{
  texture: Textures = Textures.Earth;
  geometry: Geometries = Geometries.quad;
  shader: Shaders = Shaders.uv;
  pen: () => void = () => {};
  environment: boolean = false;
  normalmap: NormalMaps = NormalMaps.uniform_normals;
}

export function createGUI(params: Settings): dat.GUI {
  var gui: dat.GUI = new dat.GUI();

  gui.add(params, 'texture', utils.enumOptions(Textures)).name('Texture')
  gui.add(params, 'geometry', utils.enumOptions(Geometries)).name('Geometry')
  gui.add(params, 'shader', utils.enumOptions(Shaders)).name('Shader')
  gui.add(params, 'normalmap', utils.enumOptions(NormalMaps)).name('Normal Map')
  gui.add(params, "pen").name("Clear Drawing")
  gui.add(params, "environment").name("Environment")

  return gui;
}

export function createBunny(){
  const loader = new OBJLoader();
  var geometry = new THREE.BufferGeometry();
  var mesh = loader.parse(bunny).children[0];
  if (mesh instanceof THREE.Mesh){
      geometry = mesh.geometry as THREE.BufferGeometry;
  }
  geometry.setIndex([...Array(geometry.attributes.position.count).keys()]);
  return geometry;
}

export function createBox(){
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  return geometry;
}

export function createSphere(){
  var geometry = new THREE.SphereGeometry(0.6, 30, 30);
  return geometry;
}

export function createKnot(){
  var geometry = new THREE.TorusKnotGeometry(0.4, 0.1, 100, 32);
  return geometry;
}

 // define camera that looks into scene
export function setupCamera(camera: THREE.PerspectiveCamera, scene: THREE.Scene){
  // https://threejs.org/docs/#api/cameras/PerspectiveCamera
  camera.near = 0.01;
  camera.far = 1000;
  camera.fov = 70;
  camera.position.z = 2;
  camera.lookAt(scene.position);
  camera.updateProjectionMatrix()
  return camera
}

 // define controls (mouse interaction with the renderer)
export function setupControls(controls: OrbitControls){
  // https://threejs.org/docs/#examples/en/controls/OrbitControls
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.enableZoom = true;
  controls.keys = {LEFT: 65, UP:87, RIGHT: 68, BOTTOM:83};
  controls.minDistance = 0.1;
  controls.maxDistance = 9;
  return controls;
}


export function setupLight(scene: THREE.Scene){
  // add two point lights and a basic ambient light
  // https://threejs.org/docs/#api/lights/PointLight
  var light = new THREE.PointLight(0xffffcc, 1, 100);
  light.position.set( 10, 30, 15 );
  scene.add(light);

  var light2 = new THREE.PointLight(0xffffcc, 1, 100);
  light2.position.set( 10, -30, -15 );
  scene.add(light2);

  //https://threejs.org/docs/#api/en/lights/AmbientLight
  scene.add(new THREE.AmbientLight(0x999999));
  return scene;
}

export function createQuad() {
  var geo = new THREE.BufferGeometry();
  const vertices = new Float32Array(
    [-1.0,-1.0, 1.0,
      1.0,-1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
     -1.0, 1.0, 1.0,
     -1.0,-1.0, 1.0]);

  geo.setAttribute( 'position', new THREE.BufferAttribute(vertices, 3));

  var uv_p = new Float32Array(
    [0., 0., 1.0,
     1.0, 0., 1.0,
     1.0, 1.0, 1.0,
     1.0, 1.0, 1.0,
     0., 1.0, 1.0,
     0., 0., 1.0]
  );

  geo.setAttribute('uv', new THREE.BufferAttribute(uv_p, 3));

  //discord
  geo.computeVertexNormals();
  

  return geo;
};
function clearDrawing(): void {
  throw new Error('Function not implemented.');
}