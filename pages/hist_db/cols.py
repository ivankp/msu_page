#!/usr/bin/env python

import glob, sqlite3, json, re
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

    var_ = [ int(x[0][3:]) for x in cols if re.match(r'^var[0-9]+$',x[0]) ]
    var_.sort()
    vals = [ ] # allowed variable combinations
    for i in range(len(var_)-1):
        d = { }
        for x in next(x[1] for x in cols if x[0]==('var%d'%var_[i])):
            print ' ', x
            d[x] = db.execute('select distinct var%s from hist where var%s="%s"' % (
                var_[i+1], var_[i], x
            )).fetchall()
        vals.append(d)

    with open(fcols,'w') as f:
        json.dump({'cols': cols, 'vals': vals}, f, separators=(',',':'))
    db.close()
