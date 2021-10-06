//= vendor/device.min.js

function headerScroll(header) {
	if ( $(window).scrollTop() > 50 ) header.removeClass('big');
	else header.addClass('big');
}

$(function(){
	var $header = $('header');

	headerScroll($header);

	$(window).scroll(function() {
		headerScroll($header);
	});

	/*------- Video ---------*/
	var video 		= document.getElementById("video");
			videoSrc 	= 'water.mp4';

	if (!device.tablet() && !device.mobile()) {
		video.src = videoSrc;
		video.load();

		video.onloadeddata = function(event){
			$(this).css('opacity',1);		
		}
	}


	/*------- Sider -------*/
	var $slider 			= $('.slider'),
			$activeLink		= $slider.find('nav li').eq(1).addClass('active'),
			$menuLink 		= $slider.find('nav li > a'),
			$imgSlider 		= $slider.find('section li'),
			$catalogLink 	= $slider.find('.link'),
			timeId;

	$imgSlider.eq(0).addClass('active');
	$menuLink.on('click', function(event){
		event.preventDefault();

		var index = $(this).parent().index();

		if(index == 0) return false;

		$menuLink.parent().removeClass('active');
		$(this).parent().addClass('active');

		$imgSlider.removeClass('active');
		$imgSlider.eq(index - 1).addClass('active');

		clearInterval(timeId);
		$activeLink = $(this).parent();
		animationSlide();	
	});


	function animationSlide () {
		timeId = setInterval(function() {
			if ($activeLink.next().length) $activeLink.next().find('a').click();
			else $slider.find('nav li').eq(1).find('a').click();
		}, 6000); 
	}

	animationSlide();	

});