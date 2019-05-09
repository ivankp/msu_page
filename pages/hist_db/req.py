#!/usr/bin/env python

import sys, json, sqlite3
# import struct

req = json.load(sys.stdin)
db = sqlite3.connect('data/'+req['db']+'.db')

multi = ''.join( ', '+k for k,xs in req['labels'].items() if len(xs)>1 )

hs = db.execute(
'select edges, bins' + multi + ' from hist' +
' inner join axes on hist.axis = axes.id' +
' where ' +
' and '.join(
    '('+(' or '.join('%s="%s"' % (k,x) for x in xs))+')'
     for k,xs in req['labels'].items())
).fetchall()
db.close()

sys.stdout.write('[')
first = True
for h in hs:
    if first: first = False
    else: sys.stdout.write(',')
    sys.stdout.write(
      '[['+h[0]+'],['+h[1]+'],\"'+
      ' '.join('*' if x=='' else x for x in h[2:])+'\"]')
sys.stdout.write(']')

