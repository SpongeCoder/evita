
$(function() {
	var $phoneLink 		= $('.feedback-phone'),
			$requestLink 	= $('.request button'),
			$phonePopup 	= $('.js-phone'),
			$requestPopup = $('.js-request'),
			$phoneForm		= $phonePopup.find('form'),
			$requestForm	= $requestPopup.find('form');
			
	$phoneLink.on('click', function(event) {
		event.preventDefault();
		paramFancybox.content = $phonePopup.clone(true);
		$.fancybox(paramFancybox);
	});

	$requestLink.on('click', function() {
		paramFancybox.content = $requestPopup.clone(true);
		$.fancybox(paramFancybox);
	});

	$phoneForm.on('submit', function(event) {
		event.preventDefault();
		var $this 	= $(this),
				$input	= $this.find('input'),
				data		= $this.serialize();

		$input.each(function(){
			if ($(this).val() == '' || $(this).val().length < 2) $(this).addClass('error');
			else $(this).removeClass('error');
		});
		
		if( !$this.find('.error').length )  ajaxSubmit( data, paramFancybox, '/ajax/mail.php');
	});

	$requestForm.on('submit', function(event) {
		event.preventDefault();
		var $this 	= $(this),
				$input	= $this.find('input'),
				$name		= $input.filter('[name=name]'),
				$phone	= $input.filter('[name=phone]'),
				$email	= $input.filter('[name=email]'),
				data		= $this.serialize();

		if ($name.val() == '' || $name.val().length < 1) $name.addClass('error');
		else $name.removeClass('error');

		if (($phone.val() == '' || $phone.val().length < 3) && ($email.val() == '' || $email.val().length < 3)) $phone.addClass('error');
		else $phone.removeClass('error');

		if (($phone.val() == '' || $phone.val().length < 3) && ($email.val() == '' || $email.val().length < 3)) $email.addClass('error');
		else $email.removeClass('error');

		if( !$this.find('.error').length ) ajaxSubmit( data, paramFancybox, '/ajax/mail.php');
	});

});