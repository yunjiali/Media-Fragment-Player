/*
 * Control the visual output of multimedia player according to media fragments info
 */
		
var MediaFragmentController = Base.extend({
	CHECK_PERIOD:1000,
	constructor:function()
	{
		//Do nothing
	},
	//based on the conditions provided by the ua test cases to decide which of the four playback function to call
	start_playback:function()
	{
		//To Steiner: #t=0:00:03 will return start:0:00:03
		//To Steiner: why not add stringtoseconds fucntion to convert 0:00:03 to 3?
		//To Steiner: check smpte start and end time 
		//To Steiner: error message output
		//To Working Group: the test cases don't have explanation on how query and hash act differently
		
		if(!mf_json) //media fragment is not successfully parsed
		{
			//console.log("mf_json entire");
			this.playback_entire();
			return;
		}
		
		var st, et, unit; //st, et are in seconds
		
		//I just assume that the st and et in query will be rewritted by the information in hash
		if(mf_json.query) //Do something to get the fragment information from query uri
		{
			if(mf_json.query.t)
			{
				st = mf_json.query.t[0].start?mf_json.hash.t[0].start:0;
				et = mf_json.query.t[0].end?mf_json.hash.t[0].end:-1; //-1 means no end time is provided
				unit = mf_json.query.t[0].unit;
			}
		}
		
		if(mf_json.hash) // mf_json.hash
		{
			if(mf_json.hash.t)
			{
				st = mf_json.hash.t[0].start?mf_json.hash.t[0].start:0;
				et = mf_json.hash.t[0].end?mf_json.hash.t[0].end:-1; //-1 means no end time is provided
				unit = mf_json.hash.t[0].unit;
			}
		}	
			
		if(unit)
		{
			unit = $.trim(unit).toLowerCase();
		}
		//TODO: get xywh info
		if(unit=="smpte" || unit == "smpte-25" || unit == "smpte-30" || unit == "smpte-30-drop")
		{
			st = stringToMilisec(st)/1000; //this method is defined in player.util.js
			//console.log("smpte st:"+st);
			if(et != -1)
				et = stringToMilisec(et+"")/1000;
			//console.log("smpte et:"+et);
			if(et!=-1 && st>et)
			{
				console.log("entire smpte");
				this.playback_entire();
				return;
			}
		}
		
		//TODO: Use getDuration() method to decide if et > duration
		if(st == 0 && et > st) // st = 0 or not provided, et is prvided
		{
			//console.log("front");
			this.playback_front(et);
			return;
		}
		else if(st > 0 && et > st)
		{
			//console.log("middle");
			this.playback_middle(st,et);
			return;
		}
		//else if(st == 0 && et ==-1)
		//{
		//	this.playback_entire();
		//	return;
		//}
		else if(st > 0 && et == -1) //st is provide, but et is not provided
		{
			//console.log("end");
			this.playback_end(st);
			return;
		}
		else
		{
			//console.log("entire last");
			this.playback_entire();
			return;
		}
	},
	stop_playback:function(label)
	{
		$(document).stopTime(label);
		multimedia.pause();
	},
	playback_entire:function()
	{
		//multimedia.play();
		multimedia.initPlayer(factory.isAudio,0);
	},
	//Playback from the start to et 
	playback_front:function(et)
	{
		//multimedia.play();
		multimedia.initPlayer(factory.isAudio,0);
		$(document).everyTime(this.CHECK_PERIOD,"front",function()
		{
			//var et = mf_json.hash.t[0].end;
			if(multimedia.getPosition() > et)
			{
				ctrler.stop_playback("front");
			}
		});
	},
	//Playback from st to et
	playback_middle:function(st,et)
	{
		//var st = mf_json.hash.t[0].start;
		//multimedia.play();
		//console.log("middle st:"+st);
		multimedia.initPlayer(factory.isAudio,st*1000);
		//multimedia.playFrom(st*1000);
		$(document).everyTime(this.CHECK_PERIOD,"middle",function()
		{
			//var et = mf_json.hash.t[0].end;
			if(multimedia.getPosition() > et*1000)
			{
				ctrler.stop_playback("middle");
			}
		});
	},
	//Playback from
	playback_end:function(st)
	{
		//var st = mf_json.hash.t[0].start;
		multimedia.initPlayer(factory.isAudio,st*1000);
	}
});