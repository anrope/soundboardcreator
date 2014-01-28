var setupButtonListeners = function () {
  $('button').each(function (index) {
    this.addEventListener('click', function () {
      moveToHugeSlot(this.parentNode)
    });
  });
}

var moveToHugeSlot = function (slot) {
  console.log('move to huge slot', slot.id);
  $('.huge-slot').each(function () {
    $(this).hide()
  });
  $('.' + slot.id).show();  
}

var playSlot = function(slot, start, end) {
  console.log('playing slot', document.getElementsByClassName(slot)[0]);
  var embed = document.getElementsByClassName(slot)[0].firstElementChild.contentWindow;
  var embedDomain = 'http://cdn.embedly.com';
  
  // set up a listener so we can hear about events happening with the embed
  embed.postMessage(JSON.stringify({
    method: 'addEventListener',
    value: 'playProgress'
  }), embedDomain);

  // set the duration and start playing
  embed.postMessage(JSON.stringify({
    method: 'setCurrentTime',
    value: start
  }), embedDomain);
  embed.postMessage(JSON.stringify({
    method: 'play'
  }), embedDomain);

  // stop the embed once we hit our end time
  window.setTimeout(function () {
    console.log('setTimeout pausing', (end - start) * 1000, slot);
    embed.postMessage(JSON.stringify({
      method: 'pause'
    }), embedDomain);
  }, (end - start) * 1000);
}

$(document).ready(function () {
  setupButtonListeners();

  $('.huge-slot').each(function () {
    $(this).hide()
  });
  
  window.addEventListener('message', function (a, b, c) {
    console.log('window message listener', a, b, c)
  })

  window.setTimeout(function () {
    console.log(document.getElementsByTagName('iframe')[0].id)
  }, 1000);

  /////////////////
  //Slot Creation
  ///////////////
    var callEmbedly = function (url, cb) {
      var call = "http://api.embed.ly/1/oembed?width=600&scheme=http&url=";
      $.getJSON(call + encodeURIComponent(url) + "&callback=?", cb);
    }

    var createSlot = function (data) {
      if (data.html) {
        //slot1 should be removed for something generic
        $(".slot1").html(data.html);
        $(".slot1").attr("data-html", data.html);
        $(".slot1").attr("data-title", data.title);
        $(".slot1").attr("data-description", data.description);
        $(".url-input-mod").hide();
        $(".time-input-mod").show();
      } else { 
        $("#slot1").html("<button>Try Again?</button>");
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

          //load data into slot div
          $(".slot1").attr("data-start", start);
          $(".slot1").attr("data-end", end);
          
          $("#slot1 button").on('click', function(start, end){
            playSlot('slot1', start, end);
          });
          $("#slot1 button").text(  "Play"); 
          
          $(".time-input-mod").hide();

          return false;
        });
    }

    addURL($("#url-input"),$(".button",".url-input-mod"));
    addTime($("#time-input-1"),$("#time-input-2"),$(".button",".time-input-mod"));
});
