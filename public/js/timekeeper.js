/*
The MIT License (MIT)

Copyright (c) 2014-2016 Ichiro Maruta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var time2011 = new Date('2011/1/1 00:00:00');

$(function(){
    var loadedcss = '';
    $('#time1').val('5:00');
    $('#time2').val('9:00');
    $('#time3').val('10:00');
    $('#info').html("&nbsp;");
    $('#cur_sec').html('&nbsp;');
    $('#time1sec').html('&nbsp;');

    var time1;
    var time2;
    var time3;

  $('[data-toggle="tooltip"]').tooltip();

  const audio_chime0 = new Audio();
  const audio_chime1 = new Audio();
  const audio_chime2 = new Audio();
  const audio_chime3 = new Audio();


  function getHashParams() {
    var hashParams = {};
    var e,
      a = /\+/g, // Regex for replacing addition symbol with a space
      r = /([^&;=]+)=?([^&;]*)/g,
      d = function(s) {
        return decodeURIComponent(s.replace(a, " "));
      },
      q = window.location.hash.substring(1);

    while (e = r.exec(q))
      hashParams[d(e[1])] = d(e[2]);
    return hashParams;
  }

  function parseHashParams(){
    params = getHashParams();
    if(params.t1 !== undefined) $('#time1').val(params.t1);
		if(params.t2 !== undefined) $('#time2').val(params.t2);
		if(params.t3 !== undefined) $('#time3').val(params.t3);
		if(params.m !== undefined) $('#info').html(params.m);
		if(loadedcss !== ''){
			location.reload();
		}
		if(params.th !== undefined && /^[a-zA-Z0-9\-]+$/.test(params.th)){
			loadedcss=params.th;
		}else{
			loadedcss='default';
		}
		$('head').append('<link rel="stylesheet" type="text/css" href="theme/'+loadedcss+'.css">');
  }

	function updateHash() {
    var hashstr = '#t1=' + $('#time1').val()
		+ '&t2=' + $('#time2').val()
		+ '&t3=' + $('#time3').val()
		+ '&m=' + encodeURIComponent($('#info').html());
		if(loadedcss !== 'default'){
			hashstr = hashstr + '&th=' + encodeURIComponent(loadedcss);
		}
		$('#seturl').attr("href",hashstr);
		try{
	    history.replaceState(undefined, undefined, hashstr);
		}catch(e){
		}
  };

	$(window).on('hashchange', function() {
    parseHashParams();
		updateHash();
  });

	parseHashParams();
	updateHash();

	$('#time1,#time2,#time3,#info').change(function(){
		updateHash();
	});

	var infoline = $('#info').html();
	$('#info').blur(function() {
	    if (infoline!=$(this).html()){
	        infoline = $(this).html();
					updateHash();
	    }
	});

	// audio_chime1 = new Audio("./wav/chime1.wav");
	// audio_chime2 = new Audio("./wav/chime2.wav");
	// audio_chime3 = new Audio("./wav/chime3.wav");

	function changeStateClass(s) {
		$('body').removeClass(function(index, className) {
			return (className.match(/\bstate-\S+/g) || []).join(' ');
		});
		$('body').addClass('state-'+s);
	};

	function changePhaseClass(s) {
		$('body').removeClass(function(index, className) {
			return (className.match(/\bphase-\S+/g) || []).join(' ');
		});
		$('body').addClass('phase-'+s);
	};

	var start_time = new Date().getTime();
	var sleeped_at = start_time;
	var sleeped = 0;

	$('.nav #standby').click(function (event){
		event.preventDefault();
		$('.nav li').removeClass('active');
		$('.nav li#standby').addClass('active');
		$('#state').html('STANDBY');
		changeStateClass('standby');
		changePhaseClass('0');
		$("#time").css('backgroundColor', "white");
		show_time(0);
	});
	changeStateClass('standby');
	changePhaseClass('0');
	// var start_time=new Date();
	var last_time;
	function resumeClock() {
		if($('.nav li#start').hasClass('active')){
			return;
		}

		sleeped = sleeped_at - start_time;
		if($('.nav li#standby').hasClass('active')){
		    sleeped = 0;
		}

		$('.nav li').removeClass('active');
		$('.nav li#start').addClass('active');
		$('#state').html('&nbsp;');
		changeStateClass('start');
		start_time = new Date().getTime()-sleeped;
		last_time = null;
		audio_chime1.load();
		audio_chime2.load();
		audio_chime3.load();
	}

	$('.nav #start').click(function (event){
		event.preventDefault();
		resumeClock();
	});


	$('.nav #pause').click(function (event){
		event.preventDefault();
		if($('.nav li#standby').hasClass('active')){
			return;
		}

		if($('.nav li#pause').hasClass('active')){
		    resumeClock();
		    return;
		}

		$('.nav li').removeClass('active');
		$('.nav li#pause').addClass('active');
		update_time();
		$('#state').html('PAUSED');
		changeStateClass('paused');
		sleeped_at = new Date().getTime();
	});

	function resize_display() {
		var voffset = $('#navtop').height();
		var height=document.documentElement.clientHeight;
		// var height=$('body').height();
		var width=$('body').width();
		var theight=Math.min(height*3/5,width*1.95/5);
		// console.log("voffset: ");
		// console.log(voffset);

		$('#dummyheight').css('line-height',51+'px');

		$('#time').css('top',(height-theight)/2*1.1+voffset);
		$('#time').css('font-size',theight+'px');
		$('#time').css('line-height',theight+'px');
		var sheight=theight/6;
		$('#state').css('top',(height/2-theight/2)*0.9-sheight/2+voffset);
		$('#state').css('font-size',sheight+'px');
		$('#state').css('line-height',sheight+'px');
		var iheight=sheight;
		$('#info').css('top',height/2+theight/2*1.1+voffset);
		$('#info').css('font-size',iheight+'px');
		$('#info').css('line-height',iheight+'px');

		iheight=sheight/2;
		iheight=sheight;
		var toppos = height/2+theight/2*1.1 + iheight*3+voffset;
		$('#cur_sec').css('top', toppos);
		$('#cur_sec').css('font-size',iheight+'px');
		$('#cur_sec').css('line-height',iheight+'px');

		toppos = toppos + iheight;
		$('#time1sec').css('top', toppos);
		$('#time1sec').css('font-size',iheight+'px');
		$('#time1sec').css('line-height',iheight+'px');

	}
	$(window).bind("resize", resize_display);

	$('#soundcheck').click(function (event){
		event.preventDefault();
		// onClick of first interaction on page before I need the sounds
		audio_chime0.play();

		// later on when you actually want to play a sound at any point without user interaction
		audio_chime1.src = "./wav/chime1.wav";
		audio_chime1.load();
		audio_chime1.play();
		audio_chime1.currentTime = 0;
	});

	var tmscale = 1000;
	// tmscale = 100;
	function show_time(time_inner){
	    var totalseconds = Math.floor(time_inner/tmscale);
	    var min = Math.floor(totalseconds/60);
	    var sec = totalseconds-min*60;
	    // console.log(sec);
	    // console.log(totalseconds);
	    var time_str= min + ':' + ('00' +  sec ).slice(-2);
	    $('#time').html(time_str);
	}

	function update_time(){
		// var cur_time= new Date();
		var cur_time = new Date().getTime();
		var elap = cur_time - start_time;
		// var e=new Date((new Date('2011/1/1 00:00:00')).getTime()+(cur_time-start_time));
		show_time(elap);
	}

    var flashstarted_at = Date.now();

//// C.F : https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Animations/Tips
    function flashBackground(){
        var wnd=window;
	// var flash = document.timerSetting.flashbkgnd.checked;
	var flash = true;
        // document.timerSetting.flashColor.value = "#FFAAAA";

	if (flash) {
	    // $("#time").css('animation', "colorchange2 0.4s 2");
	    // $("#time").css('animationPlayState', "running");
	    // flashstarted_at = Date.now();

	    // $("#time").animate({backgroundColor: "#99ccff"}, 1000);

//	    $("#time").animate({
//		backgroundColor: "#99ccff",
//		color: "#000",
//		// width: 240
//		}, {
//		   duration: 2000,
//		    animationIterationCount: 2,
//		   complete: function() {
//		    $("#time").css('backgroundColor', "white");
//		   }
//		});

	    wnd.document.getElementById("time").className = "flashbase";
	    wnd.requestAnimationFrame(function(tm) {
		wnd.requestAnimationFrame(function(tm) {
		wnd.document.getElementById("time").className = "flashbase flash";
		});
	    });
	}
    }

    function show_sec(field, sec){
	    var time_str=  sec.toString();
	    // var time_str=  sec;
	    // time_str = 'abcd';
	    $(field).html(time_str);
    }

    function convertfldsec(field){
	var minsec_ary = $(field).val().split(':');
	var sec = Number(minsec_ary[0])*60 + Number(minsec_ary[1]);
	return sec;
    }


    var initialized = false;
    $.timer(100,function(timer){
	resize_display();
	if($('.nav li#start').hasClass('active')){
	    if (!initialized) {
	        // for iOS.
		// set up audio at first interaction of the page before using real audio.
		// Bug of Chrome: a playing event is queued to playing list without sound file.
		audio_chime0.play();
		audio_chime0.currentTime = 0;
		initialized = true;
	    }
	    update_time();
	    // var stm = start_time.getTime();
	    var cur_time= Date.now()/tmscale;
	    // var cur_time= (new Date().getTime()-0);
	    var time11;

	    if(last_time == null){
		// Date() sets w/ TimeZone (as set by environment) and .getTime returns UTC.
		// time11 = (new Date(1970,1,1, 00, $('#time1').val() )).getTime()+0; 
    		time1 = convertfldsec('#time1') + start_time/tmscale;
    		time2 = convertfldsec('#time2') + start_time/tmscale;
    		time3 = convertfldsec('#time3') + start_time/tmscale;
		$("#time").css('animation', "colorchange0 0.1s 1"); // dirty hack. since it doesn't reset animation sometimes. 
		flashBackground();
	    }
	    if(last_time != null){
		// var time1 = new Date(1970,1,1, 00, $('#time1').val() ).getTime() + start_time;
		// var time2 = new Date(1970,1,1, 00, $('#time2').val() ).getTime() + start_time;
		// var time3 = new Date(1970,1,1, 00, $('#time3').val() ).getTime() + start_time;
		// var time1 = new Date(stm+((new Date('2011/1/1 00:'+$('#time1').val()))-time2011 ));
		// var time2 = new Date(stm+((new Date('2011/1/1 00:'+$('#time2').val()))-time2011 ));
		// var time3 = new Date(stm+((new Date('2011/1/1 00:'+$('#time3').val()))-time2011 ));

//		if ($("#time").css('animationPlayState') ==  "running") {
//		    if (Date.now() - flashstarted_at > 2000) {
//			$("#time").css('animationPlayState', "paused");
//			// console.log("animation Paused.");
//		    }
//		}
		
		// console.log(cur_time);
		// console.log(last_time);
		// console.log(time1);
		// show_sec('#cur_sec', cur_time);
		// show_sec('#time1sec', time1);

		if((last_time < time1 && time1 <= cur_time) || (last_time==time1 && cur_time==time1)){
			changePhaseClass('1');
			// for iOS.
			// set up audio.
			// audio_chime1.src = "./wav/chime3.wav";
			// audio_chime1.src = "./wav/button82.mp3";
			audio_chime0.src = "./wav/empty.wav";
			audio_chime1.src = "./wav/chime1.wav";
			audio_chime2.src = "./wav/chime2.wav";
			audio_chime3.src = "./wav/chime3.wav";
			audio_chime1.currentTime = 0;
			// Bug of Chrome: it is queued a playing event and plays two sounds simultaneously at first visiting here, as if longer music has priority.
			audio_chime1.play();
			$("#time").css('animation', "colorchange1 0.8s 3");
			flashBackground();
		}

		if((last_time < time2 && time2 <= cur_time) || (last_time==time2 && cur_time==time2)){
			$("#time").css('backgroundColor', "violet");
			changePhaseClass('2');
			audio_chime2.currentTime = 0;
			audio_chime2.play();
			$("#time").css('animation', "colorchange2 0.8s 3");
			flashBackground();
			$("#time").css('backgroundColor', "#ffffaa");

		}

		if((last_time < time3 && time3 <= cur_time) || (last_time==time3 && cur_time==time3)){
			changePhaseClass('3');
			audio_chime3.currentTime = 0;
			audio_chime3.play();
			$("#time").css('animation', "colorchange3 0.8s 6");
			flashBackground();
			$("#time").css('backgroundColor', "#ff8888");
		}

	    }
	    last_time=cur_time;
	}
    })
});
