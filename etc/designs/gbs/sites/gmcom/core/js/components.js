$(document).ready(function() {

    // *******************************************************************************
    // Channel Box & Accordion Box
    // *******************************************************************************
  
    $(".collapse-box").find('.channelbox-title').click(function() {
      $(this).parents('.collapse-box').toggleClass('is-open');
    });
  
    $(".accordion-box").find('.channelbox-title').click(function() {
      $(this).parents('.accordion-box').toggleClass('is-open');
      $(".channelbox-title").not(this).parents('.accordion-box').removeClass('is-open');
    });

	// *******************************************************************************
	// Remove/Add Channel Box & Accordion Box on Specific Screen Size
	// *******************************************************************************
    var $window = $(window),
        $html = $('.collapse-box.is-open');
    function resize() {
        if ($window.width() < 1024) {
            return $html.removeClass('is-open');
        }
        $html.addClass('is-open');
    }
    $window
        .resize(resize)
        .trigger('resize');
});
function printPage() {
	window.print();
}