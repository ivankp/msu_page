#!/usr/bin/env python

import glob, re, json

file_re = re.compile(
    r'(?:.*/)H(\d)j_(\d+)TeV_([^_]+)_([^_]+)_jetpt([^_]+)_([^_]+)_(B|RS|I|V).dat')

sets = [[x,set()] for x in [
    "nj","ene","pdf","jetalg","ptcut","scale","part"]]

for fname in glob.glob('scale/gosam/data/*.dat'):
    m = file_re.match(fname)
    if not m: continue

    for i,g in enumerate(m.groups()):
        sets[i][1].add(g)

def maybe_int(s):
  try:
      return int(s)
  except:
      return s

for s in sets:
    s[1] = sorted([maybe_int(x) for x in s[1]])

print json.dumps(sets, separators=(',',':'))

