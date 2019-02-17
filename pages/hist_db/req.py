#!/usr/bin/env python

import sys, json, sqlite3

req = json.load(sys.stdin)
db = sqlite3.connect('db/'+req['db']+'.db')

json.dump(db.execute(
'select edges, bins from hist' + \
' inner join axes on hist.axis = axes.id' + \
' where ' + \
' and '.join(
    '('+(' or '.join('%s="%s"' % (k,x) for x in xs))+')'
     for k,xs in req['labels'].items())
).fetchall(), sys.stdout, separators=(',',':'))

db.close()

