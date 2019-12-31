#ifndef CORE_HELPERS
#define CORE_HELPERS
#include <stdbool.h>

#define PRINT_RED "\x1B[31m"
#define PRINT_GRN "\x1B[32m"
#define PRINT_YEL "\x1B[33m"
#define PRINT_BLU "\x1B[34m"
#define PRINT_MAG "\x1B[35m"
#define PRINT_CYN "\x1B[36m"
#define PRINT_WHT "\x1B[37m"
#define PRINT_RESET "\x1B[0m"

bool assert(bool condition, char *message);

#endif