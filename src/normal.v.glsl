#version 300 es 

// These uniforms and attributes are provided by threejs.
// If you want to add your own, look at https://threejs.org/docs/#api/en/materials/ShaderMaterial #Custom attributes and uniforms
// defines the precision
precision highp float;

// = object.matrixWorld
uniform mat4 modelMatrix;

// = camera.matrixWorldInverse * object.matrixWorld
uniform mat4 modelViewMatrix;

// = camera.projectionMatrix
uniform mat4 projectionMatrix;

// = camera.matrixWorldInverse
uniform mat4 viewMatrix;

// = inverse transpose of modelViewMatrix
uniform mat3 normalMatrix;

// = camera position in world space
uniform vec3 cameraPosition;

uniform sampler2D img;

uniform sampler2D canvas_img;


// default vertex attributes provided by Geometry and BufferGeometry
in vec3 position;
in vec3 normal;
in vec2 uv;


out vec3 normal_vec;
out vec3 position_world3;
out vec2 uv_coordinates;

void main() {

    uv_coordinates = uv;
    
    mat3 matrix = mat3(transpose(inverse(modelMatrix)));
    normal_vec = matrix * normal;

    //position need to be in worldspace therefor mult with modelmatrix, cause object.matrisworld
    vec4 position_world = modelMatrix * vec4(position, 1.0);
    //make to vec3 because vec3 cameraposition  //teilen durch alpha wert
    position_world3 = (position_world.xyz/position_world.w); 

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.);
}