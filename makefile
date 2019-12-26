BUILD = emcc
LINK = emcc

MEMORY_OPTIONS = -s TOTAL_MEMORY=32MB -s ALLOW_MEMORY_GROWTH=0
#MEMORY_OPTIONS = -s TOTAL_MEMORY=256MB
OPTIMIZATION_OPTIONS = -O3
LLVM_OPTIONS = '['-inline']'

EXPORTED_FUNCTIONS = '["_malloc","_free","_realloc"]'


SRC_DIR = src
BUILD_DIR = dist
OBJ_DIR = obj

#OPTIMIZATION_OPTIONS = 
LINK_FLAGS = --llvm-opts $(LLVM_OPTIONS) $(OPTIMIZATION_OPTIONS) $(MEMORY_OPTIONS) -s STANDALONE_WASM -s NO_EXIT_RUNTIME=1 -s NO_FILESYSTEM=1 -s SAFE_HEAP=1 -s ASSERTIONS=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]' -s EXPORTED_FUNCTIONS=$(EXPORTED_FUNCTIONS)
BUILD_FLAGS = -c $(OPTIMIZATION_OPTIONS)

PROJECT_NAME = em_app


SOURCES = $(wildcard $(addprefix $(SRC_DIR)/,*.c)) $(wildcard $(addprefix $(SRC_DIR)/core/,*.c)) $(wildcard $(addprefix $(SRC_DIR)/glmatrix/,*.c))  $(wildcard $(addprefix $(SRC_DIR)/geom/,*.c))
OBJECTS = $(SOURCES:$(SRC_DIR)/%.c=$(OBJ_DIR)/%.o)
OBJECTS_DIRS = $(OBJ_DIR) $(OBJ_DIR)/glmatrix $(OBJ_DIR)/geom $(OBJ_DIR)/core


all: $(PROJECT_NAME)

$(PROJECT_NAME): $(OBJECTS)
	rm -fr $(addprefix $(BUILD_DIR)/,$(PROJECT_NAME).wasm) 
	$(LINK) $(OBJECTS) -o $(addprefix $(BUILD_DIR)/,$@.js) $(LINK_FLAGS)
	


$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c
	$(BUILD) $< -o $@ $(BUILD_FLAGS)

hard_clean: clean
	rm -fr $(OBJ_DIR)
	mkdir $(OBJECTS_DIRS)

clean:
	rm -f $(addprefix $(BUILD_DIR)/,$(PROJECT_NAME).js) $(addprefix $(BUILD_DIR)/,$(PROJECT_NAME).wasm) $(OBJECTS)

