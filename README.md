# Synote Media Fragment Player, use Media Fragment with ease.

* Author: [Yunjia Li, Web and Internet Science Group, University of Southampton]  (http://www.ecs.soton.ac.uk/people/yl2)
* Website: [http://smfplayer.synote.org] (http://smfplayer.synote.org)
* Documentation: [http://smfplayer.synote.org/documentation.html] (http://smfplayer.synote.org/documentation.html)
* License: MIT

## What is Synote Media Fragment Player
Synote Media Fragment player is a jQuery plugin (and a polyfill) that enables the replay of [media fragments] (http://www.w3.org/TR/media-frags/). parses the media fragment URI and automatically highlights the temporal and spatial fragments by using the APIs provided by cross-browser HTML5 <a href="http://mediaelementjs.com/" target="_blank">MediaElement.js</a> player. By doing so, you can play the media fragments not only from online multimedia files, but also online video sharing platforms, such as <a href="http://www.youtube.com" target="_blank">YouTube</a> and <a href="http://www.dailymotion.com" target="_blank">Dailymotion</a>. We also created a wrapper to help you choose the correct type of the <video> and <audio> based on the URL of the file or social media.

## Build from the source
You need to setup python on your computer to compile the resource. Delete the original files in _build_ folder, but leave the following three files:

		background.png
		flashmediaelement.swf
		silverlightmediaelement.xap

Then, in the _src_ folder of the source code, execute in command line:     
      
      python Builder.py      
      
Then the related javascript and css files will be minfied and put into the _build_ folder. Please note that the Flash and Silverlight player will NOT be compiled with _Builder.py_. So if you change any Flash and Silverlight source code, you need to compile them yourselves and put it under _build_ folder.

## Changelog

### Version History

*v1.0 (07/10/2013)*

* Fix a bug that multiple players cannot be initialised on the same page
* Add getOptions function
* Add support for initialising subtitles in multiple languages
* Update the demo page

*v1.0-alpha (02/04/2013)*

* First public version for test
* Use [medialement.js] (http://mediaelementjs.com/) as the backend cross-browers player.
* Automatically parse media fragment URI.
* Automatically select media type based on the media fragment URI, such as video/mp4.
* Highlight spatial fragment.
* Provide APIs to play temporal fragments and highlight spatial fragment.

### Features to be implemented
* Progress bar highlight for temporal fragments
* Support for Vimeo
* Synchronized spatial highlighting using WebVTT. See [Synchronized Formal Metadata Delivery with HTML5] (http://ninsuna.elis.ugent.be/html5/syncmeta/webvtt-turtle.html)
