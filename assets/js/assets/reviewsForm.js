// reviews ajax form submit
$(function() {
	var $form 		= $('.reviews-form form'),
			$textarea = $form.find('textarea');

	$form.on('submit', function(event) {
		event.preventDefault();

		var value = $textarea.val(),
				data  = $(this).serialize();

		if (value == '' || value.length < 4) $textarea.addClass('error');
		if ( !$(this).find('.error').length )  {
			ajaxSubmit( data, paramFancybox, '/ajax/review.php' );
			$form.fadeOut('600');
			$form.prev().fadeOut('600');

		}
	});

});