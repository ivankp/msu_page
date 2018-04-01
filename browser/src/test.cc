#include <iostream>

int main(int argc, char* argv[]) {
  std::cout << "[[\"h1\",\""
    << (argc>1 ? argv[1] : "")
    << "\"]]" << std::endl;
}
