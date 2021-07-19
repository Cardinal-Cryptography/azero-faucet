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

    let captchaResponse = false;

    fetch('//www.google.com/recaptcha/api/siteverify?secret=6LcToacbAAAAAIqI1IUAmanCNly2c7jHfej-q531&response=03AGdBq24qpi32KNFQJT8TCU6T-THDyG984te2P0HGQFnAve3WNdbvHNugO-pjjOrlRbdVj9kxKpNVTtkSZNWYybtyKGVAUv76vpnzyRneBG924cxT-e2snmgu7Gjj2U1b1NOyqSOvQYh1mfvP50rgA8y_KC10LxwEHaovo1KU216EqekeoKbGozDgf3H6dGykNg9QQCOoneaZfMtuB2875cgFmWuUeJndQLPuwubZoF-BdGjuXJtHNO-6zS4kLoqICqt68x9pQi5qzW_Am5qoM--Z3I9nMNf6db2VMtbjC1F_96IouxUEySvH3y0Q2TyHEDAjyUjtlsvrUWhO6cdOqZHDBb7D2D_TGnEi84nxYccSmxzsIYOnmSZQRfnkXO5qc1TqDSzHLy7CJLROto077ii11dj2B_jBZzonW_5kQ-Al2OdpCovRLADW0LgGqEBdHMbpYsdOWKypxxIob2C3n7p-8ywN8BBOOYVZ4wgBoaj2dopjcQK1OsAC3Bp0ZW6AyHLu7UTETJaH')
      .then((response) => response.json())
      .then((googleResponse) => {
        captchaResponse = googleResponse.success === true;
      })
      .catch(() => {
        captchaResponse = false;
      });

    console.log(captchaResponse);
    console.log(form.serialize());

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
      },
      error: (error, ajaxOptions, thrownError) => {
        button.removeAttr('disabled');

        message
          .html(error.responseText ? error.responseText : thrownError)
          .addClass('is-error')
          .slideDown();
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
