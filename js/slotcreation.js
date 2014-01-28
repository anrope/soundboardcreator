;(function ( $, window, document, undefined ) {
  $(document).ready(function () {

    var callEmbedly = function (url) {
      var call = "http://api.embed.ly/1/oembed?url=";
      $.getJSON(call + encodeURIComponent(url) + "&callback=?", function(data) {
        alert(data);     
      });
    }

    var loadSlot =  function($input, $button){
      if($input.length !=0){
        $input.on('focus', function(){
          $(this).val("");
          $(this).attr("enabled", true);
        })

        $(document).keypress(function(e) {
          if(e.which == 13) {
            $button.click();
          }
        });

        $button.on('click', function(){
          var url = $input.val();

          //do something with data
          data = callEmbedly(url);
          return false;
        });
      }
    }
    loadSlot($("#url-input"),$(".button",".url-input-mod"));
  });
})(jQuery, window, document);
