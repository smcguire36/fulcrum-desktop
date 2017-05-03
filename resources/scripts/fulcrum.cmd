@echo off

set ELECTRON_RUN_AS_NODE=1

..\Fulcrum.exe --max-old-space-size=16384 fulcrum.js %*
