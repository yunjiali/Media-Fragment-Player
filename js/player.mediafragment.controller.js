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
		if(!(mf_json && mf_json.hash && mf_json.hash.t))
		{
			console.log("ent");
			this.playback_entire();
		}
		else
		{
			console.log("middle");
			this.playback_middle();
		}
	},
	stop_playback:function(label)
	{
		$(document).stopTime(label);
		multimedia.pause();
	},
	playback_entire:function()
	{
		multimedia.play();
	},
	//Playback from the start to et 
	playback_front:function()
	{
		multimedia.play();
		$(document).everyTime(this.CHECK_PERIOD,"front",function()
		{
			var et = mf_json.hash.t[0].end;
			if(multimedia.getPosition() > et)
			{
				controller.stop_playback("front");
			}
		});
	},
	//Playback from st to et
	playback_middle:function()
	{
		var st = mf_json.hash.t[0].start;
		//multimedia.play();
		multimedia.playFrom(st*1000);
		$(document).everyTime(this.CHECK_PERIOD,"middle",function()
		{
			var et = mf_json.hash.t[0].end;
			if(multimedia.getPosition() > et*1000)
			{
				controller.stop_playback("middle");
			}
		});
	},
	//Playback from
	playback_end:function()
	{
		var st = mf_json.hash.t[0].start;
		multimedia.playFrom(st*1000);
	}
});