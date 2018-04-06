#!/bin/bash

sqlite3 $1 '.schema nnlojet' | sed '1s/nnlojet/tmp/' | sqlite3 $1

sqlite3 $1 <<SQL
  INSERT INTO tmp SELECT * FROM nnlojet ORDER BY var, qcd_order, jetR, isp;
  DROP TABLE nnlojet;
  ALTER TABLE tmp RENAME TO nnlojet;
  VACUUM;
SQL

