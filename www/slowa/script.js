var i = 1;
var t = 0;
var already = [];
var correct = 0;
var coc = false; //check or clear if false, check the answer on enter, if true clear the last answer and proceed to the next question

var a = 0;  // first question from the set
var b = 49;  // last question from the set
var range = b-a;  // how many possible questions?
var n = 0; // how many questions should we ask?

// parameters input

function initFull() {
	b = document.getElementById("b").value*25-1;
	a = 0;
	n = document.getElementById("n").value;
	showTest();
}
function initPartial() {
	b = document.getElementById("b").value*25-1;
	a = b - 24;
	n = document.getElementById("n").value;
	showTest();
}

// start (show) the test

function showTest() {
	document.getElementById("main").innerHTML = "<form onsubmit=\"return false\"><div id=\"question\"></div><br/><br/><input type=\"text\" id=\"answer\"/><br/><input type=\"button\" value=\"Check\" onclick=\"check()\"/></form>";
	range = b - a + 1;
	i = 0;
	next();
}

// conduct the test

function next() {
	t = Math.floor((Math.random() * range))+a;
	while(typeof already[t] !== 'undefined')
	{
		t++;
		t = ((t - a)%range) + a;
	}
	document.getElementById("question").innerHTML = question[t];	
	already[t] = true;
	i++;
}

function clickPress(event) {
    if ((event.keyCode == 13)&&(i!=n+1)) {
        if(!coc)
		{
			check();
		}
		else
		{
			clear();
			coc = false;
		}
    }
}

function check() {
	if(document.getElementById("answer").value==answer[t])
	{
		document.getElementById("body").style = "background-color:#7FFF00";
		correct++;
		clear();
	}
	else
	{
		coc = true;
		document.getElementById("body").style = "background-color:#DC143C";
		document.getElementById("question").innerHTML = answer[t];
		//setTimeout(clear(),1000);
	}
}

function clear() {
	document.getElementById("answer").value = "";
	if(i==n)
	{
		document.getElementById("main").innerHTML = (correct + "/" + n);
		i++;
	}
	else
	{
		next();
	}
	if(coc)
	{
		document.getElementById("body").style = "background-color:white";
	}
	else
	{
		setTimeout(function() {document.getElementById("body").style = "background-color:white";},500);
	}
}