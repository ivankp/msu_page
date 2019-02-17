#!/usr/bin/env python

import glob, sqlite3, json
from os.path import *

for f in glob.glob('db/*.db'):
    fcols = f[:-3] + '-cols.json'
    if exists(fcols) and (getmtime(f) <= getmtime(fcols)): continue
    print f
    db = sqlite3.connect(f)
    cols = [ [x[1]] for x in db.execute('pragma table_info(hist)').fetchall() ][:-2]
    for col in cols:
        print col[0]
        col.append([ x[0] for x in db.execute('select distinct %s from hist' % col[0]).fetchall() ])
    with open(fcols,'w') as f:
        json.dump(cols, f, separators=(',',':'))
    db.close()
