/*
 * Timer class for synote player. 
 * Use jquery timer plugin
 */

var SynoteTimer = Base.extend({
	SYNC_CHECK:500,
	SYNC_PERIOD:1000,
	lastPosition:0,
	
	constructor:function()
	{
		//Do nothing
	},
	run:function()
	{
		//Yunjia: If possible, check session expire time and display when there is only 1min left
		$(document).everyTime(this.SYNC_CHECK,"sync",function()
		{
			var curentPosition;
			currentPosition = multimedia.getPosition();
			if(currentPosition < timer.lastPosition || Math.abs(currentPosition-timer.lastPosition) >= timer.SYNC_PERIOD)
			{
				//multimedia.setCurrentTimeSpan();
				timer.positionChanged(currentPosition);
				timer.lastPosition = currentPosition;
			}
		});
		
		$(document).everyTime(this.SYNC_PERIOD,"display",function()
		{
			var curentPosition;
			currentPosition = multimedia.getPosition();
			if(currentPosition != timer.lastPosition)
			{
				multimedia.setCurrentTimeSpan();
			}
		});
	},
	positionChanged:function(currentPosition)
	{
		if(synmark.synchronised == true)
			synmark.sync(currentPosition);
		if(transcript.synchronised == true)
			transcript.sync(currentPosition);
		if(presentation.synchronised == true)
			presentation.sync(currentPosition);
	}
});