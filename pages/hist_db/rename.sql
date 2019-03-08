PRAGMA foreign_keys=off;

BEGIN TRANSACTION;

ALTER TABLE hist RENAME TO _hist;

CREATE TABLE hist(
proc TEXT,
type TEXT,
jet TEXT,
weight TEXT,
isp TEXT,
photon_cuts TEXT,
central_higgs TEXT,
nsubjets TEXT,
flavor1 TEXT,
flavor2 TEXT,
var1 TEXT,
var2 TEXT,
axis INTEGER,
bins TEXT
);

INSERT INTO hist SELECT * FROM _hist;

COMMIT;

PRAGMA foreign_keys=on;
