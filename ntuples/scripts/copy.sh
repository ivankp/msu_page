#!/bin/bash

ssh ivanp@alpheus.aglt2.org "
cd /msu/data/t3work9/ivanp/hists/merged;
tar c -T list.txt
" | tar xv -C data

