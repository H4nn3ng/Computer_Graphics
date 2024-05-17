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

in vec2 U_V;



out vec4 fragColor ;
// main function gets executed for every vertex
void main() {

    fragColor = texture(img, U_V) + texture(canvas_img, U_V);
}