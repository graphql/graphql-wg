#!/usr/bin/env node
console.error(
  `\
Please instead run:

  yarn && yarn gen-agenda ${process.argv.slice(2).join(" ")}
`
);
process.exit(1);
