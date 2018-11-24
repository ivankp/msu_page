#!/usr/bin/env python

import sys

if (len(sys.argv)!=2): sys.exit(1)

from ROOT import TFile, TTree

f = TFile(sys.argv[1])
t = f.Get("events")
print "{:,}".format( t.GetEntries() )
