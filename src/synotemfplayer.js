(function($){
	
	var VERBOSE=true;
	
	var self; //save the instance of current smfplayer object
	var mfreplay=true; //replay the mf whent he video starts, but the mf will only be replayed once
	var meDom; // the dom object returned by mediaelementjs, this object is different from the new MediaElementPlayer() object 
	
	//more options can be found at http://mediaelementjs.com/#api
	var defaults = {
			width:640, //default width, no matter if it's audio or video
			height:480, //default height, no matter if it's audio or video
			isVideo:true, //is the URI indicating a video or audio
			mfAlwaysEnabled:true, //the media fragment is always enabled, i.e. you can only play the media fragment
			spatialEnabled:true, //spatial dimension of the media fragment is enabled
			autoStart:true
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
					$(this).data('smfplayer').smfplayer.play();
				else
					console.error("smfplayer hasn't been initalised");
				
			};
			
			this.playmf = function(st,et,xywh)//start playing from time st and stop at et, st,et are in miliseconds
			{
				
			};
			
			this.stop =function(){
				
				if(VERBOSE)
					console.log("pause");
				
				var player = $(this).data('smfplayer').smfplayer;
				if(player !== undefined)
					$(this).data('smfplayer').smfplayer.stop();
				else
					console.error("smfplayer hasn't been initalised");
				
				
			};
			this.rewind=function(){};
			this.forward=function(){};
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
					console.log("smfplayer hasn't been initalised");
				
				
			}; //in miliseconds
			this.getDuration=function(){};
			/*-----------Public function declaration ends-------------*/
			
           	//parse media fragment
           	var mfjson = MediaFragments.parseMediaFragmentsUri(settings.mfURI);
           	
           	var st = 0;
           	var et = -1;
           	
           	if(!$.isEmptyObject(mfjson.hash)) //currently, only support npt
           	{
	           	st = mfjson.hash.t[0].start?mfjson.hash.t[0].startNormalized:0;
	           	et = mfjson.hash.t[0].end?mfjson.hash.t[0].endNormalized:-1; //-1 means no end time is provided
	           	st = parseFloat(st);//in seconds
	           	et = parseFloat(et);//in seconds
           	}
           	
           	settings.complete=function(){console.log('complete')};
	     	settings.success = function(mediaElement,domObject){
	     			     				
	     				if(VERBOSE)
							console.log("smfplayer init success.");
						meDom = mediaElement;
				        
				        if(settings.autoStart === true)
				        {
					        if(mediaElement.pluginType == 'flash')
					        {
						        mediaElement.addEventListener('canplay',function(){
						        	mediaElement.play();
						        	if(st >0)
						        	{
							        	//self.smfplayer('setPosition',{st:st} );	
						        	}
						        		
						        },false);
					        }
					        else
					        {
					        	mediaElement.play();
					        	if(st>0)
					        	{
						        	//methods.setPosition.call(self,st);
						        	//
						        	//console.log('st:'+st);
						        	if($(self).data('smfplayer') === undefined)	
							        	setTimeout(function(){
								        	self.setPosition(st*1000);
							        	},100);
							        else
							        	self.setPosition(st*1000);	
					        	}	
					        }
				        }
				        
				        mediaElement.addEventListener('timeupdate', function(e) {
						
					        var currentTime = mediaElement.currentTime;
					        console.log("c:"+currentTime);
					        console.log(et);
					        console.log(st);
					        
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
					        else if(mfreplay === true && et>0)
					        {
					            
					            if(currentTime>et)
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
	     	}	     		     			     	
	     	return this.each(function(){
         
		     	var $this = $(this);
				var data = $this.data('smfplayer');
                     
		     	// If the plugin hasn't been initialized yet
		     	if ( ! data ) {
  
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
			       		mm = $("<audio/>").prop("width",settings.width).prop("height",settings.height).prop('preload','none').appendTo($this);
			       	}
			       	else
			       	{
			          	mm = $("<video/>").prop("width",settings.width).prop("height",settings.height).prop('preload','none').appendTo($this);
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
								if($.inArray(file_extension,this.video_list)!=-1)
								{
									mmSource.prop("type","video/"+file_extension);
								}
								else if($.inArray(file_extension,this.audio_list)!=-1)
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
		           
		           if(VERBOSE)
		           		console.log(mfjson);
		           
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
	         $(window).unbind('.smfplayer');
	         data.smfplayer.remove();
	         $this.removeData('smfplayer');
	
	       })
	
	    }
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