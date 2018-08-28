#!/bin/bash

for f in data/*.xz; do
  unxz $f
  lzma $(sed 's/\.xz$//' <<< $f)
done

