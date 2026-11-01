#!/usr/bin/env bash
set -e

mkdir -p bin
if [ ! -f bin/tectonic ]; then
  echo "Downloading Tectonic compiler binary..."
  curl -fsSL https://github.com/tectonic-typesetting/tectonic/releases/download/tectonic%400.15.0/tectonic-0.15.0-x86_64-unknown-linux-musl.tar.gz | tar -xz -C bin
  chmod +x bin/tectonic
  echo "Tectonic installed to bin/tectonic"
else
  echo "Tectonic already exists at bin/tectonic"
fi
