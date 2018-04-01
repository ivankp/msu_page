EXE := ../bin/req_root ../bin/test

ROOT_CFLAGS := $(shell root-config --cflags)
ROOT_LIBS   := $(shell root-config --libs)

all: $(EXE)

$(EXE): ../bin/%: %.cc
	g++ -Wall -O3 $(ROOT_CFLAGS) $< -o $@ $(ROOT_LIBS)

