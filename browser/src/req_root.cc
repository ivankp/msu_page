#include <iostream>
#include <sstream>
#include <stdexcept>

#include <TClass.h>
#include <TFile.h>
#include <TKey.h>
#include <TH1.h>

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

std::ostream& operator<<(std::ostream& s, const TDirectory& d) {
  const TDirectory* m = d.GetMotherDir();
  if (!m) return s;
  if (m->GetMotherDir()) s << *m << ',';
  return s << '\"' << d.GetName() << '\"';
}

int main(int argc, char* argv[]) {
  if (argc!=2 && argc!=3) {
    cerr << "usage: " << argv[0] << " file.root [dir]" << endl;
    return 1;
  }

  TFile fin(argv[1]);
  if (fin.IsZombie()) return 1;

  TDirectory *dir = (argc==2 ? &fin : fin.GetDirectory(argv[2]));

  cout << '[';
  bool first = true;
  for (TObject* obj : *dir->GetListOfKeys()) {
    TKey *key = static_cast<TKey*>(obj);
    const TClass* key_class = TClass::GetClass(key->GetClassName());
    if (!key_class) continue;
    if (key_class->InheritsFrom(TH1::Class())) { // HIST
      const TH1 *h = static_cast<TH1*>(key->ReadObj());
      const int nbins = h->GetNbinsX() + 2;

      if (!first) cout << ',';
      cout << "[\"h1\",\"" << h->GetName() << "\",[";
      for (int i=1; i<nbins; ++i)
        cout <<(i==1 ? "" : ",")<< h->GetBinLowEdge(i);
      cout << "],[";
      for (int i=0; i<nbins; ++i)
        cout <<(i==0 ? "" : ",")<< h->GetBinContent(i);
      cout << "],[";
      for (int i=0; i<nbins; ++i)
        cout <<(i==0 ? "" : ",")<< h->GetBinError(i);
      cout << "]]";

    } else if (key_class->InheritsFrom(TDirectory::Class())) { // DIR
      const auto *d = static_cast<TDirectory*>(key->ReadObj());

      if (!first) cout << ',';
      cout << "[\"d\",\"" << d->GetName() << "\"]";

    } else continue;
    if (first) first = false;
  }
  cout << ']';
}

