#!/usr/bin/env node
var sys = require('sys'),
	fs = require("fs"),
	path = require('path'),
    exec = require('child_process').exec,
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	today = new Date(),
	pubdate = today.getDate() + ' ' + months[today.getMonth()] + ' ' + today.getFullYear(),
	filter = '.w3c',
	shortName = path.basename(process.cwd()),
	output = 'index.html',
	pubDir = process.cwd() + '/pub',
    argv = require('optimist')
           .usage('Usage: $0 [-w3c] [-pubdate \"dd Mon yyy\"] [-type ED|WD|CR|PR|REC]')
           .default('pubdate', pubdate)
           .default('type', 'ED')
           .default('name', shortName)
           .argv,
    child, anolis;

if (argv.hasOwnProperty('w3c') && argv.w3c) {
	//default to Working Draft
	if (argv.type === 'ED') {
		argv.type = 'WD';
	}

	//Take out all RICG stuff if we are targetting W3C
	filter = '.ricg';

	//e.g., "WD_21Dec2012.html"
	output = 'pub/' + argv.type + '_' + argv.pubdate.split(' ').join('') + '.html';

	//check that we have a pub directory
	if(fs.existsSync(pubDir) === false){
		fs.mkdirSync(pubDir);
	}
}

anolis = 'anolis --w3c-compat --output-encoding=utf8' +
         ' --omit-optional-tags --quote-attr-values' +
         ' --w3c-status=' + argv.type +
         ' --pubdate=\"' + argv.pubdate + '\"'+
         ' --w3c-shortname=' + argv.name +
         ' --filter=\"'+ filter + '\"'+
         ' index.src.html ' + output;

exec(anolis, function(error, stdout, stderr) {
	if (error) {
		console.log('Something went wrong', error, stdout, stderr);
		return;
	}
	showNotification();
});

function showNotification() {
	var hasNotifier = 'command -v terminal-notifier >/dev/null 2>&1';
	exec(hasNotifier, function(error, stdout, stderr) {
		var command;
		//No notifier, so abort
		if (error !== null) {
			console.log('Missing optional dependency: sudo gem install terminal-notifier');
			return;
		}
		command = 'terminal-notifier '+
                  '-message \"Finished processing document.\" '+
                  '-title \"Anolis Processing done\" '+
                  '-execute \"open '+ process.cwd() + '/'+ output + '\" '+
                  '-group \"Anolis\"';
    exec(command);
	});
}
