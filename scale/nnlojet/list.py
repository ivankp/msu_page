#!/usr/bin/env python

import os, re

def repl_none(x):
    return x if x else ''

path = '/home/ivanp/public_html/scale/nnlojet/'

files = []
for f in os.listdir(path):
    m = re.match(r'(N*LO)(?:_(only))?(\d+)\.njets(?:\.([gq]{2}))?\.LH17\.txt',f)
    if (m==None): continue
    row = [ repl_none(m.group(i)) for i in range(1,5) ] + [f,[]]

    with open(path+f,'r') as f2:
        for line in [ l for l in f2 ][2:]:
            line = line.split()
            if (line[3][0]=='0'): break
            nj = int(float(line[1]))
            row[-1].append([nj,line[3::2]])

    files.append(row)

files.sort()
print 'var table_data =', files, ';'
