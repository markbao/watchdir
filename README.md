watchdir
========

watch a directory. perform a command on change.

## Install

`npm install -g watchdir`

## Use

#### Automatically `make` on change in current directory

`watchdir -c 'make'`

#### Watch a different directory

`watchdir -c 'make' -d ~/code/skynet/`

#### Execute any command you want

`watchdir -c 'npm become-overlord --planet=earth'`

## Options

````
Usage:
  watchdir [OPTIONS]

Options:
  -d, --dir [PATH]       Directory to watch (Default is .)
  -c, --command STRING   Command to execute on change
  -w, --watchfile        Use node's fs.watchFile instead of fs.watch (Sometimes watch fails noticing changes in files)
  -k, --no-color         Omit color from output
      --debug            Show debug information
  -h, --help             Display help and usage details
````

## Contribute

1. Fork.
2. Pull request.
3. Hallelujah.
