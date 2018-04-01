#include <iostream>
#include <sstream>
#include <stdexcept>
#include <dirent.h>

using std::cout;
using std::cerr;
using std::endl;

template <typename... T>
std::string cat(T&&... x) {
  std::stringstream ss;
  using expander = int[];
  (void)expander{0, ((void)(ss << std::forward<T>(x)), 0)...};
  return ss.str();
}
std::string cat() { return { }; }

struct error : std::runtime_error {
  using std::runtime_error::runtime_error;
  template <typename... T>
  error(T&&... x): std::runtime_error(cat(x...)) { };
};

void dir_loop(const std::string& path) {
  DIR *dir;
  struct dirent *ent;
  if ((dir = opendir(path.c_str()))) {
    while ((ent = readdir(dir))) {
      auto name = ent->d_name;
      if (name[0]=='.') continue;
      const bool is_dir = (ent->d_type == DT_DIR);
      cout << "[\"" << (is_dir ? "d" : "f") << "\",\"";
      cout << name << "\"";
      if (is_dir) {
        cout << ",[";
        dir_loop(cat(path,'/',name));
        cout << "],";
      }
      cout << ']';
    }
    closedir(dir);
  } else throw error("could not open directory ",path);
}

int main(int argc, char* argv[]) {
  dir_loop("/home/ivanp/public_html/browser/files");
}
