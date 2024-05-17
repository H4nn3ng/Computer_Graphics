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
in vec3 positionFixed;


float pi = 3.14159265359;
float u;
float v;
vec2 U_V;

out vec4 fragColor;

void main() {

    u = ((pi + atan(-positionFixed.z,positionFixed.x)) / (2.0 * pi));

    v = ((atan(sqrt((pow(positionFixed.x, 2.0)) + (pow(positionFixed.z, 2.0))), -positionFixed.y))/pi);

    U_V = vec2(u,v);

    fragColor = texture(img, U_V) + texture(canvas_img, U_V);


}