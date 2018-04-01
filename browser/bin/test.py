#!/usr/bin/env python

import sys

print '[ { "text" : "', sys.argv, '", "data" : "Child 1 Click" }, { "text" : "Child 2", "children" : true, "data" : "Child 2 Click" }, { "text" : "Child 3", "data" : "Child 3 Click" } ]'
