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
in vec3 position_world3;
in vec3 normal_vec;

float pi = 3.14159265359;
float u;
float v;
vec2 U_V;

out vec4 fragColor;

void main() {

    //Normal
    vec3 N = normalize(normal_vec);
    //Ray
    vec3 R = normalize(position_world3 - cameraPosition);
    //Interpolated = reflection with normal?//note:nachschlagen
    vec3 I = reflect(R, N);

    

    u = ((pi + atan(-I.z, I.x)) / (2.0 * pi));

    v = ((atan(sqrt((pow(I.x, 2.0)) + (pow( I.z, 2.0))), -I.y))/pi);

    U_V = vec2(u,v);

    fragColor = texture(img, U_V) + texture(canvas_img, U_V);

}