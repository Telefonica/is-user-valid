'use strict';

var config = require('merge-config')(),
    path = require('path');

// Configuration is composed by merging the JSON files from a directory (process.env.CONFIG_DIR) and from
// the default configuration (./config/config.json).
// Note that the directory is optional, but if present, it overrides the default configuration.

try {
  if (process.env.CONFIG_DIR) {
    config.file(process.env.CONFIG_DIR);
  }
  config.file(path.join(__dirname, 'config', 'config.json'));
} catch (error) {
  throw error;
}

module.exports = config;
