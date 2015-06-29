var Toast = function (params) {
	console.log(params);
  var text = params.text,
  	icon = params.icon,
  	$box;

  function hideBox($curbox) {
    if ($curbox) {
      $curbox.removeClass('fadein').transitionEnd(function () {
        $curbox.remove();
      });
    }
  }
  
  this.show = function (show) {
    if (show) {
      $('.toast-container').off('click').off('transitionEnd').remove();
      $box = $('<div class="toast-container show">');
      var html = '<div class="toast-msg">';
      icon && (html += '<i class="icon icon-f7"></i>');
      text && (html += text);
      html += '</div>';
      $box.html(html);
      $('body').append($box);
      
      $box.click(function () {
        hideBox($box);
      });
      $box.addClass('fadein');
      setTimeout(function () {
        hideBox($box);
      }, 1500);
    } else {
      hideBox($('.toast-container'));
    }
  };
  
  return this;
};

module.exports = function (params) {
  return new Toast(params).show(true);
};
