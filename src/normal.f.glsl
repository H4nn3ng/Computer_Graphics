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

uniform sampler2D normals;

uniform float ambient_reflectance;
uniform float diffuse_reflectance;
uniform float specular_reflectance;
uniform float magnitude;
uniform vec3 specular_color; 


// default vertex attributes provided by Geometry and BufferGeometry
in vec3 position;
in vec3 normal;
in vec2 uv;
in vec2 uv_coordinates;
in vec3 position_world3;
in vec3 normal_vec;

out  vec4 fragColor;

void main() {

    vec3 light_source = vec3(2.0, 2.0, 3.0);
    //"verbinden"
    vec3 N = texture(normals, uv_coordinates).rgb;
    N = normalize(N * 2.0 -1.0);

    vec3 diffuse_color = texture(img, uv_coordinates).rgb;
    vec3 ambient_color = texture(img, uv_coordinates).rgb;


//Exercise 3 (Phong.f)

    vec3 ambient_fragColor = ambient_reflectance * ambient_color;
    //no vec4(...., 1.0) w-coord, cause gonna be added at the end

    vec3 L = normalize(light_source - position_world3);
    //von position_world zum licht

    //angle cannot fall under zero
    float lambert = max(dot(N,L), 0.0);
    
    vec3 lambert_fragColor = vec3(diffuse_reflectance * lambert * diffuse_color);
    //no vec4(...., 1.0) w-coord, cause gonna be added at the end


    //////////////////////////////////////////SPECULAR


    // vec4 view_vec4 = modelViewMatrix * vec4(position, 1.0);
    // vec3 view_vec3 = view_vec4.xyz/view_vec4.w;
    // vec3 V = normalize(-view_vec3);
    //means only when its possible that light hits the surface

    float specAngel_shininess = 0.; //für letzten farbaufruf

    float lambert2 = dot(N,L);
    //wenn da überhaupt nen winkel ist, einfallendes ray und N (N*L >= 0)
    if (lambert2 >= 0.0) { //N*L >= 0
    //vector object to viewer(camera) length 1
    vec3 V = normalize(cameraPosition - position_world3);
    

    //lightvector refected and der stelle des normalsvektor invertiert weil symmetrisch gespiegel am N-vektor
    vec3 R = reflect(-L, N);

    //angle(cosinus) cannot fall under zero
    float specular_winkel = max(dot(R,V), 0.0);
    // angle between reflection beam and view_vec

    //pow = angel to the power of magnitude
    
    // if(magnitude > 1.){
    //     specAngel_shininess = pow(specular_winkel, magnitude);
    // } else {
    //     specAngel_shininess = pow(specular_winkel, 1.);

    // }// (only for better looks)
    if(magnitude == 0.0) {
        specAngel_shininess = pow(specular_winkel, 1.0);
    }
    else {
        specAngel_shininess = pow(specular_winkel, magnitude);
    }
    

   
    }

    vec3 specular_fragColor = vec3(specular_reflectance * specAngel_shininess * specular_color);
    //no vec4(...., 1.0) w-coord, cause gonna be added at the end

    /////////////////////////////////////////SUM
    
    vec4 illu = vec4(ambient_fragColor+ lambert_fragColor + specular_fragColor, 1.0);

    fragColor = vec4(texture(canvas_img, uv_coordinates).rgb, 1.0) + illu;
}