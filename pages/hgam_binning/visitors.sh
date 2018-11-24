#!/bin/bash

while read line; do
  echo $line
  ip=$(sed 's/.* //' <<< $line)
  curl -s ipinfo.io/$ip | grep 'city\|country'
done < visitors.txt

