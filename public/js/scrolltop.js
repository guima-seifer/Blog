$(document).ready(function() {
  $(function() {
    $('[data-toggle="tooltip"]').tooltip(),

      $(document).on('scroll', function() {

        if ($(window).scrollTop() > 100) {
          $('.scroll-top-wrapper').addClass('show');
        } else {
          $('.scroll-top-wrapper').removeClass('show');
        }
      });

    $('.scroll-top-wrapper').on('click', scrollToTop);
  });

  function scrollToTop() {
    verticalOffset = typeof(verticalOffset) != 'undefined' ? verticalOffset : 0;
    element = $('body');
    offset = element.offset();
    offsetTop = offset.top;
    $('html, body').animate({
      scrollTop: offsetTop,
    }, 500, 'linear');
  }

  // TODO: terminar de configurar o delay nos tooltips dos floating buttons
  // $(function () {
  //   $btns = $('.btn-lg').find('button');
  //   $btns.tooltip({
  //     trigger: 'hover',
  //     delay: {
  //       show: 50,
  //       hide: 50,
  //     },
  //     container: 'body',
  //   });
  //   $('.btn-lg').on('mouseenter', function (e) {
  //     setTimeout(function () {
  //       console.log('100');
  //       setTooltips({
  //         show: 100,
  //         hide: 100,
  //       });
  //     }, 500);
  //   }).on('mouseleave', function (e) {
  //     console.log('500');
  //     setTooltips({
  //       show: 100,
  //       hide: 100,
  //     });
  //   });
  // });
  // function setTooltips(opt) {
  //   $btns.each(function () {
  //     $(this).data('bs.tooltip').options.delay = opt;
  //     console.log($btns.data('bs.tooltip').options.delay);
  //   });
  // }
});
