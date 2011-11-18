// Simple function to calculate time difference between 2 Javascript date objects
function get_time_difference(earlierDate,laterDate)
{
       var nTotalDiff = laterDate.getTime() - earlierDate.getTime();
       var oDiff = new Object();
 
       oDiff.days = Math.floor(nTotalDiff/1000/60/60/24);
       nTotalDiff -= oDiff.days*1000*60*60*24;
 
       oDiff.hours = Math.floor(nTotalDiff/1000/60/60);
       nTotalDiff -= oDiff.hours*1000*60*60;
 
       oDiff.minutes = Math.floor(nTotalDiff/1000/60);
       nTotalDiff -= oDiff.minutes*1000*60;
 
       oDiff.seconds = Math.floor(nTotalDiff/1000);
 
       return oDiff;
 
}
// Function Usage
function use_time_difference()
{
	dateWhenIndiaWonFirstCricketWorldCup = new Date(1983, 6, 25, 5, 0, 0);
	dateCurrent = new Date();
	oDiff = get_time_difference(dateWhenIndiaWonFirstCricketWorldCup, dateCurrent);
	//alert("It has been " + oDiff.days + " days since India won it's first cricket worldcup");
}

function formatTime(number)
{
	return (number < 10) ? "0" + number : number;
}

//Format hh:mm:ss
function milisecToString(time)
{
	if(time==0)
		return "00:00:00";
	var remainder = time%1000;
	time = (time - remainder) /1000
	if(time<=0)
		return "00:00:00";
	remainder = time%3600
	var hours = (time - remainder)/3600;
	time=remainder;
	remainder = time % 60;
	var minutes = (time-remainder) / 60;
	var seconds = remainder;

	if (hours == 0 && minutes == 0)
		return "00:00:" + formatTime(seconds);
	else if (hours == 0)
		return "00:"+formatTime(minutes) + ":" + formatTime(seconds);
	else
		return hours + ":" + formatTime(minutes) + ":" + formatTime(seconds);
}

function stringToMilisec(timeStr)
{
	if (timeStr == null || timeStr.length == 0)
	{
		return 0;
	}

	// implement regexp validation

	var seconds = null;
	var index = timeStr.lastIndexOf(":");
	if (index != -1)
	{
		seconds = timeStr.substring(index + 1);
		timeStr = timeStr.substring(0, index);
	}
	else
	{
		seconds = timeStr;
		timeStr = null;
	}
	
	var minutes = null;
	index = (timeStr != null) ? timeStr.lastIndexOf(":") : -1;
	if (index != -1)
	{
		minutes = timeStr.substring(index + 1);
		timeStr = timeStr.substring(0, index);
	}
	else
	{
		minutes = timeStr;
		timeStr = null;
	}

	var hours = timeStr;

	var time = 0;
	if (seconds != null && seconds.length != 0)
	{
		time += parseInt(seconds,10);
	}

	if (minutes != null && minutes.length != 0)
		time += parseInt(minutes,10) * 60;

	if (hours != null && hours.length != 0)
		time += parseInt(hours,10) * 3600;

	return time * 1000;
}

function smpteStringToMilisec(timeStr)
{
	if (timeStr == null || timeStr.length == 0)
	{
		return 0;
	}

	//The parser will ignore the frame information after last : and .
	var smpteTimeArray = timeStr.split(':');
	if(smpteTimeArray.length > 3) //there are frames after last :
	{
		var index = timeStr.lastIndexOf(":");
		timeStr = timeStr.substring(0, index);
	}
	
	var seconds = null;
	var index = timeStr.lastIndexOf(":");
	if (index != -1)
	{
		seconds = timeStr.substring(index + 1);
		timeStr = timeStr.substring(0, index);
	}
	else
	{
		seconds = timeStr;
		timeStr = null;
	}
	
	var minutes = null;
	index = (timeStr != null) ? timeStr.lastIndexOf(":") : -1;
	if (index != -1)
	{
		minutes = timeStr.substring(index + 1);
		timeStr = timeStr.substring(0, index);
	}
	else
	{
		minutes = timeStr;
		timeStr = null;
	}

	var hours = timeStr;

	var time = 0;
	if (seconds != null && seconds.length != 0)
	{
		time += parseInt(seconds,10);
	}

	if (minutes != null && minutes.length != 0)
		time += parseInt(minutes,10) * 60;

	if (hours != null && hours.length != 0)
		time += parseInt(hours,10) * 3600;

	return time * 1000;
}

function getHostLocation()
{
	return document.location.protocol+"//"+window.location.host; //with / at last
}

//get browser
function getBrowser()
{
	var userAgent = navigator.userAgent.toLowerCase();
	if (userAgent.indexOf("firefox") != -1)
		return browserType.firefox;
	else if (userAgent.indexOf("msie") != -1)
		return browserType.ie;
	else if (userAgent.indexOf("chrome") != -1)
		return browserType.googlechrome;
	else if (userAgent.indexOf("safari") != -1)
		return browserType.safari;
	else if(userAgent.indexOf("opera")!=-1)
		return browserType.opera;
	else
		return browserType.unknown;
}

//get platform
function getPlatform()
{
	var platform = navigator.platform.toLowerCase();
	if(platform.indexOf("win") != -1)
	{
		return platformType.windows;
	}
	else if(platform.indexOf("mac") != -1)
	{
		return platformType.mac;
	}
	else if(platform.indexOf("linux") != -1)
	{
		return platformType.linux;
	}
	else
	{
		return platformType.unknown;
	}
}

//get url variables
$.extend({
	  getUrlVars: function(){
	    var vars = [], hash;
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++)
	    {
	      hash = hashes[i].split('=');
	      vars.push(hash[0]);
	      vars[hash[0]] = hash[1];
	    }
	    return vars;
	  },
	  getUrlVar: function(name){
	    return $.getUrlVars()[name];
	  }
});

