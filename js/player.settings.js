var jw_audio_list = new Array("mp3","aac","m4a","ogg","wav");
var jw_video_list = new Array("mp4","mov","f4v","flv","3gp","3g2","ogv","webm");
var jw_youtube_list = new Array("www.youtube.com","youtube.be","youtu.be");
var jw_protocol_list = new Array("rtmp");

//For silverlight player
var sl_audio_list=new Array("wma","mp3");
var sl_video_list=new Array("wmv");
var sl_protocol_list = new Array("mms","rtsp","rstpt");

//For windows media player
var wmp_audio_list = new Array("wma","mp3","wav","mid","midi");
var wmp_video_list = new Array("avi","wmv","mpg","mpeg","m1v","mp2","mpa");
var wmp_protocol_list = new Array("mms","rtsp","rstpt");

//For all accepted common things
var all_protocol_list = new Array("http","https");

var PlayerType = {"jwplayer":0,"silverlight":1,"wmp":2,"Unknown":99};
var browserType = {"ie":0,"firefox":10,"safari":20,"googlechrome":30,"opera":40,"unknown":99};
var platformType = {"windows":0,"linux":10,"mac":20,"unknown":99};

//Yunjia: Have to think about wav!