NHL Goal Alert System
=========

This project aims to build a simple script that monitors a NHL data feed for instant goal-alerts.  Starting with goal
horns, the system might expand to Philips Hue bulbs for feedback outside the host system itself, and/or external micro-
computers capable of running NodeJS that could replace a traditional host (ie. laptop).

Running the Script
=========

For the moment, a small selection of goal horns is provided and a single, default goal horn is used for all other teams.
In order to run the script, NodeJS and NPM must be installed.  Download the repository, run "sudo npm install" from the 
repository's root, and then run "node app.js" with the volume set to 11.
