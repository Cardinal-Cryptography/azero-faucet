$(() => {
  const form = $('form.js-ajax-form');
  const message = form.find('.js-ajax-form-message');
  const button = form.find('.js-ajax-form-button');

  form.parsley({
    focus: 'none',
    classHandler(el) {
      return el.$element.parents('.form-group');
    },
    errorsContainer(el) {
      return el.$element.parents('.form-group');
    },
  });

  form.on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!form.parsley().validate())
      return;

    message.slideUp().removeClass('is-success is-error');
    button.attr('disabled', 'disabled');

    $.ajax({
      type: form.attr('method'),
      url: form.attr('action'),
      dataType: 'json',
      data: form.serialize(),
      processData: false,
      success: (response) => {
        button.removeAttr('disabled');

        message
          .html(response.message)
          .addClass('is-success')
          .slideDown();

        setTimeout(() => {
          message.slideUp();
        }, 5000);

        form.find('input[type="text"]:not(.h-form), input[type="email"], input[type="tel"], input[type="url"]').val('');
        form.find('input[type="checkbox"]').prop('checked', false);

        grecaptcha.reset();
      },
      error: (error, ajaxOptions, thrownError) => {
        button.removeAttr('disabled');

        message
          .html(error.responseText ? error.responseText : thrownError)
          .addClass('is-error')
          .slideDown();

        grecaptcha.reset();
      },
    });
  });
});

window.onload = function() {
  var $recaptcha = document.querySelector('#g-recaptcha-response');

  if($recaptcha) {
    $recaptcha.setAttribute("required", "required");
  }
};
