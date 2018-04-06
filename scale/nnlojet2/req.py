#!/usr/bin/env python

import sys, json, sqlite3

req = json.loads(sys.argv[1] if len(sys.argv)>1 else '[]')

db = sqlite3.connect('/home/ivanp/public_html/scale/nnlojet2/nnlojet.db')
cur = db.cursor()

def fix_in(x):
    if x[1]=='': return '%s is null' % (x[0])
    return ('%s=%s' if x[1].isnumeric() else '%s="%s"') % x

sql_req = 'select * from nnlojet where ' + ' AND '.join(
    [fix_in(x) for x in req.items()])

def fix_out(x):
    if isinstance(x,unicode): return str(x)
    if x is None: return ''
    return x

# print sql_req
print [[fix_out(y) for y in x] for x in cur.execute(sql_req)]

