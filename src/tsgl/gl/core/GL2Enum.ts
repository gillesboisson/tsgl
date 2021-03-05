export enum GL2Enum
{ /* ClearBufferMask */
  DEPTH_BUFFER_BIT = 0x00000100,
  STENCIL_BUFFER_BIT = 0x00000400,
  COLOR_BUFFER_BIT = 0x00004000,

  /* BeginMode */
  POINTS = 0x0000,
  LINES = 0x0001,
  LINE_LOOP = 0x0002,
  LINE_STRIP = 0x0003,
  TRIANGLES = 0x0004,
  TRIANGLE_STRIP = 0x0005,
  TRIANGLE_FAN = 0x0006,

  /* AlphaFunction (not supported in ES20) */
  /*      NEVER */
  /*      LESS */
  /*      EQUAL */
  /*      LEQUAL */
  /*      GREATER */
  /*      NOTEQUAL */
  /*      GEQUAL */
  /*      ALWAYS */

  /* BlendingFactorDest */
  ZERO = 0,
  ONE = 1,
  SRC_COLOR = 0x0300,
  ONE_MINUS_SRC_COLOR = 0x0301,
  SRC_ALPHA = 0x0302,
  ONE_MINUS_SRC_ALPHA = 0x0303,
  DST_ALPHA = 0x0304,
  ONE_MINUS_DST_ALPHA = 0x0305,

  /* BlendingFactorSrc */
  /*      ZERO */
  /*      ONE */
  DST_COLOR = 0x0306,
  ONE_MINUS_DST_COLOR = 0x0307,
  SRC_ALPHA_SATURATE = 0x0308,
  /*      SRC_ALPHA */
  /*      ONE_MINUS_SRC_ALPHA */
  /*      DST_ALPHA */
  /*      ONE_MINUS_DST_ALPHA */

  /* BlendEquationSeparate */
  FUNC_ADD = 0x8006,
  BLEND_EQUATION = 0x8009,
  BLEND_EQUATION_RGB = 0x8009 /* same as BLEND_EQUATION */,
  BLEND_EQUATION_ALPHA = 0x883d,

  /* BlendSubtract */
  FUNC_SUBTRACT = 0x800a,
  FUNC_REVERSE_SUBTRACT = 0x800b,

  /* Separate Blend Functions */
  BLEND_DST_RGB = 0x80c8,
  BLEND_SRC_RGB = 0x80c9,
  BLEND_DST_ALPHA = 0x80ca,
  BLEND_SRC_ALPHA = 0x80cb,
  CONSTANT_COLOR = 0x8001,
  ONE_MINUS_CONSTANT_COLOR = 0x8002,
  CONSTANT_ALPHA = 0x8003,
  ONE_MINUS_CONSTANT_ALPHA = 0x8004,
  BLEND_COLOR = 0x8005,

  /* Buffer Objects */
  ARRAY_BUFFER = 0x8892,
  ELEMENT_ARRAY_BUFFER = 0x8893,
  ARRAY_BUFFER_BINDING = 0x8894,
  ELEMENT_ARRAY_BUFFER_BINDING = 0x8895,

  STREAM_DRAW = 0x88e0,
  STATIC_DRAW = 0x88e4,
  DYNAMIC_DRAW = 0x88e8,

  BUFFER_SIZE = 0x8764,
  BUFFER_USAGE = 0x8765,

  CURRENT_VERTEX_ATTRIB = 0x8626,

  /* CullFaceMode */
  FRONT = 0x0404,
  BACK = 0x0405,
  FRONT_AND_BACK = 0x0408,

  /* DepthFunction */
  /*      NEVER */
  /*      LESS */
  /*      EQUAL */
  /*      LEQUAL */
  /*      GREATER */
  /*      NOTEQUAL */
  /*      GEQUAL */
  /*      ALWAYS */

  /* EnableCap */
  /* TEXTURE_2D */
  CULL_FACE = 0x0b44,
  BLEND = 0x0be2,
  DITHER = 0x0bd0,
  STENCIL_TEST = 0x0b90,
  DEPTH_TEST = 0x0b71,
  SCISSOR_TEST = 0x0c11,
  POLYGON_OFFSET_FILL = 0x8037,
  SAMPLE_ALPHA_TO_COVERAGE = 0x809e,
  SAMPLE_COVERAGE = 0x80a0,

  /* ErrorCode */
  NO_ERROR = 0,
  INVALID_ENUM = 0x0500,
  INVALID_VALUE = 0x0501,
  INVALID_OPERATION = 0x0502,
  OUT_OF_MEMORY = 0x0505,

  /* FrontFaceDirection */
  CW = 0x0900,
  CCW = 0x0901,

  /* GetPName */
  LINE_WIDTH = 0x0b21,
  ALIASED_POINT_SIZE_RANGE = 0x846d,
  ALIASED_LINE_WIDTH_RANGE = 0x846e,
  CULL_FACE_MODE = 0x0b45,
  FRONT_FACE = 0x0b46,
  DEPTH_RANGE = 0x0b70,
  DEPTH_WRITEMASK = 0x0b72,
  DEPTH_CLEAR_VALUE = 0x0b73,
  DEPTH_FUNC = 0x0b74,
  STENCIL_CLEAR_VALUE = 0x0b91,
  STENCIL_FUNC = 0x0b92,
  STENCIL_FAIL = 0x0b94,
  STENCIL_PASS_DEPTH_FAIL = 0x0b95,
  STENCIL_PASS_DEPTH_PASS = 0x0b96,
  STENCIL_REF = 0x0b97,
  STENCIL_VALUE_MASK = 0x0b93,
  STENCIL_WRITEMASK = 0x0b98,
  STENCIL_BACK_FUNC = 0x8800,
  STENCIL_BACK_FAIL = 0x8801,
  STENCIL_BACK_PASS_DEPTH_FAIL = 0x8802,
  STENCIL_BACK_PASS_DEPTH_PASS = 0x8803,
  STENCIL_BACK_REF = 0x8ca3,
  STENCIL_BACK_VALUE_MASK = 0x8ca4,
  STENCIL_BACK_WRITEMASK = 0x8ca5,
  VIEWPORT = 0x0ba2,
  SCISSOR_BOX = 0x0c10,
  /*      SCISSOR_TEST */
  COLOR_CLEAR_VALUE = 0x0c22,
  COLOR_WRITEMASK = 0x0c23,
  UNPACK_ALIGNMENT = 0x0cf5,
  PACK_ALIGNMENT = 0x0d05,
  MAX_TEXTURE_SIZE = 0x0d33,
  MAX_VIEWPORT_DIMS = 0x0d3a,
  SUBPIXEL_BITS = 0x0d50,
  RED_BITS = 0x0d52,
  GREEN_BITS = 0x0d53,
  BLUE_BITS = 0x0d54,
  ALPHA_BITS = 0x0d55,
  DEPTH_BITS = 0x0d56,
  STENCIL_BITS = 0x0d57,
  POLYGON_OFFSET_UNITS = 0x2a00,
  /*      POLYGON_OFFSET_FILL */
  POLYGON_OFFSET_FACTOR = 0x8038,
  TEXTURE_BINDING_2D = 0x8069,
  SAMPLE_BUFFERS = 0x80a8,
  SAMPLES = 0x80a9,
  SAMPLE_COVERAGE_VALUE = 0x80aa,
  SAMPLE_COVERAGE_INVERT = 0x80ab,

  /* GetTextureParameter */
  /*      TEXTURE_MAG_FILTER */
  /*      TEXTURE_MIN_FILTER */
  /*      TEXTURE_WRAP_S */
  /*      TEXTURE_WRAP_T */

  COMPRESSED_TEXTURE_FORMATS = 0x86a3,

  /* HintMode */
  DONT_CARE = 0x1100,
  FASTEST = 0x1101,
  NICEST = 0x1102,

  /* HintTarget */
  GENERATE_MIPMAP_HINT = 0x8192,

  /* DataType */
  BYTE = 0x1400,
  UNSIGNED_BYTE = 0x1401,
  SHORT = 0x1402,
  UNSIGNED_SHORT = 0x1403,
  INT = 0x1404,
  UNSIGNED_INT = 0x1405,
  FLOAT = 0x1406,

  /* PixelFormat */
  DEPTH_COMPONENT = 0x1902,
  ALPHA = 0x1906,
  RGB = 0x1907,
  RGBA = 0x1908,
  LUMINANCE = 0x1909,
  LUMINANCE_ALPHA = 0x190a,

  /* PixelType */
  /*      UNSIGNED_BYTE */
  UNSIGNED_SHORT_4_4_4_4 = 0x8033,
  UNSIGNED_SHORT_5_5_5_1 = 0x8034,
  UNSIGNED_SHORT_5_6_5 = 0x8363,

  /* Shaders */
  FRAGMENT_SHADER = 0x8b30,
  VERTEX_SHADER = 0x8b31,
  MAX_VERTEX_ATTRIBS = 0x8869,
  MAX_VERTEX_UNIFORM_VECTORS = 0x8dfb,
  MAX_VARYING_VECTORS = 0x8dfc,
  MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8b4d,
  MAX_VERTEX_TEXTURE_IMAGE_UNITS = 0x8b4c,
  MAX_TEXTURE_IMAGE_UNITS = 0x8872,
  MAX_FRAGMENT_UNIFORM_VECTORS = 0x8dfd,
  SHADER_TYPE = 0x8b4f,
  DELETE_STATUS = 0x8b80,
  LINK_STATUS = 0x8b82,
  VALIDATE_STATUS = 0x8b83,
  ATTACHED_SHADERS = 0x8b85,
  ACTIVE_UNIFORMS = 0x8b86,
  ACTIVE_ATTRIBUTES = 0x8b89,
  SHADING_LANGUAGE_VERSION = 0x8b8c,
  CURRENT_PROGRAM = 0x8b8d,

  /* StencilFunction */
  NEVER = 0x0200,
  LESS = 0x0201,
  EQUAL = 0x0202,
  LEQUAL = 0x0203,
  GREATER = 0x0204,
  NOTEQUAL = 0x0205,
  GEQUAL = 0x0206,
  ALWAYS = 0x0207,

  /* StencilOp */
  /*      ZERO */
  KEEP = 0x1e00,
  REPLACE = 0x1e01,
  INCR = 0x1e02,
  DECR = 0x1e03,
  INVERT = 0x150a,
  INCR_WRAP = 0x8507,
  DECR_WRAP = 0x8508,

  /* StringName */
  VENDOR = 0x1f00,
  RENDERER = 0x1f01,
  VERSION = 0x1f02,

  /* TextureMagFilter */
  NEAREST = 0x2600,
  LINEAR = 0x2601,

  /* TextureMinFilter */
  /*      NEAREST */
  /*      LINEAR */
  NEAREST_MIPMAP_NEAREST = 0x2700,
  LINEAR_MIPMAP_NEAREST = 0x2701,
  NEAREST_MIPMAP_LINEAR = 0x2702,
  LINEAR_MIPMAP_LINEAR = 0x2703,

  /* TextureParameterName */
  TEXTURE_MAG_FILTER = 0x2800,
  TEXTURE_MIN_FILTER = 0x2801,
  TEXTURE_WRAP_S = 0x2802,
  TEXTURE_WRAP_T = 0x2803,

  /* TextureTarget */
  TEXTURE_2D = 0x0de1,
  TEXTURE = 0x1702,

  TEXTURE_CUBE_MAP = 0x8513,
  TEXTURE_BINDING_CUBE_MAP = 0x8514,
  TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515,
  TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516,
  TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517,
  TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518,
  TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519,
  TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851a,
  MAX_CUBE_MAP_TEXTURE_SIZE = 0x851c,

  /* TextureUnit */
  TEXTURE0 = 0x84c0,
  TEXTURE1 = 0x84c1,
  TEXTURE2 = 0x84c2,
  TEXTURE3 = 0x84c3,
  TEXTURE4 = 0x84c4,
  TEXTURE5 = 0x84c5,
  TEXTURE6 = 0x84c6,
  TEXTURE7 = 0x84c7,
  TEXTURE8 = 0x84c8,
  TEXTURE9 = 0x84c9,
  TEXTURE10 = 0x84ca,
  TEXTURE11 = 0x84cb,
  TEXTURE12 = 0x84cc,
  TEXTURE13 = 0x84cd,
  TEXTURE14 = 0x84ce,
  TEXTURE15 = 0x84cf,
  TEXTURE16 = 0x84d0,
  TEXTURE17 = 0x84d1,
  TEXTURE18 = 0x84d2,
  TEXTURE19 = 0x84d3,
  TEXTURE20 = 0x84d4,
  TEXTURE21 = 0x84d5,
  TEXTURE22 = 0x84d6,
  TEXTURE23 = 0x84d7,
  TEXTURE24 = 0x84d8,
  TEXTURE25 = 0x84d9,
  TEXTURE26 = 0x84da,
  TEXTURE27 = 0x84db,
  TEXTURE28 = 0x84dc,
  TEXTURE29 = 0x84dd,
  TEXTURE30 = 0x84de,
  TEXTURE31 = 0x84df,
  ACTIVE_TEXTURE = 0x84e0,

  /* TextureWrapMode */
  REPEAT = 0x2901,
  CLAMP_TO_EDGE = 0x812f,
  MIRRORED_REPEAT = 0x8370,

  /* Uniform Types */
  FLOAT_VEC2 = 0x8b50,
  FLOAT_VEC3 = 0x8b51,
  FLOAT_VEC4 = 0x8b52,
  INT_VEC2 = 0x8b53,
  INT_VEC3 = 0x8b54,
  INT_VEC4 = 0x8b55,
  BOOL = 0x8b56,
  BOOL_VEC2 = 0x8b57,
  BOOL_VEC3 = 0x8b58,
  BOOL_VEC4 = 0x8b59,
  FLOAT_MAT2 = 0x8b5a,
  FLOAT_MAT3 = 0x8b5b,
  FLOAT_MAT4 = 0x8b5c,
  SAMPLER_2D = 0x8b5e,
  SAMPLER_CUBE = 0x8b60,

  /* Vertex Arrays */
  VERTEX_ATTRIB_ARRAY_ENABLED = 0x8622,
  VERTEX_ATTRIB_ARRAY_SIZE = 0x8623,
  VERTEX_ATTRIB_ARRAY_STRIDE = 0x8624,
  VERTEX_ATTRIB_ARRAY_TYPE = 0x8625,
  VERTEX_ATTRIB_ARRAY_NORMALIZED = 0x886a,
  VERTEX_ATTRIB_ARRAY_POINTER = 0x8645,
  VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 0x889f,

  /* Read Format */
  IMPLEMENTATION_COLOR_READ_TYPE = 0x8b9a,
  IMPLEMENTATION_COLOR_READ_FORMAT = 0x8b9b,

  /* Shader Source */
  COMPILE_STATUS = 0x8b81,

  /* Shader Precision-Specified Types */
  LOW_FLOAT = 0x8df0,
  MEDIUM_FLOAT = 0x8df1,
  HIGH_FLOAT = 0x8df2,
  LOW_INT = 0x8df3,
  MEDIUM_INT = 0x8df4,
  HIGH_INT = 0x8df5,

  /* Framebuffer Object. */
  FRAMEBUFFER = 0x8d40,
  RENDERBUFFER = 0x8d41,

  RGBA4 = 0x8056,
  RGB5_A1 = 0x8057,
  RGB565 = 0x8d62,
  DEPTH_COMPONENT16 = 0x81a5,
  STENCIL_INDEX8 = 0x8d48,
  DEPTH_STENCIL = 0x84f9,

  RENDERBUFFER_WIDTH = 0x8d42,
  RENDERBUFFER_HEIGHT = 0x8d43,
  RENDERBUFFER_INTERNAL_FORMAT = 0x8d44,
  RENDERBUFFER_RED_SIZE = 0x8d50,
  RENDERBUFFER_GREEN_SIZE = 0x8d51,
  RENDERBUFFER_BLUE_SIZE = 0x8d52,
  RENDERBUFFER_ALPHA_SIZE = 0x8d53,
  RENDERBUFFER_DEPTH_SIZE = 0x8d54,
  RENDERBUFFER_STENCIL_SIZE = 0x8d55,

  FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = 0x8cd0,
  FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = 0x8cd1,
  FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 0x8cd2,
  FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 0x8cd3,

  COLOR_ATTACHMENT0 = 0x8ce0,
  DEPTH_ATTACHMENT = 0x8d00,
  STENCIL_ATTACHMENT = 0x8d20,
  DEPTH_STENCIL_ATTACHMENT = 0x821a,

  NONE = 0,

  FRAMEBUFFER_COMPLETE = 0x8cd5,
  FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8cd6,
  FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8cd7,
  FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8cd9,
  FRAMEBUFFER_UNSUPPORTED = 0x8cdd,

  FRAMEBUFFER_BINDING = 0x8ca6,
  RENDERBUFFER_BINDING = 0x8ca7,
  MAX_RENDERBUFFER_SIZE = 0x84e8,

  INVALID_FRAMEBUFFER_OPERATION = 0x0506,

  /* WebGL-specific enums */
  UNPACK_FLIP_Y_WEBGL = 0x9240,
  UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241,
  CONTEXT_LOST_WEBGL = 0x9242,
  UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243,
  BROWSER_DEFAULT_WEBGL = 0x9244,
  
  READ_BUFFER                                   = 0x0C02,
  UNPACK_ROW_LENGTH                             = 0x0CF2,
  UNPACK_SKIP_ROWS                              = 0x0CF3,
  UNPACK_SKIP_PIXELS                            = 0x0CF4,
  PACK_ROW_LENGTH                               = 0x0D02,
  PACK_SKIP_ROWS                                = 0x0D03,
  PACK_SKIP_PIXELS                              = 0x0D04,
  COLOR                                         = 0x1800,
  DEPTH                                         = 0x1801,
  STENCIL                                       = 0x1802,
  RED                                           = 0x1903,
  RGB8                                          = 0x8051,
  RGBA8                                         = 0x8058,
  RGB10_A2                                      = 0x8059,
  TEXTURE_BINDING_3D                            = 0x806A,
  UNPACK_SKIP_IMAGES                            = 0x806D,
  UNPACK_IMAGE_HEIGHT                           = 0x806E,
  TEXTURE_3D                                    = 0x806F,
  TEXTURE_WRAP_R                                = 0x8072,
  MAX_3D_TEXTURE_SIZE                           = 0x8073,
  UNSIGNED_INT_2_10_10_10_REV                   = 0x8368,
  MAX_ELEMENTS_VERTICES                         = 0x80E8,
  MAX_ELEMENTS_INDICES                          = 0x80E9,
  TEXTURE_MIN_LOD                               = 0x813A,
  TEXTURE_MAX_LOD                               = 0x813B,
  TEXTURE_BASE_LEVEL                            = 0x813C,
  TEXTURE_MAX_LEVEL                             = 0x813D,
  MIN                                           = 0x8007,
  MAX                                           = 0x8008,
  DEPTH_COMPONENT24                             = 0x81A6,
  MAX_TEXTURE_LOD_BIAS                          = 0x84FD,
  TEXTURE_COMPARE_MODE                          = 0x884C,
  TEXTURE_COMPARE_FUNC                          = 0x884D,
  CURRENT_QUERY                                 = 0x8865,
  QUERY_RESULT                                  = 0x8866,
  QUERY_RESULT_AVAILABLE                        = 0x8867,
  STREAM_READ                                   = 0x88E1,
  STREAM_COPY                                   = 0x88E2,
  STATIC_READ                                   = 0x88E5,
  STATIC_COPY                                   = 0x88E6,
  DYNAMIC_READ                                  = 0x88E9,
  DYNAMIC_COPY                                  = 0x88EA,
  MAX_DRAW_BUFFERS                              = 0x8824,
  DRAW_BUFFER0                                  = 0x8825,
  DRAW_BUFFER1                                  = 0x8826,
  DRAW_BUFFER2                                  = 0x8827,
  DRAW_BUFFER3                                  = 0x8828,
  DRAW_BUFFER4                                  = 0x8829,
  DRAW_BUFFER5                                  = 0x882A,
  DRAW_BUFFER6                                  = 0x882B,
  DRAW_BUFFER7                                  = 0x882C,
  DRAW_BUFFER8                                  = 0x882D,
  DRAW_BUFFER9                                  = 0x882E,
  DRAW_BUFFER10                                 = 0x882F,
  DRAW_BUFFER11                                 = 0x8830,
  DRAW_BUFFER12                                 = 0x8831,
  DRAW_BUFFER13                                 = 0x8832,
  DRAW_BUFFER14                                 = 0x8833,
  DRAW_BUFFER15                                 = 0x8834,
  MAX_FRAGMENT_UNIFORM_COMPONENTS               = 0x8B49,
  MAX_VERTEX_UNIFORM_COMPONENTS                 = 0x8B4A,
  SAMPLER_3D                                    = 0x8B5F,
  SAMPLER_2D_SHADOW                             = 0x8B62,
  FRAGMENT_SHADER_DERIVATIVE_HINT               = 0x8B8B,
  PIXEL_PACK_BUFFER                             = 0x88EB,
  PIXEL_UNPACK_BUFFER                           = 0x88EC,
  PIXEL_PACK_BUFFER_BINDING                     = 0x88ED,
  PIXEL_UNPACK_BUFFER_BINDING                   = 0x88EF,
  FLOAT_MAT2x3                                  = 0x8B65,
  FLOAT_MAT2x4                                  = 0x8B66,
  FLOAT_MAT3x2                                  = 0x8B67,
  FLOAT_MAT3x4                                  = 0x8B68,
  FLOAT_MAT4x2                                  = 0x8B69,
  FLOAT_MAT4x3                                  = 0x8B6A,
  SRGB                                          = 0x8C40,
  SRGB8                                         = 0x8C41,
  SRGB8_ALPHA8                                  = 0x8C43,
  COMPARE_REF_TO_TEXTURE                        = 0x884E,
  RGBA32F                                       = 0x8814,
  RGB32F                                        = 0x8815,
  RGBA16F                                       = 0x881A,
  RGB16F                                        = 0x881B,
  VERTEX_ATTRIB_ARRAY_INTEGER                   = 0x88FD,
  MAX_ARRAY_TEXTURE_LAYERS                      = 0x88FF,
  MIN_PROGRAM_TEXEL_OFFSET                      = 0x8904,
  MAX_PROGRAM_TEXEL_OFFSET                      = 0x8905,
  MAX_VARYING_COMPONENTS                        = 0x8B4B,
  TEXTURE_2D_ARRAY                              = 0x8C1A,
  TEXTURE_BINDING_2D_ARRAY                      = 0x8C1D,
  R11F_G11F_B10F                                = 0x8C3A,
  UNSIGNED_INT_10F_11F_11F_REV                  = 0x8C3B,
  RGB9_E5                                       = 0x8C3D,
  UNSIGNED_INT_5_9_9_9_REV                      = 0x8C3E,
  TRANSFORM_FEEDBACK_BUFFER_MODE                = 0x8C7F,
  MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS    = 0x8C80,
  TRANSFORM_FEEDBACK_VARYINGS                   = 0x8C83,
  TRANSFORM_FEEDBACK_BUFFER_START               = 0x8C84,
  TRANSFORM_FEEDBACK_BUFFER_SIZE                = 0x8C85,
  TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN         = 0x8C88,
  RASTERIZER_DISCARD                            = 0x8C89,
  MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS = 0x8C8A,
  MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS       = 0x8C8B,
  INTERLEAVED_ATTRIBS                           = 0x8C8C,
  SEPARATE_ATTRIBS                              = 0x8C8D,
  TRANSFORM_FEEDBACK_BUFFER                     = 0x8C8E,
  TRANSFORM_FEEDBACK_BUFFER_BINDING             = 0x8C8F,
  RGBA32UI                                      = 0x8D70,
  RGB32UI                                       = 0x8D71,
  RGBA16UI                                      = 0x8D76,
  RGB16UI                                       = 0x8D77,
  RGBA8UI                                       = 0x8D7C,
  RGB8UI                                        = 0x8D7D,
  RGBA32I                                       = 0x8D82,
  RGB32I                                        = 0x8D83,
  RGBA16I                                       = 0x8D88,
  RGB16I                                        = 0x8D89,
  RGBA8I                                        = 0x8D8E,
  RGB8I                                         = 0x8D8F,
  RED_INTEGER                                   = 0x8D94,
  RGB_INTEGER                                   = 0x8D98,
  RGBA_INTEGER                                  = 0x8D99,
  SAMPLER_2D_ARRAY                              = 0x8DC1,
  SAMPLER_2D_ARRAY_SHADOW                       = 0x8DC4,
  SAMPLER_CUBE_SHADOW                           = 0x8DC5,
  UNSIGNED_INT_VEC2                             = 0x8DC6,
  UNSIGNED_INT_VEC3                             = 0x8DC7,
  UNSIGNED_INT_VEC4                             = 0x8DC8,
  INT_SAMPLER_2D                                = 0x8DCA,
  INT_SAMPLER_3D                                = 0x8DCB,
  INT_SAMPLER_CUBE                              = 0x8DCC,
  INT_SAMPLER_2D_ARRAY                          = 0x8DCF,
  UNSIGNED_INT_SAMPLER_2D                       = 0x8DD2,
  UNSIGNED_INT_SAMPLER_3D                       = 0x8DD3,
  UNSIGNED_INT_SAMPLER_CUBE                     = 0x8DD4,
  UNSIGNED_INT_SAMPLER_2D_ARRAY                 = 0x8DD7,
  DEPTH_COMPONENT32F                            = 0x8CAC,
  DEPTH32F_STENCIL8                             = 0x8CAD,
  FLOAT_32_UNSIGNED_INT_24_8_REV                = 0x8DAD,
  FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING         = 0x8210,
  FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE         = 0x8211,
  FRAMEBUFFER_ATTACHMENT_RED_SIZE               = 0x8212,
  FRAMEBUFFER_ATTACHMENT_GREEN_SIZE             = 0x8213,
  FRAMEBUFFER_ATTACHMENT_BLUE_SIZE              = 0x8214,
  FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE             = 0x8215,
  FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE             = 0x8216,
  FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE           = 0x8217,
  FRAMEBUFFER_DEFAULT                           = 0x8218,
  UNSIGNED_INT_24_8                             = 0x84FA,
  DEPTH24_STENCIL8                              = 0x88F0,
  UNSIGNED_NORMALIZED                           = 0x8C17,
  DRAW_FRAMEBUFFER_BINDING                      = 0x8CA6, /* Same as FRAMEBUFFER_BINDING */
  READ_FRAMEBUFFER                              = 0x8CA8,
  DRAW_FRAMEBUFFER                              = 0x8CA9,
  READ_FRAMEBUFFER_BINDING                      = 0x8CAA,
  RENDERBUFFER_SAMPLES                          = 0x8CAB,
  FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER          = 0x8CD4,
  MAX_COLOR_ATTACHMENTS                         = 0x8CDF,
  COLOR_ATTACHMENT1                             = 0x8CE1,
  COLOR_ATTACHMENT2                             = 0x8CE2,
  COLOR_ATTACHMENT3                             = 0x8CE3,
  COLOR_ATTACHMENT4                             = 0x8CE4,
  COLOR_ATTACHMENT5                             = 0x8CE5,
  COLOR_ATTACHMENT6                             = 0x8CE6,
  COLOR_ATTACHMENT7                             = 0x8CE7,
  COLOR_ATTACHMENT8                             = 0x8CE8,
  COLOR_ATTACHMENT9                             = 0x8CE9,
  COLOR_ATTACHMENT10                            = 0x8CEA,
  COLOR_ATTACHMENT11                            = 0x8CEB,
  COLOR_ATTACHMENT12                            = 0x8CEC,
  COLOR_ATTACHMENT13                            = 0x8CED,
  COLOR_ATTACHMENT14                            = 0x8CEE,
  COLOR_ATTACHMENT15                            = 0x8CEF,
  FRAMEBUFFER_INCOMPLETE_MULTISAMPLE            = 0x8D56,
  MAX_SAMPLES                                   = 0x8D57,
  HALF_FLOAT                                    = 0x140B,
  RG                                            = 0x8227,
  RG_INTEGER                                    = 0x8228,
  R8                                            = 0x8229,
  RG8                                           = 0x822B,
  R16F                                          = 0x822D,
  R32F                                          = 0x822E,
  RG16F                                         = 0x822F,
  RG32F                                         = 0x8230,
  R8I                                           = 0x8231,
  R8UI                                          = 0x8232,
  R16I                                          = 0x8233,
  R16UI                                         = 0x8234,
  R32I                                          = 0x8235,
  R32UI                                         = 0x8236,
  RG8I                                          = 0x8237,
  RG8UI                                         = 0x8238,
  RG16I                                         = 0x8239,
  RG16UI                                        = 0x823A,
  RG32I                                         = 0x823B,
  RG32UI                                        = 0x823C,
  VERTEX_ARRAY_BINDING                          = 0x85B5,
  R8_SNORM                                      = 0x8F94,
  RG8_SNORM                                     = 0x8F95,
  RGB8_SNORM                                    = 0x8F96,
  RGBA8_SNORM                                   = 0x8F97,
  SIGNED_NORMALIZED                             = 0x8F9C,
  COPY_READ_BUFFER                              = 0x8F36,
  COPY_WRITE_BUFFER                             = 0x8F37,
  COPY_READ_BUFFER_BINDING                      = 0x8F36, /* Same as COPY_READ_BUFFER */
  COPY_WRITE_BUFFER_BINDING                     = 0x8F37, /* Same as COPY_WRITE_BUFFER */
  UNIFORM_BUFFER                                = 0x8A11,
  UNIFORM_BUFFER_BINDING                        = 0x8A28,
  UNIFORM_BUFFER_START                          = 0x8A29,
  UNIFORM_BUFFER_SIZE                           = 0x8A2A,
  MAX_VERTEX_UNIFORM_BLOCKS                     = 0x8A2B,
  MAX_FRAGMENT_UNIFORM_BLOCKS                   = 0x8A2D,
  MAX_COMBINED_UNIFORM_BLOCKS                   = 0x8A2E,
  MAX_UNIFORM_BUFFER_BINDINGS                   = 0x8A2F,
  MAX_UNIFORM_BLOCK_SIZE                        = 0x8A30,
  MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS        = 0x8A31,
  MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS      = 0x8A33,
  UNIFORM_BUFFER_OFFSET_ALIGNMENT               = 0x8A34,
  ACTIVE_UNIFORM_BLOCKS                         = 0x8A36,
  UNIFORM_TYPE                                  = 0x8A37,
  UNIFORM_SIZE                                  = 0x8A38,
  UNIFORM_BLOCK_INDEX                           = 0x8A3A,
  UNIFORM_OFFSET                                = 0x8A3B,
  UNIFORM_ARRAY_STRIDE                          = 0x8A3C,
  UNIFORM_MATRIX_STRIDE                         = 0x8A3D,
  UNIFORM_IS_ROW_MAJOR                          = 0x8A3E,
  UNIFORM_BLOCK_BINDING                         = 0x8A3F,
  UNIFORM_BLOCK_DATA_SIZE                       = 0x8A40,
  UNIFORM_BLOCK_ACTIVE_UNIFORMS                 = 0x8A42,
  UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES          = 0x8A43,
  UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER     = 0x8A44,
  UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER   = 0x8A46,
  INVALID_INDEX                                 = 0xFFFFFFFF,
  MAX_VERTEX_OUTPUT_COMPONENTS                  = 0x9122,
  MAX_FRAGMENT_INPUT_COMPONENTS                 = 0x9125,
  MAX_SERVER_WAIT_TIMEOUT                       = 0x9111,
  OBJECT_TYPE                                   = 0x9112,
  SYNC_CONDITION                                = 0x9113,
  SYNC_STATUS                                   = 0x9114,
  SYNC_FLAGS                                    = 0x9115,
  SYNC_FENCE                                    = 0x9116,
  SYNC_GPU_COMMANDS_COMPLETE                    = 0x9117,
  UNSIGNALED                                    = 0x9118,
  SIGNALED                                      = 0x9119,
  ALREADY_SIGNALED                              = 0x911A,
  TIMEOUT_EXPIRED                               = 0x911B,
  CONDITION_SATISFIED                           = 0x911C,
  WAIT_FAILED                                   = 0x911D,
  SYNC_FLUSH_COMMANDS_BIT                       = 0x00000001,
  VERTEX_ATTRIB_ARRAY_DIVISOR                   = 0x88FE,
  ANY_SAMPLES_PASSED                            = 0x8C2F,
  ANY_SAMPLES_PASSED_CONSERVATIVE               = 0x8D6A,
  SAMPLER_BINDING                               = 0x8919,
  RGB10_A2UI                                    = 0x906F,
  INT_2_10_10_10_REV                            = 0x8D9F,
  TRANSFORM_FEEDBACK                            = 0x8E22,
  TRANSFORM_FEEDBACK_PAUSED                     = 0x8E23,
  TRANSFORM_FEEDBACK_ACTIVE                     = 0x8E24,
  TRANSFORM_FEEDBACK_BINDING                    = 0x8E25,
  TEXTURE_IMMUTABLE_FORMAT                      = 0x912F,
  MAX_ELEMENT_INDEX                             = 0x8D6B,
  TEXTURE_IMMUTABLE_LEVELS                      = 0x82DF,
}