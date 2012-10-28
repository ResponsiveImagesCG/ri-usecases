anolis --omit-optional-tags --quote-attr-values --w3c-compat-xref-a-placement --filter=".publish, .w3conly, title + style" index.src.html index.html
#dependency: sudo gem install terminal-notifier
if command -v terminal-notifier >/dev/null 2>&1; then
    terminal-notifier -message "Finished processing ${PWD##*/}" -title "Anolis Processing done" -execute "open $PWD/index.html" -group "Anolis"
fi
