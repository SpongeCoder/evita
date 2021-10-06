//= vendor/jquery.js
//= vendor/jquery.fancybox2.js

var paramFancybox = {
	content: '', 
	padding: 0, 
	wrapCSS: 'feedback-wrap', 
	helpers : {
    overlay : {
      locked : false // try changing to true and scrolling around the page
    }
  }
};

function ajaxSubmit (data, paramFancybox, url) {
	
	$.post(url, data, function(response){
		setTimeout(function(){
	    $.fancybox.close();
	  }, 3000);
	  paramFancybox.content = response;
		$.fancybox(paramFancybox);
	});

}


//= vendor/slick.min.js
//= vendor/fotorama.js

//= assets/popupForm.js
//= assets/productMenu.js
//= assets/reviewsForm.js

$(function() {
	$('.fancybox').fancybox({		
		helpers : {
      overlay : {
        locked : false
      }
    }
	});

	var slideParam = {
	  infinite: true,
	  slidesToShow: 3,
	  slidesToScroll: 1,
	  dots: false,
	  variableWidth:true,
	  swipe:true,
	  swipeToSlide:true,
	  autoplay: true,
  	autoplaySpeed: 3000,
	  prevArrow: '<a href="#" class="slick-prev"></a>',
	  nextArrow: '<a href="#" class="slick-next"></a>',
	}

	$('.about-foto .slide').slick(slideParam);

	slideParam.autoplaySpeed = 4000;
	$('.about-prize .slide').slick(slideParam);
});