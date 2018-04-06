#!/usr/bin/env python

import sys, sqlite3

db = sqlite3.connect(sys.argv[1])
cur = db.cursor()

for col in ['Order','Only<sup>&dagger;</sup>','Jet R','ISP','Variable']:
    print '<td>', col, '</td>'

print '</tr><tr>'

# from collections import defaultdict as dd
#
# d = dd(lambda: lambda x: x)
# d['qcd_order'] = lambda x: 'N'*x + 'LO'
# d['isp'] = lambda x: 'any' if x is None else str(x)
# d['var'] = lambda x: str(x)

def fixvals(x):
    if isinstance(x,unicode): return str(x)
    if x is None: return ''
    return x

cols = [
    [ col, [fixvals(x[0]) for x in cur.execute('select distinct %s from nnlojet' % (col))] ]
    for col in ['qcd_order','only','jetR','isp','var']
]

for col in cols:
    print '<td><select id="%s"></select></td>' % (col[0])

print '<script> var fields =', cols, ';</script>'

