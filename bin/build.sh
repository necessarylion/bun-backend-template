#!/bin/bash

bun build ./server.ts \
  --minify \
  --sourcemap \
  --compile \
  --outfile ./server
