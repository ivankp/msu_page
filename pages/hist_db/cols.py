#!/usr/bin/env python

import sys, glob, sqlite3, json, re
from os.path import *

for f in glob.glob('db/*.db'):
    fcols = f[:-3] + '-cols.json'
    if '-f' not in sys.argv:
        if exists(fcols) and (getmtime(f) <= getmtime(fcols)): continue
    print f
    db = sqlite3.connect(f)
    cols = [ [x[1]] for x in db.execute('pragma table_info(hist)').fetchall() ][:-2]
    for col in cols:
        print col[0]
        col.append([ x[0] for x in db.execute('select distinct %s from hist' % col[0]).fetchall() ])

    var_ = [ x[0] for x in cols if re.match(r'^var[0-9]+$',x[0]) ]
    vals = { } # allowed variable combinations
    for i in range(len(var_)-1):
        d = { }
        for x in next(x[1] for x in cols if x[0]==var_[i]):
            print ' ', x
            d[x] = [ a[0] for a in
                db.execute('select distinct %s from hist where %s="%s"' % (
                    var_[i+1], var_[i], x
                )).fetchall() ]
        vals[var_[i]] = [var_[i+1],d]

    with open(fcols,'w') as f:
        json.dump({'cols': cols, 'vals': vals}, f, separators=(',',':'))
    db.close()
