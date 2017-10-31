#!/bin/bash

file=../unweighted.js

l1=$(sed -n '/^var data/{=;q}' $file)
l2=$(sed -n "$l1,\${/^]/{=;q}}" $file)

(( ++l1 ))
(( --l2 ))

for (( l=$l1; l<=$l2; ++l ))
do
  name=$(sed -n "${l}p" $file | cut -d'"' -f18)
  echo $name
  name=../unw/$name

  sed -i "${l}s/\"[^\"]*\"/\"$(du -h ${name}.root | cut -f1)\"/10" $file
  sed -i "${l}s/\"[^\"]*\"/\"$(du -h ${name}.gz | cut -f1)\"/11" $file
  sed -i "${l}s/\"[^\"]*\"/\"$(./nevents.py ${name}.root | sed 's/^.*[^0-9,]//')\"/12" $file
done
