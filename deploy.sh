#!/usr/bin/env sh
set -e
yarn run build

cd dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:ckangwen/vue-basic-admin-layout.git master:gh-pages