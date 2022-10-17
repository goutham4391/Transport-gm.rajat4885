var getSiteSections = function() {
    var l = document.createElement("a");
    l.href = window.location.href;
    var ss = l.pathname.replace("/our-stories/", "/stories/").replace(".html", "").split('/');
	ss[0] = "index";
	
	if(ss.length == 2 && ss[1] == ""){
		ss.pop();
	}
	
	return ss;
};

var digitalData = window.digitalData || {
	pageInfo: {},
	internalCampaignInfo: {},
	articleInfo: {},
	visitorProfile: {},
	vehicleInfo: {},
	toolsInfo:{}
};

var siteSections = getSiteSections();
digitalData.pageInfo.siteSectionsLevel1 = siteSections[0];
digitalData.pageInfo.siteSectionsLevel2 = (siteSections[1] === undefined ? "undefined" : siteSections[1]);
digitalData.pageInfo.siteSectionsLevel3 = (siteSections[2] === undefined ? "undefined" : siteSections[2]);
digitalData.pageInfo.siteSectionsLevel4 = (siteSections[3] === undefined ? "undefined" : siteSections[3]);
digitalData.pageInfo.siteSectionsLevel5 = siteSections.join(":");

digitalData.pageInfo.pageName = digitalData.pageInfo.siteSectionsLevel5;
digitalData.pageInfo.url = window.location.href;
digitalData.pageInfo.seoStrategyPageName = document.title;
digitalData.pageInfo.pageType = "article";
digitalData.pageInfo.languageSelected = "english";
digitalData.pageInfo.brand = "gm";
digitalData.pageInfo.country = "United States";
digitalData.pageInfo.siteName = "gmcom_" + "United States";
digitalData.pageInfo.region = "North America";

/* responsive design */ //Call it from footer. Not suitable without Foundation
var trackRenderedExperience = function() {
	if (window.matchMedia(Foundation.MediaQuery.get('large')).matches) {
		digitalData.pageInfo.renderedExperience = 'large';
	}
	else if (window.matchMedia(Foundation.MediaQuery.get('medium')).matches) {
		digitalData.pageInfo.renderedExperience = 'medium';
	}
	else if (window.matchMedia(Foundation.MediaQuery.get('small')).matches) {
		digitalData.pageInfo.renderedExperience = 'small';
	}
}

var trackRenderedExperienceWithoutFoundation = function() {
	var width = window.innerWidth;
	if (width > 1024) {
		digitalData.pageInfo.renderedExperience = 'large';
	}
	else if (width >= 640) {
		digitalData.pageInfo.renderedExperience = 'medium';
	}
	else if (width > 0) {
		digitalData.pageInfo.renderedExperience = 'small';
	}
}

var trackViewportSize = function() {
	digitalData.pageInfo.viewport = window.innerWidth + 'x' + window.innerHeight;
}


var trackOrientation = function() {
	if(window.innerWidth > window.innerHeight) {
		digitalData.pageInfo.orientation='landscape';
	}
	else {
		digitalData.pageInfo.orientation='portrait';
	}
}

trackViewportSize();
trackOrientation();
trackRenderedExperienceWithoutFoundation();
// window.onload = function() {
//     trackRenderedExperience();
// }


// digitalData.articleInfo.articleName = name;