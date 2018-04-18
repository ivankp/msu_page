#!/usr/bin/env python

import glob, json

print json.dumps(
    [ f for f in glob.glob('angular/data/*.json') ],
    separators=(',',':')
)

