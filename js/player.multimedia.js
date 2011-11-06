/*
 * 
 * The base class for multimedia player. Take the recording's json format and the container elements as constructor input
 * outer_container is the container including the control buttons, inner container is for the player only.
 * PLEASE NOTE THAT BOTH outer_container AND inner_container SHOUDL BE JQUERY OBJECT!
 * 
 * ALL POSITION AND DURATION TIME ARE IN MILLISECONDS!
 */

//Yunjia: when buffering, add modal buffering to the whole screen
var MultimediaBase = Base.extend({
	recording:null,
	outer_container:null,
	inner_container:null,
	//Default height and width
	height_default:320,
	width_default:480,
	
	//bigger player height and width
	height_large:480,
	width_large:640,
	
	//audio only player height and width
	height_audio:26,
	width_audio:320,
	
	height:0,
	width:0,
	
	player:null,
	
	constructor:function(recording, outer_container, inner_container)
	{
		//console.log("constructor");
		
		this.recording = recording;
		this.outer_container = outer_container;
		this.inner_container = inner_container;
		
		this.height = this.height_default;
		this.width = this.width_default;
		
	},
	
	getInnerContainer:function()
	{
		return inner_container;
	},
	
	initPlayer:function(isAudio){
		//Do nothing
	},
	refresh:function(){},
	resize:function(width,height){},
	play:function(){},
	pause:function(){},
	stop:function(){},
	rewind:function(){},
	forward:function(){},
	getPosition:function(){},
	setPosition:function(){},
	getDuration:function(){},
	/* Yunjia Li:
	setDurationSpan:function()
	{
		var time_duration_span = $("#time_duration_span");
		//console.log("get dur:"+multimedia.getDuration());
		var dur = multimedia.getDuration();
		if(dur >0)
			time_duration_span.text(milisecToString(dur));
	},
	setCurrentTimeSpan:function()
	{
		var time_current_span = $("#time_current_position");
		var currentPosition = multimedia.getPosition();
		if(currentPosition >0)
			time_current_span.text(milisecToString(currentPosition));
	},*/
	initListeners:function(){},
})

/*
 * ############################################################################
 * JWPlayer long tail
 * ############################################################################
 */
var JWPlayer = MultimediaBase.extend({
	constructor:function(recording, outer_container, inner_container)
	{
		this.base(recording, outer_container, inner_container);
	},
	initPlayer:function(isAudio)
	{
		this.base(isAudio);
		//console.log("init jwplayer");
		var playerURL = jw_swf_path; //Yunjia Li:
		//Yunjia Li:var playerSkin = g.resource({dir:'images/jwplayer',file:'stormtrooper.zip'});
		if(isAudio)
		{
			this.height = this.height_audio;
			this.width = this.width_audio;
		}
		jwplayer(this.inner_container.attr('id')).setup({
		    'flashplayer': playerURL,
		    'file':this.recording.url,
		    'controlbar': 'bottom',
		    'width': this.width,
		    'height': this.height,
		    //Yunjia Li:'skin': playerSkin,
		    events:{
		    	onPlay:function(event)
			    {
			    	//Yunjia Li: if(event.oldstate == "BUFFERING" )
			    		//multimedia.setDurationSpan();
			    }
		    }
		  });
		this.player = jwplayer(this.inner_container.attr('id'));
		this.initListeners();
	},
	refresh:function(){},
	resize:function(width,height){}, 
	play:function()
	{
		//console.log("1 play:::");
		var p = multimedia.player;
		if(p)
			p.play();
		else
			console.log("jw player is null");
	},
	pause:function()
	{
		var p = multimedia.player;
		if(p)
			p.pause();
		else
			console.log("jw player is null");
	},
	stop:function()
	{
		var p = multimedia.player;
		if(p)
			p.stop();
		else
			console.log("jw player is null");
	},
	rewind:function()
	{
		var p = multimedia.player;
		var currentPos = multimedia.getPosition();
		var pace = parseInt($("#control_pace_div :selected").val(),10);
		var pos = currentPos-pace*1000;
		multimedia.setPosition(pos>0?pos:0);
		
	},//need pace
	forward:function()
	{
		var p = multimedia.player;
		var currentPos = multimedia.getPosition();
		var pace = parseInt($("#control_pace_div :selected").val(),10);
		//console.log("seelcted:"+$("#control_pace_div :selected").val());
		//console.log("pace:"+pace);
		multimedia.setPosition(currentPos+pace*1000);
	},//need pace
	getPosition:function()
	{
		var p = multimedia.player;
		if(p)
			return p.getPosition()*1000;
		else
		{
			return null;
			console.log("jw player is null");
		}
	},
	setPosition:function(position) 
	{
		var p = multimedia.player;
		var position = position?position:0;
		if(p)
			p.seek(position/1000);
		else
			console.log("jw player is null");
	},
	getDuration:function()
	{
		var p = multimedia.player;
		if(p)
			return p.getDuration()*1000;
		else
		{
			return null;
			console.log("jw player is null");
		}
	},
	initListeners:function()
	{
		//console.log("init listeners...")
		$("#control_play").bind('click',{},this.play);
		$("#control_pause").bind('click',{},this.pause);
		$("#control_stop").bind('click',{},this.stop);
		$("#control_rewind").bind('click',{},this.rewind);
		$("#control_forward").bind('click',{},this.forward);
	}
});

/*
 * ############################################################################
 * Silverlight Player, long tail
 * ############################################################################
 */
var SilverlightPlayer = MultimediaBase.extend({
	constructor:function(recording, outer_container, inner_container)
	{
		this.base(recording, outer_container, inner_container);
	},
	initPlayer:function(isAudio)
	{
		this.base(isAudio);
		var xaml = jw_wmvplayer_path;
		//console.log("xaml:"+xaml);
		//var playerSkin = g.resource({dir:'images/jwplayer',file:'stormtrooper.zip'});
		if(isAudio)
		{
			this.height = this.height_audio;
			this.width = this.width_audio;
		}
		var cfg = {
			file:this.recording.url,
			width:this.width,
			height:this.height
		}
		//No skin is avaliable for silverlight player
		//var elm = document.getElementById("multimedia_player_div");
		var sliverlightplayer = new jeroenwijering.Player(this.inner_container.get(0),xaml,cfg);
		this.player = sliverlightplayer;
		this.initListeners();
	},
	refresh:function(){},
	resize:function(width,height){},
	play:function()
	{
		//console.log("play:::");
		var p = multimedia.player;
		if(p)
		{
			p.sendEvent('PLAY');
		}
		else
			console.log("silverlight player is null");
	},
	pause:function()
	{
		var p = multimedia.player;
		if(p)
			p.sendEvent('PLAY');
		else
			console.log("silverlight player is null");
	},
	stop:function()
	{
		var p = multimedia.player;
		if(p)
			p.sendEvent('STOP');
		else
			console.log("silverlight player is null");
	},
	//Yunjia: rewind and forward is not accurate when the player is playing
	rewind:function(pace)
	{
		var p = multimedia.player;
		var currentPos = multimedia.getPosition();
		var pace = parseInt($("#control_pace_div :selected").val(),10);
		var pos = currentPos-pace*1000;
		multimedia.setPosition(pos>0?pos:0);
	},
	forward:function(pace)
	{
		var p = multimedia.player;
		var currentPos = multimedia.getPosition();
		var pace = parseInt($("#control_pace_div :selected").val(),10);
		//console.log("seelcted:"+$("#control_pace_div :selected").val());
		//console.log("pace:"+pace);
		multimedia.setPosition(currentPos+pace*1000);
	},
	getPosition:function()
	{
		var p = multimedia.player;
		//console.log("sl getpos:"+p.getEvent("POSITION"));
		if(p)
			return p.getEvent("POSITION")*1000;
		else
		{
			return null;
		}
	},
	setPosition:function(position)
	{
		var p = multimedia.player;
		if(p)
			p.sendEvent('SCRUB',position/1000);
		else
			console.log("silverlight player is null");
	},
	getDuration:function()
	{
		var p = multimedia.player;
		if(p)
			return p.getEvent("DURATION")*1000;
		else
		{
			return null;
			console.log("jw player is null");
		}
	},
	addListeners:function()
	{
		if(multimedia.player.view)
		{
			multimedia.player.addListener('STATE',function(ost,nst)
			{
				//console.log("state change:"+ost+"=>"+nst);
				if(ost.toUpperCase() == "OPENING" || ost.toUpperCase() == "CLOSED")
				{
					//console.log("set duration");
					//Yunjia Li:multimedia.setDurationSpan();
				}
			});
		}
		else
		{
			setTimeout(multimedia.addListeners,100);
		}
	},
	initListeners:function()
	{
		$("#control_play").bind('click',{},this.play);
		$("#control_pause").bind('click',{},this.pause);
		$("#control_stop").bind('click',{},this.stop);
		$("#control_rewind").bind('click',{},this.rewind);
		$("#control_forward").bind('click',{},this.forward);
		this.addListeners();
		
	}
});

/*
 * ############################################################################
 * Windows Media Player
 * ############################################################################
 */
var WindowsMediaPlayer = MultimediaBase.extend({
	constructor:function(recording, outer_container, inner_container)
	{
		this.base(recording, outer_container, inner_container);
	},
	initPlayer:function(isAudio)
	{
		this.base(isAudio);
		
		if(isAudio)
		{
			//console.log("is audio:"+isAudio);
			this.height = this.height_audio;
			this.width = this.width_audio;
		}
		var wmp_media = $("<a/>",{
			href:this.recording.url
		}).addClass("media").appendTo(this.inner_container);
		//use jquery media plugin to initiialise Windows Media Player
		$('#multimedia_player_div .media').media({
			width:this.width,
			height:this.height+36, //the extra 36 makes sure you can see the status bar
			autoplay:false
		});
		
		/* Yunjia: The following code doesn't work directly, why?
		 * var wmp_obj = $("<object/>",{
			id:"wmp_obj",
			classid:"clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6",
			//codebase:"http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#version=5,1,52,701",
			//standby:"loading microsoft windows media player components...",
			//type:"application/x-oleobject",
			width:this.width,
			height:this.height+20,
			type:"application/x-mplayer2",
			data:this.recording.url
		}).appendTo(this.inner_container);
		var autostart_param = $("<param/>",{
			name:"autostart",
			value:"0"
		}).appendTo(wmp_obj);
		var url_param = $("<param/>",{
			name:"url",
			value:this.recording.url
		}).appendTo(wmp_obj);*/
		/*var stretchtofit_param = $("<param/>",{
			name:"stretchToFit",
			value:"true"
		}).appendTo(wmp_obj);
		var bgcolor_param = $("<param/>",{
			name:"bgColor",
			value:"#ffffff"
		}).appendTo(wmp_obj);
		var wmp_embed = $("<embed/>",{
			id:"wmp_embed",
			width:this.width,
			height:this.height+20,
			type:"application/x-ms-wmp",
			src:this.recording.url,
			strechToFit:true,
			autostart:false
		}).appendTo(wmp_obj);*/
		
		//jquery.media plugin use <object> to embed media player in all browsers, there is no embed tag!
		this.player = $("#multimedia_player_div .media object:first").get(0);
		this.initListeners();
	},
	refresh:function(){},
	resize:function(width,height){},
	play:function()
	{
		var p = multimedia.player;
		if(p && p.controls)
		{
			p.controls.play();
		}
		else
			console.log("window media player is null");
	},
	pause:function()
	{
		var p = multimedia.player;
		if(p && p.controls)
			p.controls.pause();
		else
			console.log("window media player is null");
	},
	stop:function()
	{
		var p = multimedia.player;
		if(p && p.controls)
			p.controls.stop();
		else
			console.log("window media player is null");
	},
	//Yunjia: rewind and forward is not accurate when the player is playing
	rewind:function(pace)
	{
		var p = multimedia.player;
		var currentPos = multimedia.getPosition();
		var pace = parseInt($("#control_pace_div :selected").val(),10);
		var pos = currentPos-pace*1000;
		multimedia.setPosition(pos>0?pos:0);
	},
	forward:function(pace)
	{
		var p = multimedia.player;
		var currentPos = multimedia.getPosition();
		var pace = parseInt($("#control_pace_div :selected").val(),10);
		//console.log("seelcted:"+$("#control_pace_div :selected").val());
		//console.log("pace:"+pace);
		multimedia.setPosition(currentPos+pace*1000);
	},
	getPosition:function()
	{
		var p = multimedia.player;
		//console.log("sl getpos:"+p.getEvent("POSITION"));
		if(p && p.controls)
			return parseInt(p.controls.currentPosition*1000);
		else
		{
			return null;
		}
	},
	setPosition:function(position)
	{
		var p = multimedia.player;
		if(p && p.controls)
			p.controls.currentPosition = position/1000;
		else
			console.log("window media player is null");
	},
	getDuration:function()
	{
		var p = multimedia.player;
		if(p && p.controls)
			return parseInt(p.currentMedia.duration*1000);
		else
		{
			return null;
			console.log("window media player is null");
		}
	},
	initListeners:function()
	{
		$("#control_play").bind('click',{},this.play);
		$("#control_pause").bind('click',{},this.pause);
		$("#control_stop").bind('click',{},this.stop);
		$("#control_rewind").bind('click',{},this.rewind);
		$("#control_forward").bind('click',{},this.forward);
	}
});
