// Menu products list
$(function(){

	$('.js-menu').fotorama({
		transition: "crossfade",
		shadows:false,
		arrows:'always',
		allowfullscreen:false,
		height:770,
		width: 375,
		click:false
	});


	var $link = $('.products-left a'),
			$list = $('.products-right .js-menu');

	$link.on('click', function(event) {
		event.preventDefault();
		var	$this   = $(this),
				$parent = $this.parent(),
				index   = $this.data('index');
				
		$link.parent().removeClass('active');
		$parent.addClass('active');

		$list.removeClass('active');
		$list.each(function() {
			var i = $(this).data('index');

			if (i == index) {
				$(this).addClass('active')
				return;
			}
		});

	});



});