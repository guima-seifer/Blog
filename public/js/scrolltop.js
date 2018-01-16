$(function () {
  console.log('aqui');
  $(document).on('scroll', function () {

    if ($(window).scrollTop() > 100) {
      $('.scroll-top-wrapper').addClass('show');
    } else {
      $('.scroll-top-wrapper').removeClass('show');
    }

    $('.scroll-top-wrapper').on('click', scrollToTop);
  });

  function scrollToTop() {
    console.log('aqui!!');
    verticalOffset = typeof (verticalOffset) != 'undefined' ? verticalOffset : 0;
    var element = $('body');
    offset = element.offset();
    offsetTop = offset.top;
    $('html, body').animate({
      scrollTop: offsetTop,
    }, 500, 'linear');
  }

});
