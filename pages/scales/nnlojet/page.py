#!/usr/bin/env python

import sys, sqlite3, json

db = sqlite3.connect(sys.argv[1])
cur = db.cursor()

def fix_out(x):
    if isinstance(x,unicode): return str(x)
    if x is None: return ''
    return x

cols = [
    [ col, [fix_out(x[0]) for x in
        cur.execute('select distinct %s from nnlojet' % (col))] ]
    for col in ['qcd_order','only','jetR','isp','var']
]
cols.append(['bin',[]]);
print json.dumps(cols,separators=(',',':'))

