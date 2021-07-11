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

    const data = new FormData(this);

    $.ajax({
      type: form.attr('method'),
      enctype: 'multipart/form-data',
      url: form.attr('action'),
      data: data,
      processData: false,
      contentType: false,
      cache: false,
      timeout: 600000,
      success: (response) => {
        button.removeAttr('disabled');

        console.log('success', response);

        message
          // .html()
          .addClass('is-success')
          .slideDown();

        setTimeout(() => {
          message.slideUp();
        }, 5000);

        form.find('input[type="text"]:not(.h-form), input[type="email"], input[type="tel"], input[type="url"]').val('');
        form.find('input[type="checkbox"]').prop('checked', false);
      },
      error: (error) => {
        button.removeAttr('disabled');

        console.log(error, error.getMessage());

        message
          // .html()
          .addClass('is-error')
          .slideDown();
      },
    });
  });
});
