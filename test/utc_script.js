var rdf = "";
var axis = "all";
var charac = "all";
var type = "all";
var results = new Array();

function loadRDF() {
	
	//Get RDF/XML documents
	$.ajax({
		async: false,
		type: "GET",
		url: "ua-test-cases.rdf",
		dataType: "xml",
		success: function(xml){tcRDFXML = xml;}
	});
	$.ajax({
		async: false,
		type: "GET",
		url: "media.rdf",
		dataType: "xml",
		success: function(xml){mediaRDFXML = xml;}
	});
	
	//Parse RDF data
	rdf = $.rdf();
	rdf.databank.load(tcRDFXML);
	rdf.databank.load(mediaRDFXML);
	rdf
		.prefix('http','http://www.w3.org/2006/http#')
		.prefix('httpheader','http://www.w3.org/2008/http-headers#')
		.prefix('httpcode','http://www.w3.org/2008/http-statusCodes#')
		.prefix('httpmeth','http://www.w3.org/2008/http-methods#')
		.prefix('tc','http://www.w3.org/2006/03/test-description#')
		.prefix('mftc','http://www.w3.org/2008/WebVideo/Fragments/TC/mftc#')
		.prefix('mftc-header','http://www.w3.org/2008/WebVideo/Fragments/TC/mftc-headers#')
		.prefix('httpmf','http://www.w3.org/2008/WebVideo/Fragments/TC/httpmf#')
		.prefix('tc','http://www.w3.org/2006/03/test-description#')
		.prefix('dc','http://purl.org/dc/elements/1.1/')
		.prefix('rdfs','http://www.w3.org/2000/01/rdf-schema#')
		.prefix('ctag','http://commontag.org/ns#')
		.prefix('ma','http://www.w3.org/ns/ma-ont#');
	
}

function printTestCases(){
	uaTCstoStr();
}

function updateAxis(select){
	var idx = select.selectedIndex;
	axis = select.options[idx].value;
}

function updateCharac(select){
	var idx = select.selectedIndex;
	charac = select.options[idx].value;
}

function updateType(select){
	var idx = select.selectedIndex;
	type = select.options[idx].value;
}

function filterTCs(rdf_base){
	if(axis != 'all'){
		rdf_base = rdf_base.where('?tc ctag:tagged mftc:' + axis);
	}
	if(charac != 'all'){
		rdf_base = rdf_base.where('?tc ctag:tagged mftc:' + charac);
	}
	if(type != 'all'){
		rdf_base = rdf_base.where('?tc ctag:tagged mftc:' + type);
	}
	return rdf_base;
}

function uaTCstoStr(){
	$('#ua-content').empty();
	var working_rdf = rdf			  
	  .where('?tc a mftc:UATestCase')
	  .where('?tc rdfs:label ?label')
	  .where('?tc mftc:media ?media')
	  .where('?tc mftc:mediaFragmentString ?mfstring')
	  .where('?tc mftc:expectedVisualResult ?result');
	  
	working_rdf = filterTCs(working_rdf);
	working_rdf.each(function(){
		var tmp = rdf.where(this.tc + ' ctag:tagged mftc:IncompleteTag');
		if(tmp.size() == 0) {
			var tcStr = '<tr id="' + this.label.value + '">' +
							'<td><a href="' + this.tc.value + '">' + this.label.value + '</td>';
							
			var media = this.media;
			var locator = '';
			rdf
				.where(media + ' ma:locator ?mediaURL')
				.each(function(){
					locator = this.mediaURL.value;
				});
			//Yunjia Li
			var encodedURI = encodeURIComponent("http://www.w3.org/2008/WebVideo/Fragments/media/fragf2f.ogv"+'#'+this.mfstring.value);
			var testLocator = "demo.html?mfuri="+encodedURI;
			tcStr += '<td><a href="' + testLocator + '" target="_blank">' + "fragf2f.ogv" + '#' + this.mfstring.value + '</a></td>';
			tcStr += '<td>' + this.result.value + '</td>';
			tcStr += '<td id="result_'+this.label.value+'">passed</td>';
			tcStr += '<td id="comment_' + this.label.value + '"/></td></tr>';
			
			$('#ua-content').append(tcStr);
		}
	});
};


function downloadReport(){
	if($('#testerlabel').val() == '' || $('#testeruri').val() == '' 
		|| $('#implementerlabel').val() == '' || $('#implementeruri').val() == ''
		|| $('#implementationlabel').val() == '' || $('#implementationuri').val() == ''){
		alert('Please fill in the details of the implementation you are currently testing!');
		return;
	}

	$('#reportForm').submit();
}

