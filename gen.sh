#!/bin/bash
anolis --w3c-shortname="respimg-usecases" --pubdate="15 Jan 2013" --omit-optional-tags --quote-attr-values --w3c-compat-xref-a-placement --filter=".ricg" index.src.html index.html

#dependency: html5 tidy https://github.com/w3c/tidy-html5
if command -v tidy >/dev/null 2>&1; then
	tidy -q -utf8 -i -o index.html index.html
fi

#dependency: sudo gem install terminal-notifier
if command -v terminal-notifier >/dev/null 2>&1; then
    terminal-notifier -message "Finished processing ${PWD##*/}" -title "Anolis Processing done" -execute "open $PWD/index.html" -group "Anolis"
fi
