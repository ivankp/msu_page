#include <iostream>

int main(int argc, char* argv[]) {
  std::cout << R"<(
  [
  { 
    "text" : "Child 1",
    "data" : "Child 1 Click" 
  },
  { 
    "text" : "Child 2", 
    "children" : true,
    "data" : "Child 2 Click"
  },
  { "text" : "Child 3",
    "data" : "Child 3 Click" 
  }
  ]
  )<" << std::endl;
}
