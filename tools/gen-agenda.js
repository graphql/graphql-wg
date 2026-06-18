#!/usr/bin/env node

const { spawnSync } = require('child_process');

const args = process.argv.slice(2);

// Run the wgutils agenda gen command using npx to ensure the binary is found
spawnSync('npx', ['wgutils', 'agenda', 'gen', ...args], { stdio: 'inherit' });
