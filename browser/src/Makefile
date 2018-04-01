EXE := ../bin/browser

all: $(EXE)

../bin/browser: ../bin/%: %.cc
	g++ -std=c++14 -Wall -O3 $< -o $@

