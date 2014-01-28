;(function ( $, window, document, undefined ) {
  $(document).ready(function () {

    var callEmbedly = function (url, cb) {
      var call = "http://api.embed.ly/1/oembed?scheme=http&url=";
      $.getJSON(call + encodeURIComponent(url) + "&callback=?", cb);
    }

    var createSlot = function (data) {
      if (data.html) {
        $("#slot1").html(data.html + "<button>Play</button>");
      } else { 
        $("#slot1").html("Try Again?") 
      }
    }

    // adds URL data from Embedly
    var addURL =  function($input, $button){
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
          data = callEmbedly(url, createSlot);
          
          return false;
        });
      }
    }

    // Adds start, end time from user
    var addTime = function($input1, $input2, $button){

        $(document).keypress(function(e) {
          if(e.which == 13) {
            $button.click();
          }
        });

        $button.on('click', function(){
          var start = $input1.val();
          var end = $input2.val();

          //load into slot on page
          alert("Start:" + start + " to End:" + end);
          return false;
        });
    }

    addURL($("#url-input"),$(".button",".url-input-mod"));
    addTime($("#time-input-1"),$("#time-input-2"),$(".button",".time-input-mod"));
  });
})(jQuery, window, document);
