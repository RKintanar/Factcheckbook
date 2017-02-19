var iteration =0;
var searchedHeadlines=[];

highlight = function() {
	var fbPosts = document.querySelectorAll('form .UFIContainer');
	console.log("posts: " + fbPosts.length);
	console.log("iteration: " + iteration);
	for(var i = iteration,length=fbPosts.length>100 ? 100 : fbPosts.length; i < length; i++){
		var alreadyCovered = fbPosts[i].parentElement.parentElement.querySelectorAll(".result-item").length;
		if (alreadyCovered==0) {
			headlineText = "";
			var linkText = fbPosts[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.querySelectorAll(".userContent");
			//console.log("linktext length" + linkText.length);
			for(var j=0;j<linkText.length;j++){
				var subLink = linkText[j].parentElement.children;
				if(subLink.length>2){
					var headLink = subLink[2].getElementsByClassName("fbStoryAttachmentImage");
					//console.log("headlink length" + headLink.length)
					for(var l=0;l<headLink.length;l++){
						if((headLink.length>0)&&(headLink != null)){
							var theHeadline = headLink[l].parentElement.parentElement.parentElement.parentElement.querySelectorAll("a");
							for(var k=0;k<theHeadline.length;k++){
								if((theHeadline[k].getElementsByClassName("fbStoryAttachmentImage").length==0)&&(theHeadline[k].innerHTML != "")&&(!theHeadline[k].innerHTML.includes("<span"))){
									if (searchedHeadlines.indexOf(theHeadline[k].innerHTML) > -1) {
										//In the array!
										//Do nothing
									} else {
										console.log("theHeadline" + theHeadline[k].innerHTML);
										searchedHeadlines.push(theHeadline[k].innerHTML);
										headlineText += theHeadline[k].innerHTML;
									}
								}
							}
						}
					}
				}
			}
			
			if(headlineText!=""){
				var list = fbPosts[i].parentElement.parentElement;
				console.log("calling pfactdiv " + headlineText);
				var startpoint = list.childNodes[0];
				list.insertBefore(pfactDiv(headlineText), startpoint);
			}
			delete headlineText;
		}
		iteration++;
	}
}

function pfactDiv(searchterm){
	var obj = document.createElement('div');
	//var rawdata = lookupTerm(searchterm);
	var rawdata = searchterm;
	var parsedText = "";
	var t = document.createTextNode(parsedText);
	obj.appendChild(t);
	if (rawdata==searchterm){
		obj.innerHTML +=rawdata;
	}else{
		console.log(rawdata.objects);
		for(var i=0;i<rawdata.objects.length;i++){
			obj.innerHTML +=  "<strong>" + rawdata.objects[i].ruling_headline + ": " + rawdata.objects[i].ruling.ruling + "</strong>";
			obj.innerHTML +="<br/>";
			if(rawdata.objects[i].art[0].caption != rawdata.objects[i].ruling_headline){
				obj.innerHTML +=  rawdata.objects[i].art[0].caption + " ";
			}
			obj.innerHTML += rawdata.objects[i].ruling_link_text ;
			obj.innerHTML +="<br/>";
			obj.innerHTML +=  "<img width=100px src='" + rawdata.objects[i].ruling.ruling_graphic + "' />";
			obj.innerHTML +="<br/>";
			obj.innerHTML +=  rawdata.objects[i].art[0].title;
			obj.innerHTML +="<br/>";
			var url = "http://www.politifact.com/" + rawdata.objects[i].canonical_url;
			obj.innerHTML += "<a href='" + url + "'>" + url + "</a>";
			obj.innerHTML +="<br/><br/><hr/>";
		}
	}
	obj.setAttribute('class','result-item');
	obj.style.backgroundColor = "#ffdddd";
	obj.style.border= "1px solid black";
	obj.style.padding= "20px";
	obj.style.margin= "1px";
	return obj;
}


function lookupTerm(headline) {
	var callURL = "https://www.politifact.com/api/v/2/statement/?order_by=-ruling_date&limit=5&edition__edition_slug=truth-o-meter";
	var speaker = getSpeakers(headline); //&speaker__name_slug=donald-trump
	if (speaker != ""){
		callURL +="&speaker__name_slug=" + speaker;
	}
	var subj = getSubjects(headline); //&subject__subject_slug=fake-new
	if (subj != ""){
		callURL +="&subject__subject_slug=" + subj;
	}
	callURL+="&format=json";
	if(speaker=="" && subj==""){
		return headline;
	}else{
		console.log("callURL " + callURL);
		return httpGetAsync(callURL);
	}
}



function httpGetAsync(theUrl) {
	console.log("httpGetAsync " + theUrl);
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			return request.responseText;
		}
	}
	xmlHttp.open("GET", theUrl, true); // true for asynchronous 
	xmlHttp.send(null);
}

function getSpeakers(headline) {
	console.log("Getspeakers " + headline);
	var speakerSlugs = "";
	if (headline.match(/trump|drumpf/i) != null) {
		speakerSlugs += "donald-trump";
	}
	if (headline.match(/Rick Scott/i) != null) {
		speakerSlugs += "rick-scott"
	}
	if (headline.match(/cuomo/i) != null) {
		speakerSlugs += "andrew-cuomo"
	}
	if (headline.match(/learnprogress/i) != null) {
		speakerSlugs += "learnprogressorg"
	}
	if (headline.match(/netanyahu/i) != null) {
		speakerSlugs += "benjamin-netanyahu"
	}
	if (headline.match(/Bernie|Sanders/i) != null) {
		speakerSlugs += "bernie-s"
	}
	if (headline.match(/stephen miller/i) != null) {
		speakerSlugs += "stephen-miller"
	}
	return speakerSlugs;
}

function getSubjects(headline) {
	var subjectSlug = "";
	if (headline.match(/immigration|immigrant|deported|travel ban|leaks|cia|war on terror|terror/i) != null) {
		subjectSlug += "homeland-security"
	}
	if (headline.match(/foreign policy|secretary of state|Iran|Iraq|Afghanistan|Israel|Brexit|EU|NATO/i) != null) {
		subjectSlug += "foreign-policy"
	}
	if (headline.match(/job|employment|economy|stock market/i) != null) {
		subjectSlug += "economy"
	}
	if (headline.match(/agriculture|farm/i) != null) {
		subjectSlug += "agriculture"
	}
	if (headline.match(/pension/i) != null) {
		subjectSlug += "pensions"
	}
	if (headline.match(/crime/i) != null) {
		subjectSlug += "crime"
	}
	if (headline.match(/education|school|teacher|student|Common Core/i) != null) {
		subjectSlug += "education"
	}
	if (headline.match(/Dakota Access Pipeline|climate change|global warming|epa/i) != null) {
		subjectSlug += "climate-change"
	}
	if (headline.match(/congress|senate/i) != null) {
		subjectSlug += "congress"
	}
	if (headline.match(/infrastructure|dam/i) != null) {
		subjectSlug += "infrastructure"
	}
	if (headline.match(/fake news/i) != null) {
		subjectSlug += "fake-news"
	}
	if (headline.match(/health|obamacare|ACA|insure/i) != null) {
		subjectSlug += "health-care"
	}
	if (headline.match(/terrorism/i) != null) {
		subjectSlug += "terrorism"
	}
	return subjectSlug;
}




highlight();


// configuration info for the DOM listener.
var domListenerConfig = {childList: true, subtree: true};

// this looks for changes in the DOM that correspond to new posts being displayed
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    //check if content was added
    if (mutation.addedNodes.length > 0) {
		//console.log("content added");
		highlight();
    }
  });
});
observer.observe(document, domListenerConfig);