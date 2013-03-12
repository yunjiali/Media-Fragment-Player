smfplayer.utils={
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
	}
}