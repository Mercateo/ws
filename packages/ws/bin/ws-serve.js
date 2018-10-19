#!/bin/sh
':' // ; exec "$(command -v nodejs || command -v node)" --max_old_space_size=4096 "$0" "$@";
  .charAt(0);

// workaround for Linux issue (infinite loop)
// source: http://unix.stackexchange.com/a/65295/29509

const express = require('express');
const history = require('connect-history-api-fallback');
const { join } = require('path');
const { project } = require('../dist');

const app = express();

const publicPath = project.ws.publicPath ? project.ws.publicPath : '/';
app.use((req, res, next) => {
  if (publicPath !== '/' && req.path === '/') {
    res.redirect(publicPath);
  } else {
    next();
  }
});
app.use(
  history({
    index: join(publicPath, '/index.html')
  })
);
app.use(publicPath, express.static(project.ws.distReleaseDir));

app.listen(8080);
console.log('Serve project at http://localhost:8080.');
