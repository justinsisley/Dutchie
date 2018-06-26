#!/usr/bin/env node
const { argv } = require('yargs');
const commit = require('./commit');
const release = require('./release');

if (argv.commit) commit();
if (argv.release) release({ forceMajor: !!argv.major });
