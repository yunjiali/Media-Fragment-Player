(function($){
	
	var VERBOSE=false;
	
	var self; //save the instance of current smfplayer object
	var mfreplay=true; //replay the mf whent he video starts, but the mf will only be replayed once
	
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
					        					        
					        if(currentTime <= et && currentTime>=st)
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
						    }
					        else
					        {
						        if(data.settings.xywhoverlay !== undefined && data.settings.xywhoverlay.is(':visible'))
						        {
						        	self.hidexywh();
						        }
					        }
					        
					        if(settings.mfAlwaysEnabled === true)
					        {
					         	
					         	if(et>0)
					         	{
						         	if(currentTime>et)
						         	{
						         		self.setPosition(et*1000);
						         		mediaElement.pause();
						         	}
						         	else if(currentTime<st)
						         	{
							         	self.setPosition(st*1000)
							         	mediaElement.play();
						         	}
					         	}
					         	else //from the st to the very end of the video
					         	{
						         	if(currentTime<st)
						         	{
							         	self.setPosition(st*1000);
							         	mediaElement.play();
						         	}
					         	}   
					        }
					        else if(mfreplay === true)
					        {
					            if(currentTime < st)
					            {
						            self.setPosition(st*1000);
					            }
					            else if(currentTime>et)
					            {
						            mediaElement.pause();
						            mfreplay = false;
					            }
					        }
			        				             
					    }, false);
				        
				        
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