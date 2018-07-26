#!/bin/sh
':' // ; exec "$(command -v nodejs || command -v node)" --max_old_space_size=4096 "$0" "$@";
  .charAt(0);

// workaround for Linux issue (infinite loop)
// source: http://unix.stackexchange.com/a/65295/29509

require('../dist')
  .buildTranslations()
  .then(() => console.log('Build translations'));
