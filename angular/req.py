#!/usr/bin/env python

import sys, glob, re, json

req = {
    'nj': r'\d',
    'ene': r'\d+',
    'pdf': r'[^_]+',
    'jetalg': r'[^_]+',
    'ptcut': r'[^_]+',
    'scale': r'[^_]+',
    'part': r'B|RS|I|V'
}
req.update(
    json.loads(sys.argv[1] if len(sys.argv)>1 else '[]')
)

pat = r'(?:.*/)H(%(nj)s)j_(%(ene)s)TeV_(%(pdf)s)_(%(jetalg)s)_jetpt(%(ptcut)s)_(%(scale)s)_(%(part)s).dat'

file_re = re.compile(pat % req)

def maybe_int(s):
  try:
      return int(s)
  except:
      return s

fs = []

for fname in glob.glob('data/*.dat'):
    m = file_re.match(fname)
    if not m: continue

    fs.append([maybe_int(g) for g in m.groups()])

fs.sort()

print json.dumps(fs, separators=(',',':'))

