// Original module by AfterHoursProgramming.com
// Copyright (c) 2012 AfterHoursProgramming.com. All rights reserved.
// Forked by Nicholas Alipaz to extend functionality.
var optionToggler = 1;

restore_options();

//handlers 
document.getElementById('pCountId').onchange = function() {
	createContent();
	save_options();
}
document.getElementById('paragraphLengthId').onchange = function() {
	createContent();
	save_options();
}
document.getElementById('pFormId').onchange = function() {
	paragraphChange();
	save_options();
}
document.getElementById('breakTypeId').onchange = function() {
	createContent();
	save_options();
}
document.getElementById('breakTimesId').onchange = function() {
	createContent();
	save_options();
}
document.getElementById('textTypeId').onchange = function() {
	createContent();
	save_options();
}
document.getElementById('contGenId').onclick = function() { 
	if(document.getElementById('selectableId').value == "Yes") {
		selectContent(this);
		save_options();
	}
}
document.getElementById('optionsId').onclick = function() { 
	showOptions();
	document.getElementById('pCountId').focus();
	return false;
}

//functions
function createContent() {
	selection = document.getElementById('textTypeId').value;
	var req = new XMLHttpRequest(); // read via XHR
	var url = chrome.extension.getURL('text/' + selection + '.txt'); // full url
	req.open('GET', url, true);
	req.onreadystatechange = function() {
		if(req.readyState == 4 && req.responseText) {
			content = textArray(req.responseText);
			drawContent(content);
			return req.responseText;
		}
	};
	req.send(null);
}
function textArray(text) {
	text = text.split(/[.?!]+ /);
	text.pop(); //remove trailing space element
	return (text);
}
function drawContent(content) {
	var loopCount = document.getElementById('paragraphLengthId').value;
	var text = "";
	var formType = document.getElementById('pFormId').value;
	var pNum = document.getElementById('pCountId').value;
	for (var a = 0; a < pNum; a++) { //prints out number of paragraphs
		if (formType == "Yes") { //if in paragraph form, add opening paragraph tag
			text = text + "&lt;p&gt;";
		}
		for (var b = 0; b < loopCount; b++) { //append random sentence
			var rand = Math.floor((Math.random()*19));
			var sentence = content[rand];
			if (b == loopCount - 1) {
				text +=  sentence + ".";
			} else {
				text +=  sentence + ". ";
			}
		}
		if (formType == "Yes") { //if in paragraph form, add end paragraph tag
			text = text + "&lt;/p&gt;";
		}
		if (a != pNum - 1) {
			var breakNum = document.getElementById('breakTimesId').value;
			if (document.getElementById('breakTypeId').value == 1 && formType != "Yes") {
				for(c = 0; c < breakNum; c++) {
					text += "\n";
				}
			} else if(formType != "Yes") {
				for(c = 0; c < breakNum; c++) {
					text += "<br/>";
				}
			} else {
				for(c = 0; c < 2; c++) {
					text += "\n";
				}
			}
		}
	}
	document.getElementById('contGenId').innerHTML = text;
}
function showOptions() {
	if (optionToggler == 1) {
		document.getElementById('contGenId').style.display = 'none';
		document.getElementById('optionsId').setAttribute('title','Show the default text');
		document.getElementById('optionsId').innerHTML = 'Show Text';
		document.getElementById('genOptId').style.display = 'block';
		optionToggler = 0;
	} else {
		document.getElementById('contGenId').style.display = 'block';
		document.getElementById('optionsId').setAttribute('title','Show more default text options');
		document.getElementById('optionsId').innerHTML = 'More Options';
		document.getElementById('genOptId').style.display = 'none';
		selectContent(document.getElementById('contGenId'));
		optionToggler = 1;
	}
	
}
function selectContent(element) {
	element.focus();
	element.select();
}
function paragraphChange() {
	var state = document.getElementById('pFormId').value;
	if (state == "No") {
		document.getElementById('extraSpacers').setAttribute('style','');
		document.getElementById('spacerCount').setAttribute('style','');
	} else {
		document.getElementById('extraSpacers').setAttribute('style','display:none;');
		document.getElementById('spacerCount').setAttribute('style','display:none;');
		document.getElementById('optionsId').focus();
	}
	createContent();
}
function get_default_settings() {
	var settings = {
		'form_values': {
			pCountId: '1',
			paragraphLengthId: '10',
			pFormId: 'No',
			breakTypeId: '1',
			breakTimesId: '2',
			textTypeId: 'loremIpsum',
			selectableId: 'No'
		}
	};

	return settings;
}
function save_options() {
	var defaults = get_default_settings();
	var settings = {'form_values': {}};
	for (var key in defaults.form_values) {
		settings['form_values'][key] = document.getElementById(key).value;
	}
	chrome.storage.sync.set(settings);
}
function restore_options() {
	chrome.storage.sync.get("form_values", function(settings) {
		for (var fieldId in settings.form_values) {
			document.getElementById(fieldId).value = settings.form_values[fieldId];
		}
		createContent();
	});
}