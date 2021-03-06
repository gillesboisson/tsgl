

vec3 blinnPhong(vec3 modelPosition,
 vec3 modelNormal,
 vec3 lightDir,
 vec3 lightColor,
 vec3 specularColor,
 vec3 cameraPosition,
 float shininess){
      
      // calculate base vectors
      vec3 viewDir    = normalize(modelPosition - cameraPosition);
      vec3 halfwayDir = normalize(lightDir + viewDir);
      
      // diffuse

      float diff = max(dot(modelNormal, lightDir), 0.0);
      vec3 diffuse = lightColor * diff;

      // specular
      float spec = max(pow(max(dot(modelNormal, halfwayDir), 0.0), shininess),0.0);
      vec3 specular = specularColor * spec;


      #ifndef DEBUG_LIGHT_DIFFUSE_SPEC
      return specular + diffuse;
      #endif

      #ifdef DEBUG_LIGHT_DIFFUSE
      return diffuse;
      #endif

      #ifdef DEBUG_LIGHT_SPECULAR
      return specular;
      #endif

}

#pragma glslify: export(blinnPhong)