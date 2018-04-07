#!/usr/bin/env python

import sys, re, sqlite3, glob

db = sqlite3.connect('nnlojet.db')
cur = db.cursor()

cur.execute('DROP TABLE IF EXISTS nnlojet')
cur.execute('''CREATE TABLE nnlojet (
qcd_order INT, only INT, jetR INT, isp TEXT, var TEXT,
bin TEXT, xsec TEXT
)''')

file_re = re.compile(
    r'(?:.*/)(N*)LO(?:_(only))?(\d+)\.([^.]+)(?:\.([gq]{2}))?\.LH17\.txt')

def entries(glob_str):
    for fname in glob.glob(glob_str):
        m = file_re.match(fname)
        if not m: continue
        g = m.groups()
        vals = [ len(g[0]), g[1] == 'only', int(g[2]),
                 g[4], g[3].replace('dot','.') ]

        print vals

        with open(fname) as f:
            for line in f:
                if line[0]=='#': continue
                line = line.split()
                b = int(float(line[1])) if vals[-1]=='njets' \
                    else str([float(line[0]),float(line[2])])
                xsec = line[3::2]

                if all(float(x)==0 for x in xsec): continue

                yield vals + [b,str(xsec)]

glob_str = (sys.argv[1] if len(sys.argv)>1 else 'NNLOJET') + '/Data*/*.txt'
cur.executemany(
    'insert into nnlojet values (?,?,?,?,?,?,?)',
    entries(glob_str))

db.commit()

