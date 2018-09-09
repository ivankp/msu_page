#!/bin/bash

shopt -s nullglob

for f in data/*.xz; do
  base=$(sed 's/\.xz$//' <<< $f)
  echo $base
  unxz $f
  lzma $base
done

