#!/usr/bin/env python

import sys, json, subprocess

req  = json.loads(sys.argv[1])

# print req

data = json.loads(subprocess.Popen(
        ['unxz','-c','data/'+req['file']+'.json.lzma'],
        stdout=subprocess.PIPE
    ).communicate()[0])

hists      = data['histograms']
categories = data['annotation']['bins'][:-1]
weights    = data['annotation']['weights']

# print [key for key in hists]

# print data['annotation']

hist = hists[req["hist"]]
ci   = [ c[1].index(req[c[0]]) for c in categories ]
wi   = weights.index(req["weight"])

bins = [ ]
for b in hist["bins"]:
    for i in ci:
        if b is None: break
        b = b[i]
    bins.append([ b[0][wi], b[1] ] if b is not None else None)

print json.dumps({ 'axes': hist['axes'], 'bins': bins },separators=(',',':'))

