uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColotOffset;
uniform float uColorMutiplier;

varying float  vElevation;


void main(){
    float mixStrangthColor = (vElevation + uColotOffset) * uColorMutiplier;
    vec3 color = mix(uDepthColor,uSurfaceColor,mixStrangthColor);
    gl_FragColor = vec4(color,1.0);
}