function MultimediaFactory(recording)
{
	//Get the player type which should be embedded in the browser
	
	//Is the url indicating an audio? default is false
	this.isAudio = false;
	this.recording = recording;
}

MultimediaFactory.prototype.getPlayerType = function(recording)
{
	
	var jqURL = $.url(recording.url);
	
	var protocol = jqURL.attr('protocol').toLowerCase();
	
	//console.log("protocol:"+protocol);
	var host = jqURL.attr('host').toLowerCase();
	//console.log("host:"+host);
	
	//Check protocol first
	if(-1 == ($.inArray(protocol,all_protocol_list)))
	{
		if($.inArray(protocol,jw_protocol_list))
		{
			//console.log("jw protocol");
			return PlayerType.jwplayer;
		}
		else if ($.inArray(protocol,sl_protocol_list))
		{	
			//console.log("sl protocol");
			return PlayerType.silverlight;
		}
	}
	
	//check host then, we can add more check list later
	if(-1 != $.inArray(host,jw_youtube_list))
	{
		//console.log("jw youtube");
		return PlayerType.jwplayer;
	}
	
	//next, check file format
	var file = jqURL.attr('file').toLowerCase();
	//console.log("file:"+file);
	
	var parts = file.split('.')
	//if no file extension
	if(parts.length<=1)
	{
		//console.log("length <=1 ")
		return PlayerType.Unknown;
	}
	//The file extension should be after the last dot
	var file_extension = parts[parts.length-1].toLowerCase();
	//console.log("file extension:"+file_extension);
	
	//check platform and browser
	var platform = getPlatform();
	var browser = getBrowser();
	
	//We prefer to use wmp in windows platform.
	if(platform == platformType.windows)
	{
		//If it's ie, we use wmp
		if(browser == browserType.ie)
		{
			if($.inArray(file_extension,wmp_audio_list) != -1)
			{
				//console.log("wmp audio");
				this.isAudio = true;
				$.fn.media.mapFormat(file_extension,"winmedia");
				return PlayerType.wmp;
			}
			else if($.inArray(file_extension,wmp_video_list) != -1)
			{
				$.fn.media.mapFormat(file_extension,"winmedia");
				//console.log("wmp video");
				return PlayerType.wmp;
			}
		}
		//if it's not ie, but other flash and silverlight players cannot play this format, we choose wmp
		else if(browser == browserType.googlechrome || browser == browserType.firefox)
		{
			if($.inArray(file_extension,wmp_audio_list) != -1 && $.inArray(file_extension,jw_audio_list) == -1 && $.inArray(file_extension,sl_audio_list)==-1)
			{
				this.isAudio = true;
				$.fn.media.mapFormat(file_extension,"winmedia");
				return PlayerType.wmp;
			}
			else if($.inArray(file_extension,wmp_video_list) != -1 && $.inArray(file_extension,jw_video_list) == -1 && $.inArray(file_extension,sl_video_list)==-1)
			{
				$.fn.media.mapFormat(file_extension,"winmedia");
				return PlayerType.wmp;
			}
		}
	}
	
	if($.inArray(file_extension,jw_audio_list) != -1)
	{
		//console.log("audio jw");
		this.isAudio = true;
		return PlayerType.jwplayer;
	}
	else if($.inArray(file_extension,sl_audio_list)!=-1)
	{
		//console.log("audio sl");
		this.isAudio = true;
		return PlayerType.silverlight;
	}
	else if($.inArray(file_extension,jw_video_list)!=-1)
	{
		//console.log("video jw");
		return PlayerType.jwplayer;
	}
	else if($.inArray(file_extension,sl_video_list)!=-1)
	{
		//console.log("video sl");
		return PlayerType.silverlight;
	}
	//Add more considering the browser and platform
	else
		return PlayerType.Unknown;
};

MultimediaFactory.prototype.getMultimediaPlayer = function(recording,outer_container, inner_container)
{
	
	var playertype = this.getPlayerType(recording);
	
	//console.log("playertype:"+playertype);
	if(playertype == PlayerType.jwplayer)
	{
		//console.log("return jwplayer");
		return new JWPlayer(recording, outer_container,inner_container);
	}
	else if(playertype==PlayerType.silverlight)
	{
		return new SilverlightPlayer(recording, outer_container,inner_container);
	}
	else if(playertype == PlayerType.wmp)
	{
		//console.log("return wmp");
		return new WindowsMediaPlayer(recording, outer_container,inner_container);
	}
	else if(playertype==PlayerType.Unknown)
	{
		//Yunjia Li:return MultimediaBase(recording, outer_container,inner_container);
		return null;
	}
	else
	{
		//Yunjia Li:return MultimediaBase(recording, outer_container,inner_container);
		return null;
	}
}
