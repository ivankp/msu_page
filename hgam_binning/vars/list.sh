#!/bin/bash

cd vars

for var in $(cut -d' ' -f1 'vars.lst')
do
  if [ -r "${var}_data.dat" ] && [ -r "${var}_mc.dat" ]
  then
    echo $var
  fi
done
