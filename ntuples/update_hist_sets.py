#!/usr/bin/env python

import json, glob, re
from subprocess import Popen, PIPE

# out = [ ['set', 'hists', 'bins', 'info'] ]

out = [ ]

for fname in glob.glob('data/*.json.xz'):
    j = json.loads(Popen(["xz","-dc",fname],stdout=PIPE).communicate()[0])
    # out[re.sub(r'.*/(.*)\.json\.xz',r'\1',fname)] = {
    #     "hists": sorted([ h for h in j['histograms'] ]),
    #     "bins" : j['annotation']['bins'],
    #     "info" : {'jets': j['annotation']['runcard']['analysis']['jets']}
    # }
    out.append([
        re.sub(r'.*/(.*)\.json\.xz',r'\1',fname),
        sorted([ h for h in j['histograms'] ]),
        j['annotation']['bins'],
        {'jets': j['annotation']['runcard']['analysis']['jets']}
    ])

with open('hist_sets.json','w') as f:
    json.dump(out,f,separators=(',',':'))

