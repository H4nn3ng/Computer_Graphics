// external dependencies
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//H
// local from us provided utilities
import * as utils from "./lib/utils";
import RenderWidget from "./lib/rendererWidget";
import { Application, createWindow } from "./lib/window";

// helper lib, provides exercise dependent prewritten Code
import * as helper from "./helper";
import ImageWidget from "./imageWidget";
import { CanvasTexture, Color, EquirectangularReflectionMapping, Texture } from "three";

import uv_vShader from './uv.v.glsl';
import uv_fShader from './uv.f.glsl';
import spherical_vShader from './spherical.v.glsl';
import spherical_fShader from './spherical.f.glsl';
import sphericalFixed_vShader from './sphericalFixed.v.glsl';
import sphericalFixed_fShader from './sphericalFixed.f.glsl';
import environment_vShader from './environment.v.glsl';
import environment_fShader from './environment.f.glsl';
import normal_vShader from './normal.v.glsl';
import normal_fShader from './normal.f.glsl';



function main() {

  // create scene
  let scene = new THREE.Scene();
  var mesh = new THREE.Mesh();
  
  // mesh = helper.setupGeometry(scene);
  // helper.setupLight(scene);

  let root = Application("Texturing");
  root.setLayout([["texture", "renderer"]]);
  root.setLayoutColumns(["50%", "50%"]);
  root.setLayoutRows(["100%"]);

  // ---------------------------------------------------------------------------
  // create Settings and create GUI settings
  let settings = new helper.Settings();
  let gui = helper.createGUI(settings);
  gui.open();
  // adds the callback that gets called on settings change
  settings.addCallback(callback);

  // ---------------------------------------------------------------------------
  let textureDiv = createWindow("texture");
  root.appendChild(textureDiv);

  // the image widget. Change the image with setImage
  // you can enable drawing with enableDrawing
  // and it triggers the event "updated" while drawing


  // ---------------------------------------------------------------------------
  // create RenderDiv
  let rendererDiv = createWindow("renderer");
  root.appendChild(rendererDiv);


  // create renderer
  let renderer = new THREE.WebGLRenderer({
    antialias: true, // to enable anti-alias and get smoother output
  });

  // create camera
  let camera = new THREE.PerspectiveCamera();
  helper.setupCamera(camera, scene);

  // create controls
  let controls = new OrbitControls(camera, rendererDiv);
  helper.setupControls(controls);

  let wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
  wid.animate();

  mesh.geometry = helper.createQuad();

/////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
let ImgWid = new ImageWidget(textureDiv);
ImgWid.setImage('./textures/earth.jpg');
mesh.geometry = helper.createQuad();
ImgWid.enableDrawing();



var Drawing_canvas = ImgWid.getDrawingCanvas();
var canvas_texture = new THREE.CanvasTexture(Drawing_canvas); 

//clear drawing
settings.pen = () => {ImgWid.clearDrawing()};
canvas_texture.needsUpdate = true;


var environment_active = false;
var texture_pic :THREE.Texture = new THREE.TextureLoader().load('./textures/earth.jpg');
//now map(discord advise)
texture_pic.mapping = EquirectangularReflectionMapping;

ImgWid.DrawingCanvas.addEventListener('updated', function() {
  canvas_texture.needsUpdate = true;
});


function callback(changed: utils.KeyValuePair<helper.Settings>) {
switch (changed.key) {
  case "geometry":
    geometry_selector(changed.value);
    break;
  case "texture":
    texture_selector(changed.value);
    break;
  case "shader":
    if(changed.value == "UV attribute") {
      //einfach wegen consistency  
     shaderUpdate(uv_vShader, uv_fShader);
    }
    if(changed.value == "Spherical") {
      //einfach wegen consistency  
     shaderUpdate(spherical_vShader, spherical_fShader);
    }
    if(changed.value == "Spherical (fixed)") {
      //einfach wegen consistency  
     shaderUpdate(sphericalFixed_vShader, sphericalFixed_fShader);
    }
    if(changed.value == "Environment Mapping") {
      //einfach wegen consistency  
     shaderUpdate(environment_vShader, environment_fShader);
    }
    if(changed.value == "Normal Map") {
      //einfach wegen consistency  
     shaderUpdate(normal_vShader, normal_fShader);
    }
    break;
  case "environment":
    //just copy the given img
    if(changed.value == true) {
    scene.background = material.uniforms.img.value;
    material.uniforms.img.value.mapping = EquirectangularReflectionMapping;
    }
    else{
      var black = new THREE.Color('black');
      scene.background = black;
    }
    environment_active = true;


    break;
  case "normalmap":
    if (changed.value == "Uniform") {
      material.uniforms.normals.value = new THREE.TextureLoader()
      .load('./textures/uniform_normals.jpg')
    }
    if (changed.value == "Terracotta") {
      material.uniforms.normals.value = new THREE.TextureLoader()
      .load('./textures/terracotta_normals.jpg')
    }
    if (changed.value == "Plastic") {
      material.uniforms.normals.value = new THREE.TextureLoader()
      .load('./textures/plastic_normals.jpg')
    }
    if (changed.value == "Wood") {
      material.uniforms.normals.value = new THREE.TextureLoader()
      .load('./textures/wood_ceiling_normals.jpg')
    }
    if (changed.value == "Lava") {
      material.uniforms.normals.value = new THREE.TextureLoader()
      .load('./textures/lava_normals.jpg')
    }
    if (changed.value == "Rock") {
      material.uniforms.normals.value = new THREE.TextureLoader()
      .load('./textures/rock_normals.jpg')
    }
    break;
  // case "pen":
  //   console.log("hallo");
  //     ImgWid.clearDrawing();
  //     canvas_texture.needsUpdate = true;
    
  //   break;
 
  default:
    break;
}
}


                              ///////////////////////////////

  function texture_selector(texture: string) {

    var path = './textures/'+texture+'.jpg';
    ImgWid.setImage(path);

    var texture_pic2 = new THREE.TextureLoader().load(path);
    //neues Bild in img reinalden
    material.uniforms.img.value = texture_pic2;

    //automatic anpassen an environment mapping
    if(environment_active == true) {
      scene.background = material.uniforms.img.value;
    }
  }
//------------------------------------------------------------------------
 
var material = new THREE.RawShaderMaterial( {
    //"default shader"
    vertexShader: uv_vShader,
    fragmentShader: uv_fShader,
    });

var uniforms : {[uniform: string] : THREE.IUniform};
  uniforms = {

  img: {value: texture_pic},
  canvas_img: {value: canvas_texture},
  normals: {value: new THREE.TextureLoader()
            .load('./textures/uniform_normals.jpg')},

  ambient_reflectance: {value: 0.2},
  diffuse_reflectance: {value: 1.0},
  specular_reflectance: {value: 0.25},
  magnitude: {value: 50.0},
  specular_color: {value: new THREE.Vector3(255/255, 255/255, 255/255)},
  
}
  material.uniforms = uniforms;
  mesh.material = material;


function shaderUpdate(vertexShader :any, fragmentShader:any) {

    material.vertexShader = vertexShader;
    material.fragmentShader = fragmentShader;
    material.uniforms = uniforms;
    mesh.material = material;
    material.needsUpdate = true;
}

//------------------------------------------------------------------------

  function geometry_selector(geo: string) {

    if(geo == "Box") {
      mesh.geometry = helper.createBox();
      material.uniforms = uniforms;
      
    }
    if(geo == "Sphere") {
      mesh.geometry = helper.createSphere();
      material.uniforms = uniforms;
      
    }
    if(geo == "Knot") {
      mesh.geometry = helper.createKnot();
      material.uniforms = uniforms;
      
    }
    if(geo == "Quad") {
      mesh.geometry = helper.createQuad();
      material.uniforms = uniforms;
      
    }
    if(geo == "Bunny") {
      mesh.geometry = helper.createBunny();
      material.uniforms = uniforms;
      
    }
  }


  scene.add(mesh);

}


// call main entrypoint
main();
