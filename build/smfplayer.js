var MediaFragments = (function(window) {
  
  //  "use strict";  
  
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fun /*, thisp */) {
      "use strict";
      if (this === void 0 || this === null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (typeof fun !== "function") {
        throw new TypeError();
      }
      var thisp = arguments[1];
      for (var i = 0; i < len; i++) {
        if (i in t) {
          fun.call(thisp, t[i], i, t);
        }
      }
    };
  }
  
  // '&' is the only primary separator for key-value pairs
  var SEPARATOR = '&';  
  
  // report errors?
  var VERBOSE = true;
  
  var logWarning = function(message) {
    if (VERBOSE) {
      console.log('Media Fragments URI Parsing Warning: ' + message);
    }
  }
  
  // the currently supported media fragments dimensions are: t, xywh, track, id
  // allows for O(1) checks for existence of valid keys
  var dimensions = {
    t: function(value) {          
      var components = value.split(',');
      if (components.length > 2) {
        return false;
      }
      var start = components[0]? components[0] : '';
      var end = components[1]? components[1] : '';
      if ((start === '' && end === '') ||
          (start && !end && value.indexOf(',') !== -1)) {
        return false;
      }
      // hours:minutes:seconds.milliseconds
      var npt = /^((npt\:)?((\d+\:(\d\d)\:(\d\d))|((\d\d)\:(\d\d))|(\d+))(\.\d*)?)?$/;
      if ((npt.test(start)) &&
          (npt.test(end))) {
        start = start.replace(/^npt\:/, '');
        // replace a sole trailing dot, which is legal:
        // npt-sec = 1*DIGIT [ "." *DIGIT ]
        start = start.replace(/\.$/, '');
        end = end.replace(/\.$/, '');
        var convertToSeconds = function(time) {
          if (time === '') {
            return false;
          }
          // possible cases:
          // 12:34:56.789
          //    34:56.789
          //       56.789
          //       56
          var hours;
          var minutes;
          var seconds;
          time = time.split(':');          
          var length = time.length;
          if (length === 3) {
            hours = parseInt(time[0], 10);
            minutes = parseInt(time[1], 10);            
            seconds = parseFloat(time[2]);
          } else if (length === 2) {
            var hours = 0;
            var minutes = parseInt(time[0], 10);
            var seconds = parseFloat(time[1]);
          } else if (length === 1) {
            var hours = 0;
            var minutes = 0;            
            var seconds = parseFloat(time[0]);
          } else {
            return false;
          }
          if (hours > 23) {
            logWarning('Please ensure that hours <= 23.');                      
            return false;              
          }          
          if (minutes > 59) {
            logWarning('Please ensure that minutes <= 59.');                      
            return false;
          }
          if (seconds >= 60) {
            logWarning('Please ensure that seconds < 60.');                      
            return false;
          }    
          return hours * 3600 + minutes * 60 + seconds;
        };
        var startNormalized = convertToSeconds(start);
        var endNormalized = convertToSeconds(end);
        if (start && end) {
          if (startNormalized < endNormalized) {
            return {
              value: value,
              unit: 'npt',
              start: start,
              end: end,
              startNormalized: startNormalized,
              endNormalized: endNormalized
            };
          } else {
            logWarning('Please ensure that start < end.');                                                      
            return false;            
          }           
        } else {
          if ((convertToSeconds(start) !== false) ||
              (convertToSeconds(end) !== false)) {
            return {
              value: value,
              unit: 'npt',
              start: start,
              end: end,
              startNormalized: startNormalized === false ? '' : startNormalized,
              endNormalized: endNormalized === false ? '' : endNormalized
            };
          } else {
            logWarning('Please ensure that start or end are legal.');                                                      
            return false;
          }
        }
      }
      // hours:minutes:seconds:frames.further-subdivison-of-frames
      var smpte = /^(\d+\:\d\d\:\d\d(\:\d\d(\.\d\d)?)?)?$/;      
      var prefix = start.replace(/^(smpte(-25|-30|-30-drop)?).*/, '$1');
      start = start.replace(/^smpte(-25|-30|-30-drop)?\:/, '');      
      if ((smpte.test(start)) && (smpte.test(end))) {
        // we interpret frames as milliseconds, and further-subdivison-of-frames
        // as microseconds. this allows for relatively easy comparison.
        var convertToSeconds = function(time) {
          if (time === '') {
            return false;
          }
          // possible cases:
          // 12:34:56
          // 12:34:56:78
          // 12:34:56:78.90          
          var hours;
          var minutes;
          var seconds;
          var frames;
          var subframes;
          time = time.split(':');          
          var length = time.length;
          if (length === 3) {
            hours = parseInt(time[0], 10);
            minutes = parseInt(time[1], 10);            
            seconds = parseInt(time[2], 10);
            frames = 0;
            subframes = 0;
          } else if (length === 4) {
            hours = parseInt(time[0], 10);
            minutes = parseInt(time[1], 10);            
            seconds = parseInt(time[2], 10);
            if (time[3].indexOf('.') === -1) {
              frames = parseInt(time[3], 10);
              subframes = 0;
            } else {
              var frameSubFrame = time[3].split('.');
              frames = parseInt(frameSubFrame[0], 10);
              subframes = parseInt(frameSubFrame[1], 10);              
            }
          } else {
            return false;
          }
          if (hours > 23) {
            logWarning('Please ensure that hours <= 23.');                      
            return false;              
          }          
          if (minutes > 59) {
            logWarning('Please ensure that minutes <= 59.');                      
            return false;
          }
          if (seconds > 59) {
            logWarning('Please ensure that seconds <= 59.');                      
            return false;
          }    
          return hours * 3600 + minutes * 60 + seconds +
              frames * 0.001 + subframes * 0.000001;
        };        
        if (start && end) {
          if (convertToSeconds(start) < convertToSeconds(end)) {
            return {
              value: value,
              unit: prefix,
              start: start,
              end: end
            };            
          } else {
            logWarning('Please ensure that start < end.');                                                      
            return false;
          }
        } else {
          if ((convertToSeconds(start) !== false) ||
              (convertToSeconds(end) !== false)) {
            return {
              value: value,
              unit: prefix,
              start: start,
              end: end
            };                      
          } else {
            logWarning('Please ensure that start or end are legal.');                                                      
            return false;
          }
        }
      }
      // regexp adapted from http://delete.me.uk/2005/03/iso8601.html
      var wallClock = /^((\d{4})(-(\d{2})(-(\d{2})(T(\d{2})\:(\d{2})(\:(\d{2})(\.(\d+))?)?(Z|(([-\+])(\d{2})\:(\d{2})))?)?)?)?)?$/;      
      start = start.replace('clock:', '');
      if ((wallClock.test(start)) && (wallClock.test(end))) {
        // the last condition is to ensure ISO 8601 date conformance.
        // not all browsers parse ISO 8601, so we can only use date parsing
        // when it's there.
        if (start && end && !isNaN(Date.parse('2009-07-26T11:19:01Z'))) {
          // if both start and end are given, then the start must be before
          // the end
          if (Date.parse(start) <= Date.parse(end)) {            
            return {
              value: value,
              unit: 'clock',
              start: start,
              end: end
            };            
          } else {
            logWarning('Please ensure that start < end.');                                                      
            return false;
          }
        } else {
          return {
            value: value,
            unit: 'clock',
            start: start,
            end: end
          };          
        }
      }
      logWarning('Invalid time dimension.');                                                
      return false;
    },
    xywh: function(value) {
      // "pixel:" is optional
      var pixelCoordinates = /^(pixel\:)?\d+,\d+,\d+,\d+$/;
      // "percent:" is obligatory
      var percentSelection = /^percent\:\d+,\d+,\d+,\d+$/;
      
      var values = value.replace(/(pixel|percent)\:/, '').split(','); 
      var x = values[0];
      var y = values[1];
      var w = values[2];
      var h = values[3];                              
      if (pixelCoordinates.test(value)) {             
        if (w > 0 && h > 0) {
          return {
            value: value,
            unit: 'pixel',          
            x: x,
            y: y,
            w: w,
            h: h
          };
        } else {
          logWarning('Please ensure that w > 0 and h > 0');                                      
          return false;          
        }
      } else if (percentSelection.test(value)) {
        /**
         * checks for valid percent selections
         */
        var checkPercentSelection = (function checkPercentSelection(
            x, y, w, h) {
          if (!((0 <= x) && (x <= 100))) { 
            logWarning('Please ensure that 0 <= x <= 100.');                                      
            return false;
          }
          if (!((0 <= y) && (y <= 100))) { 
            logWarning('Please ensure that 0 <= y <= 100.');                                      
            return false;
          }
          if (!((0 <= w) && (w <= 100))) { 
            logWarning('Please ensure that 0 <= w <= 100.');                                      
            return false;
          }
          if (!((0 <= h) && (h <= 100))) { 
            logWarning('Please ensure that 0 <= h <= 100.');                                      
            return false;
          }            
          return true;            
        });        
        if (checkPercentSelection(x, y, w, h)) {
          return {
            value: value,
            unit: 'percent',          
            x: x,
            y: y,
            w: w,
            h: h
          };
        }
        logWarning('Invalid percent selection.');                                      
        return false;
      } else {
        logWarning('Invalid spatial dimension.');                                      
        return false;
      }
    },
    track: function(value) {
      return {
        value: value,
        name: value
      };
    },
    id: function(value) {
      return {
        value: value,
        name: value
      };
    },
    chapter: function(value) {          
      return {
        value: value,
        chapter: value
      };
    }
  }      
  
  /**
   * splits an octet string into allowed key-value pairs
   */
  var splitKeyValuePairs = function(octetString) {
    var keyValues = {};
    var keyValuePairs = octetString.split(SEPARATOR);    
    keyValuePairs.forEach(function(keyValuePair) {      
      // the key part is up to the first(!) occurrence of '=', further '='-s
      // form part of the value
      var position = keyValuePair.indexOf('=');
      if (position < 1) {
        return;
      } 
      var components = [
          keyValuePair.substring(0, position),
          keyValuePair.substring(position + 1)];
      // we require a value for each key
      if (!components[1]) {
        return;
      }
      // the key name needs to be decoded
      var key = decodeURIComponent(components[0]);
      // only allow keys that are currently supported media fragments dimensions
      var dimensionChecker = dimensions[key];
      // the value needs to be decoded
      var value = decodeURIComponent(components[1]);
      if (dimensionChecker) {
        value = dimensionChecker(value);
      } else {
        // we had a key that is not part of media fragments
        return;
      }
      if (!value) {
        return;
      }                        
      // keys may appear more than once, thus store all values in an array,
      // the exception being &t
      if (!keyValues[key]) {
        keyValues[key] = [];
      }
      if (key !== 't') {
        keyValues[key].push(value);
      } else {
        keyValues[key][0] = value;
      }
    });
    return keyValues;
  }  
  
  return {
    parse: function(opt_uri) {
      return MediaFragments.parseMediaFragmentsUri(opt_uri);
    },
    parseMediaFragmentsUri: function(opt_uri) {    
      var uri = opt_uri? opt_uri : window.location.href;
      // retrieve the query part of the URI    
      var indexOfHash = uri.indexOf('#');
      var indexOfQuestionMark = uri.indexOf('?');
      var end = (indexOfHash !== -1? indexOfHash : uri.length);
      var query = indexOfQuestionMark !== -1?
          uri.substring(indexOfQuestionMark + 1, end) : '';
      // retrieve the hash part of the URI
      var hash = indexOfHash !== -1? uri.substring(indexOfHash + 1) : '';
      var queryValues = splitKeyValuePairs(query);
      var hashValues = splitKeyValuePairs(hash);
      return {
        query: queryValues,
        hash: hashValues,
        toString: function() {
          var buildString = function(name, thing) {
            var s = '\n[' + name + ']:\n';
            if(!Object.keys) Object.keys = function(o){            
              if (o !== Object(o)) {
                throw new TypeError('Object.keys called on non-object');
              }
              var ret = [], p;
              for (p in o) {
                if (Object.prototype.hasOwnProperty.call(o,p)) ret.push(p);
              }
              return ret;
            }            
            Object.keys(thing).forEach(function(key) {
              s += '  * ' + key + ':\n';
              thing[key].forEach(function(value) {
                s += '    [\n';
                Object.keys(value).forEach(function(valueKey) {
                  s += '      - ' + valueKey + ': ' + value[valueKey] + '\n';
                });
                s += '   ]\n';
              }); 
            });
            return s;
          }
          var string =
              buildString('Query', queryValues) +
              buildString('Hash', hashValues);
          return string; 
        }      
      };
    }
  }
})(window);
var smfplayer = smfplayer || {}
smfplayer.version="v0.2"
smfplayer.utils={
	durationMax: 4294967295,
	audioList:new Array('wma','m4a','mp3','wav','mpeg'),
	videoList:new Array('mp4','m4v','mov','wmv','flv','ogg','webm'),
	isYouTubeURL:function(url,bool) {
	
	    var pattern = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/;
	    if (url.match(pattern)) {
	        return (bool !== true) ? RegExp.$1 : true;
	    } else { return false; }
	},
	isDailyMotionURL:function(url,bool) 
	{
		var m = url.match(/^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/);
	    if (m !== null) {
	        return true;
	    }
	    else
	    {
	    	return false;
	    }
	},
	isVimeoURL:function(url,bool)
	{
		var m = url.match(/^.+vimeo.com\/(\d+)?/);
	    if (m !== null) {
	        return true;
	    }
	    else
	    {
	    	return false;
	    }

	},
	isValidURL:function(str) {
	
		var pattern = /^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/;
			if(!pattern.test(str)) {
			  return false;
		  } else {
			  return true;
		  }
		
	},
	isiPad:function(){
		var isiPad = (navigator.userAgent.match(/iPad/i) == null)?false:true;
		return isiPad;
	},
	
	getTemporalMF:function(t)
	{
		var st = t.start?t.startNormalized:0;
       	var et = t.end?t.endNormalized:durationMax; //-1 means no end time is provided
       	st = parseFloat(st);//in seconds
       	et = parseFloat(et);//in seconds
       	var tObj = {st:st, et:et};
       	return tObj;
	},
	getSpatialMF:function(xywh)
	{
		
	}
}
// JQuery URL Parser plugin - https://github.com/allmarkedup/jQuery-URL-Parser
// Written by Mark Perkins, mark@allmarkedup.com
// License: http://unlicense.org/ (i.e. do what you want with it!)

;(function($, undefined) {
    
    var tag2attr = {
        a       : 'href',
        img     : 'src',
        form    : 'action',
        base    : 'href',
        script  : 'src',
        iframe  : 'src',
        link    : 'href'
    },
    
	key = ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","fragment"], // keys available to query
	
	aliases = { "anchor" : "fragment" }, // aliases for backwards compatability

	parser = {
		strict  : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,  //less intuitive, more accurate to the specs
		loose   :  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // more intuitive, fails on relative paths and deviates from specs
	},
	
	querystring_parser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g, // supports both ampersand and semicolon-delimted query string key/value pairs
	
	fragment_parser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g; // supports both ampersand and semicolon-delimted fragment key/value pairs
	
	function parseUri( url, strictMode )
	{
		var str = decodeURI( url ),
		    res   = parser[ strictMode || false ? "strict" : "loose" ].exec( str ),
		    uri = { attr : {}, param : {}, seg : {} },
		    i   = 14;
		
		while ( i-- )
		{
			uri.attr[ key[i] ] = res[i] || "";
		}
		
		// build query and fragment parameters
		
		uri.param['query'] = {};
		uri.param['fragment'] = {};
		
		uri.attr['query'].replace( querystring_parser, function ( $0, $1, $2 ){
			if ($1)
			{
				uri.param['query'][$1] = $2;
			}
		});
		
		uri.attr['fragment'].replace( fragment_parser, function ( $0, $1, $2 ){
			if ($1)
			{
				uri.param['fragment'][$1] = $2;
			}
		});
				
		// split path and fragement into segments
		
        uri.seg['path'] = uri.attr.path.replace(/^\/+|\/+$/g,'').split('/');
        
        uri.seg['fragment'] = uri.attr.fragment.replace(/^\/+|\/+$/g,'').split('/');
        
        // compile a 'base' domain attribute
        
        uri.attr['base'] = uri.attr.host ? uri.attr.protocol+"://"+uri.attr.host + (uri.attr.port ? ":"+uri.attr.port : '') : '';
        
		return uri;
	};
	
	function getAttrName( elm )
	{
		var tn = elm.tagName;
		if ( tn !== undefined ) return tag2attr[tn.toLowerCase()];
		return tn;
	}
	
	$.fn.url = function( strictMode )
	{
	    var url = '';
	    
	    if ( this.length )
	    {
	        url = $(this).attr( getAttrName(this[0]) ) || '';
	    }
	    
        return $.url( url, strictMode );
	};
	
	$.url = function( url, strictMode )
	{
	    if ( arguments.length === 1 && url === true )
        {
            strictMode = true;
            url = undefined;
        }
        
        strictMode = strictMode || false;
        url = url || window.location.toString();
        	    	            
        return {
            
            data : parseUri(url, strictMode),
            
            // get various attributes from the URI
            attr : function( attr )
            {
                attr = aliases[attr] || attr;
                return attr !== undefined ? this.data.attr[attr] : this.data.attr;
            },
            
            // return query string parameters
            param : function( param )
            {
                return param !== undefined ? this.data.param.query[param] : this.data.param.query;
            },
            
            // return fragment parameters
            fparam : function( param )
            {
                return param !== undefined ? this.data.param.fragment[param] : this.data.param.fragment;
            },
            
            // return path segments
            segment : function( seg )
            {
                if ( seg === undefined )
                {
                    return this.data.seg.path;                    
                }
                else
                {
                    seg = seg < 0 ? this.data.seg.path.length + seg : seg - 1; // negative segments count from the end
                    return this.data.seg.path[seg];                    
                }
            },
            
            // return fragment segments
            fsegment : function( seg )
            {
                if ( seg === undefined )
                {
                    return this.data.seg.fragment;                    
                }
                else
                {
                    seg = seg < 0 ? this.data.seg.fragment.length + seg : seg - 1; // negative segments count from the end
                    return this.data.seg.fragment[seg];                    
                }
            }
            
        };
        
	};
	
})(jQuery);
(function($){
	
	var VERBOSE=false;
	
	var self; //save the instance of current smfplayer object
	var mfreplay=true; //replay the mf when the video starts, but the mf will only be replayed once
	var setPositionLock=false; //sometimes the setPostion(position) will set a currentTime that around the actual 'position'. If this happens, the timeupdate event should not trigger setPosition again when the position > currentTime
	
	//more options can be found at http://mediaelementjs.com/#api
	var defaults = {
			width:640, //the width in pixel of the video on the webpage, no matter if it's audio or video
			height:480, //the height in pixel of the video on the webpage, no matter if it's audio or video
			originalWidth:320, //the original width in pixel of the video, used for spatial fragment 
			originalHeight:240, //the original height in pixel of the video, used for spatial fragment
			isVideo:true, //is the URI indicating a video or audio
			mfAlwaysEnabled:false, //the media fragment is always enabled, i.e. you can only play the media fragment
			spatialEnabled:true, //spatial dimension of the media fragment is enabled
			spatialStyle:{}, //a json object to specify the style of the outline of the spatial area
			autoStart:true //auto start playing after initialising the player
			//xywhoverlay: jquery object of a div to identify xywh area
			//subtitles: a JSON object, lang is the key and the uri of the subtitle is the value, the first pair is the default subtitle
	};
				  
	var methods = {
     	init : function( options ) {
     		
	     	self = this;
	     	var settings = $.extend({},defaults,options);
	     	if(settings.mfURI === undefined)
           	{
           		console.error("mfURI cannot be null!");
           		return false;
           	}
           	/*----------Declare public functions---------------------*/
           	this.pause = function(){
				
				if(VERBOSE)
					console.log("pause");
				
				var player = $(this).data('smfplayer').smfplayer;
				if(player !== undefined)
					$(this).data('smfplayer').smfplayer.pause();
				else
					console.error("smfplayer hasn't been initalised");
				
				
			};
			
			this.play = function(){
				//console.log($(this));
				
				if(VERBOSE)
					console.log("play");
				
				var player = $(this).data('smfplayer').smfplayer;
				if(player !== undefined)
					player.play();
				else
					console.error("smfplayer hasn't been initalised");
				
			};
			
			this.playmf = function()
			{
				var data = $(this).data('smfplayer');
				if(data === undefined)
				{
					setTimeout(function(){self.playmf()}, 100);
					return;
				}
				var st=0;
				var et=-1;
				if(!$.isEmptyObject(data.mfjson.hash))
				{
					var tObj = smfplayer.utils.getTemporalMF(data.mfjson.hash.t[0]);
		           	st = tObj.st;
		           	et = tObj.et;
				}
				
				var player = $(this).data('smfplayer').smfplayer;
				//console.log(player);
				
				this.setPosition(st*1000);
				
				if(player.media.paused)
					player.play();
					
				this.mfreplay = true;
			};
			this.showxywh = function(xywh)
			{
				if(VERBOSE)
					console.log('showxywh');
				var data = $(this).data('smfplayer');
				
				//*********check data.xywhoverlay!!!*********
				
				if(data === undefined)
				{
					setTimeout(function(){
						self.showxywh(xywh);
					}, 100);
					return;
				}
				
				if( $.isEmptyObject(xywh) || data.settings.spatialEnabled !== true)
					return;
				
				var spatial_div;
				if(data.settings.xywhoverlay === undefined) //the overlay hasn't been created
				{			
		           	this.addClass('smfplayer-container');
		           	//var cssStr = "top:"+x+";left:"+y+";width:"+w+";height:"+h+";";
		           	spatial_div = $("<div/>");
		           	spatial_div.css(data.settings.spatialStyle);
		           	spatial_div.addClass('smfplayer-overlay').appendTo(this);
	
		           	data.settings.xywhoverlay =  spatial_div;
			    }
			    else
			    {
				    spatial_div = data.settings.xywhoverlay;
			    }
			    
			    //console.log(xywh);
			    
		    	var unit = xywh.unit;
		           		x = xywh.x,
		           		y = xywh.y,
		           		w = xywh.w,
		           		h = xywh.h;
		           	
	           	//unit is 'pixal' or 'percent'	
	           	if(unit === 'percent')
	           	{
		           	//var wratio = data.settings.width/data.settings.originalWidth;
		           	//var hratio = data.settings.height/data.settings.originalHeight;
		           	
		           	x=Math.floor((x/100)*data.settings.width);
		           	w=Math.floor((w/100)*data.settings.width);
		           	y=Math.floor((y/100)*data.settings.height);
		           	h=Math.floor((h/100)*data.settings.height);
	           	}
	           	
	           	spatial_div.css({'width':w,'height':h,'top':y+'px','left':x+'px'});
	           	spatial_div.show();
			};
			
			this.hidexywh = function()
			{
				if(VERBOSE)
					console.log('hidexywh');
					
				var data = $(this).data('smfplayer');
				if(data === undefined)
				{
					setTimeout(function(){self.hidexywh()}, 100);	
					return;
				}
				
				if(data.settings.xywhoverlay !== undefined)
				{
					data.settings.xywhoverlay.hide();
				}	
			};
			
			this.stop =function(){
				
				if(VERBOSE)
					console.log("pause");
				
				var player = $(this).data('smfplayer').smfplayer;
				if(player !== undefined)
					player.stop();
				else
					console.error("smfplayer hasn't been initalised");
				
				
			};
			
			this.load =function(){
				
				if(VERBOSE)
					console.log("load");
				
				var player = $(this).data('smfplayer').smfplayer;
				if(player !== undefined)
					player.load();
				else
					console.error("smfplayer hasn't been initalised");
				
				
			};
			
			this.getPosition=function(){
				var player = $(this).data('smfplayer').smfplayer;
				if(player)
				{
					//console.log(player.getCurrentTime()*1000);
					return parseInt(player.getCurrentTime()*1000);
				}
				else
				{
					console.error("smfplayer hasn't been initalised");
					return -1;
				}
			}; //in miliseconds
			this.setPosition=function(position){
				
				var player = $(this).data('smfplayer').smfplayer;
				var position = position?position:0;
				//console.log('position:'+position);
				if(player !== undefined)
				{
					if(self.getPosition() <=0)
					{
						setTimeout(function(){self.setPosition(position);},100);
					}
					else
						player.setCurrentTime(position/1000);
				}
				else
					console.error("smfplayer hasn't been initalised");
				
				
			}; //in miliseconds
			this.getDuration=function(){ //in milliseconds
				var player = $(this).data('smfplayer').smfplayer;
				if(player !== undefined)
					return player.duration*1000;
				else
				{
					console.error("smfplayer hasn't been initalised");
					return -1;
				}

			};
			
			this.getMFJson = function()
			{
				return $(this).data('smfplayer').mfjson;
			};
			
			//get the original mejs player
			this.getMeplayer = function()
			{
				return $(this).data('smfplayer').smfplayer;
			}
			
			/*-----------Public attributes declaration ends----------------*/
           	//parse media fragment
           	var mfjson = MediaFragments.parseMediaFragmentsUri(settings.mfURI);
           	//if(VERBOSE)
		    //      console.log(mfjson);
           	
	     	settings.success = function(mediaElement,domObject,p){
	     			     				
	     				if(VERBOSE)
							console.log("smfplayer init success.");
						
				        
				        if(settings.autoStart === true)
				        {
					        if(mediaElement.pluginType == 'flash')
					        {
						        mediaElement.addEventListener('canplay',function(e){
						        	if(VERBOSE)
						        		console.log("canplay");
						        	mediaElement.play();
						        		
						        	if($(self).data('smfplayer') === undefined)	
						        		setTimeout(function(){
								        		var lazyObj = getMfjsonLazy($(self).data('smfplayer').mfjson);
								        		self.setPosition(lazyObj.st*1000);
									        	if( !$.isEmptyObject(lazyObj.xywh) && $(self).data('smfplayer').settings.spatialEnabled === true)
									        		self.showxywh(lazyObj.xywh);
								        	},100);
							        else
							        {
							        	var lazyObj = getMfjsonLazy($(self).data('smfplayer').mfjson);
						        		self.setPosition(lazyObj.st*1000);
							        	if( !$.isEmptyObject(lazyObj.xywh) && $(self).data('smfplayer').settings.spatialEnabled === true)
							        		self.showxywh(lazyObj.xywh);	
							        }
						        		
						        },false);
					        }
					        else
					        {
					        	mediaElement.play();
					        	
					        	if($(self).data('smfplayer') === undefined)	
						        	setTimeout(function(){
							        	var lazyObj = getMfjsonLazy($(self).data('smfplayer').mfjson);
						        		self.setPosition(lazyObj.st*1000);
							        	if( !$.isEmptyObject(lazyObj.xywh) && $(self).data('smfplayer').settings.spatialEnabled === true)
							        		self.showxywh(lazyObj.xywh);
						        	},100);
						        else
						        {
						        	var lazyObj = getMfjsonLazy($(self).data('smfplayer').mfjson);
					        		self.setPosition(lazyObj.st*1000);
						        	if( !$.isEmptyObject(lazyObj.xywh) && $(self).data('smfplayer').settings.spatialEnabled === true)
						        		self.showxywh(lazyObj.xywh);
						        }
							       
					        }
				        }
				        
				        mediaElement.addEventListener('timeupdate', function(e) {
						
					        var currentTime = mediaElement.currentTime;
					        var data = $(self).data('smfplayer');
					        
					        if(data === undefined)
					        {
						        return;
					        }
					        
					        var lazyObj = getMfjsonLazy(data.mfjson);
					        var st = lazyObj.st;
					        var et = lazyObj.et;
					        var xywh = lazyObj.xywh;
					        
					        //console.log("ct:"+currentTime);			        
					        if(currentTime < et && currentTime>st)
					        {
						        if(data !== undefined)
						        {
							        if( !$.isEmptyObject(xywh) && data.settings.spatialEnabled === true)
							        {
							        	if(data.settings.xywhoverlay === undefined || !data.settings.xywhoverlay.is(':visible'))
							        	{
								        	self.showxywh(xywh);
								        }
								    }
						        }
						        if(setPositionLock === true)
						        {
						        	//console.log("true:"+currentTime);  	
						        	setPositionLock = false;
						        }
						    }
					        else
					        {
						        if(data.settings.xywhoverlay !== undefined && data.settings.xywhoverlay.is(':visible'))
						        {
						        	self.hidexywh();
						        }
						        
						        if(mfreplay === true || settings.mfAlwaysEnabled === true)
						        {
						           
						            if(currentTime>et)
						            {
							            mediaElement.pause();
							            self.setPosition(et*1000);
							            mfreplay = false;
						            }
						            else if(currentTime < st)
						            {
							            if(setPositionLock === false)
							            {
							            	//console.log("false:"+currentTime);
							            	self.setPosition(st*1000);
							            	setPositionLock = true;
							            }
						            }
						        }
					        }
			        				             
					    }, false);
				        
				        mediaElement.addEventListener('play', function(e) {
					        
					        var currentTime = mediaElement.currentTime;
					        var data = $(self).data('smfplayer');
					        
					        if(data === undefined)
					        {
						        return;
					        }
					        
					        var lazyObj = getMfjsonLazy(data.mfjson);
					        var st = lazyObj.st;
					        var et = lazyObj.et;
					     						        
					        if(mfreplay === true)
					        {
					            //console.log("mfreplay:"+currentTime); //add a flag as autostart finished
					            if(currentTime < st)
					            {
						            //console.log("setposition");
						            if(setPositionLock === false)
						            {
						            	self.setPosition(st*1000);
						            	setPositionLock = true;
						            }
					            }
					            else if(currentTime>et)
					            {
						            if(setPositionLock === false)
						            {
						            	self.setPosition(et*1000);
						            	setPositionLock = true;
						            	mediaElement.pause();
						            	mfreplay = false;
						            }
					            }
					        }
					        
				        },false);

				        
				        if(options.success !== undefined)
				        {
					        return options.success.call(this, mediaElement,domObject);
				        }
				        else
				        	return;
	     			};
	     	
	     	settings.error = function()
	     	{
		    	 if(options.error !== undefined)
		    	 {
			        	return options.error.call(this);
			     }
		         else
		        		return;	
	     	}; 
	     	//console.log("before each");  
	     	//console.log(this);		     			     	
	     	return this.each(function(){
         
		     	var $this = $(this);
				var data = $this.data('smfplayer');
				
				//console.log("each");
				//console.log(data);
                     
		     	// If the plugin hasn't been initialized yet
		     	if ( data === undefined ) {
		     	
			     	if(VERBOSE)
			     		console.log("init smfplayer data");
  
		           	var videosrc = settings.mfURI;
		           	//remove the hash for the url
		           	if(!$.isEmptyObject(mfjson.hash)){
			           	var indexOfHash = settings.mfURI.indexOf('#');
			           	videosrc = indexOfHash !== -1? settings.mfURI.substring(0,indexOfHash) : settings.mfURI;
		           	}
		           	
		           	if(VERBOSE)
		           		console.log(videosrc);
		           	
					var mm;
					if(settings.isVideo === false)
					{
			       		mm = $("<audio/>").prop("width",settings.width).prop("height",settings.height).prop('preload','auto').appendTo($this);
			       	}
			       	else
			       	{
			          	mm = $("<video/>").prop("width",settings.width).prop("height",settings.height).prop('preload','auto').appendTo($this);
			        }
			        var mmSource = $("<source/>").prop("src",videosrc).appendTo(mm);
			        
			        //Decide the type of the video or audio
			        if(smfplayer.utils.isYouTubeURL(settings.mfURI))
		           	{
						mmSource.prop("type","video/x-youtube");
					}
					else if(smfplayer.utils.isDailyMotionURL(settings.mfURI))
					{
						mmSource.prop("type","video/dailymotion");
					}
					else if(smfplayer.utils.isVimeoURL(settings.mfURI))
					{
						mmSource.prop("type","video/vimeo");
					}
					else
					{
						var jqURL = $.url(settings.mfURI);
						var file = jqURL.attr('file').toLowerCase();
						
						var parts = file.split('.')
						//if no file extension
						if(parts.length>1)
						{
							var file_extension = parts[parts.length-1].toLowerCase();
							if(file_extension)
							{
								if($.inArray(file_extension,smfplayer.utils.videoList)!=-1)
								{
									mmSource.attr("type","video/"+file_extension);
								}
								else if($.inArray(file_extension,smfplayer.utils.audioList)!=-1)
								{
									mmSource.prop("type","audio/"+file_extension);
								}
								else
								{
									//do nothing
								}
							}
						}
					} 
		           
		           //TODO: init subtitles
		           if(settings.subtitles !== undefined)
		           		$this.initSubtitles(mm, settings.subtitles)
		           		           
		           		           
		           //call mediaelemntjs
		           var meplayer = new MediaElementPlayer(mm.get(0),settings);
		           //console.log(meplayer);
		           $this.data('smfplayer', {
			           target : $this,
			           smfplayer : meplayer,
			           settings:settings,
			           mfjson:mfjson
				   });
		        }
		    });
		    
		},
		destroy : function( ) {
	
	       return this.each(function(){
	
	         var $this = $(this),
	             data = $this.data('smfplayer');
	
	         // Namespacing FTW
	         //if(data!==undefined)
	         //	data.smfplayer.remove();
	         
	         $(window).unbind('.smfplayer');
	         $this.removeData('smfplayer');
	         $this.empty();
	       });
	
	    }
  };
  
  var getMfjsonLazy=function(mfjson)
  {
	  	var st = 0;
	   	var et = smfplayer.utils.durationMax;
	   	
	   	if(!$.isEmptyObject(mfjson.hash.t)) //currently, only support npt
	   	{
	       	var tObj = smfplayer.utils.getTemporalMF(mfjson.hash.t[0]);
	       	st = tObj.st;
	       	et = tObj.et;
	   	}
	   	
	   	var xywh = {};
	   	if(!$.isEmptyObject(mfjson.hash.xywh))
	   		xywh = mfjson.hash.xywh[0];
	   	
	   	return {st:st,et:et,xywh:xywh}
  };
  
  var initSubtitles=function(mm,sobj)
  {
		return;
  };
    
  $.fn.smfplayer = function( method ) {
    
	    if ( methods[method] ) {
	      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	      return methods.init.apply( this, arguments );
	    } else {
	      $.error( 'Method ' +  method + ' does not exist on jQuery.smfplayer' );
	    }    
  };
	
})(jQuery);
