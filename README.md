vTouch
======

vTouch is an webbased ableton live remote control running in html5 canvas.

Quickstart
==========

1. git clone git@github.com:vnoise/vtouch.git
2. git submodule init
3. git submodule update
4. cd node-osc; git submodule init; git submodule update (probably there is a better way to do this)
5. Install node.js (download and compile on linux/osx or download the windows binaries)
6. Copy the folder vtouch/LiveOSC to the Remote Scripts Folder of Ableton Live.
7. Start Ableton Live and activate the remote script Preferences / MIDI.
8. Run: node server.js (windows) or sudo node server.js (linux/osc)
9. Navigate your browser to http://localhost