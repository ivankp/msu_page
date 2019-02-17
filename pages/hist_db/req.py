#!/usr/bin/env python

import sys, json, sqlite3, struct

req = json.load(sys.stdin)
db = sqlite3.connect('db/'+req['db']+'.db')

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

# hs = [ (','.join(h[0].split()),h[1]) for h in hs ]
# print '[' + ','.join( '[[' +
#     ','.join(h[0].split()) + '],["' +
#     struct.unpack('d'*(), h[1]) + '"]]'
# for h in hs ) + ']'

sys.stdout.write('[')
first = True
for h in hs:
    if first: first = False
    else: sys.stdout.write(',')
    sys.stdout.write('[['+h[0]+'],['+h[1]+'],\"'+' '.join(h[2:])+'\"]')
sys.stdout.write(']')

# json.dump(hs, sys.stdout, separators=(',',':'))

