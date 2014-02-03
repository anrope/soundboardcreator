var setupButtonListeners = function () {
  $('.slot button').each(function (index) {
    this.addEventListener('click', function () {
      setCurrentSlot(this.parentNode)
    });
  });
}

var setCurrentSlot = function(slot) {
  console.log("current slot:" + slot.id)
  window.current_slot = slot.id;
  var data_slot = $('.' + slot.id)[0];
  if (data_slot.hasAttribute('data-url')) {
    return false; 
  } else {
      $(".url-input-mod").show();
  }
  return false;
}

var moveToHugeSlot = function (slot) {
  console.log('move to huge slot', slot.id);
  $('.huge-slot').each(function () {
    $(this).hide()
  });
  $('.' + slot.id).show();  
}

var playSlot = function(slot, start, end) {
  //manage slot players
  if (!window.players) {
  window.players = {}; }

  // set the duration and start playing
  if (!$("." + slot)[0].hasAttribute('data-iframe')) {
    //set slot player
    window.players[slot] = new playerjs.Player($('.' + slot + ' iframe')[0]);
    $("." + slot).attr("data-iframe", true);

    window.players[slot].on('ready', function(){
      console.log("ready to play:" + slot + ":start,end:" + start + "," + end)
      window.players[slot].setCurrentTime(parseFloat(start));
      window.players[slot].on('play', function(){
        // stop the embed once we hit our end time
        window.setTimeout(function () {
          console.log('setTimeout pausing', (end - start) * 1000, slot);
          window.players[slot].pause();
          $('.' + slot).hide();
        }, (end - start) * 1000);
      }, this);

      window.players[slot].play();
  });
  }
  else {
    window.players[slot].setCurrentTime(parseFloat(start));
    window.players[slot].play();
  }
}

$(document).ready(function () {
  setupButtonListeners();

  $('.huge-slot').each(function () {
    $(this).hide()
  });
  
  window.addEventListener('message', function (a, b, c) {
    console.log('window message listener', a, b, c)
  })


  /////////////////
  //Slot Creation
  ///////////////
    var callEmbedly = function (url, cb) {
      var call = "http://api.embed.ly/1/oembed?width=400&scheme=http&url=";
      $.getJSON(call + encodeURIComponent(url) + "&callback=?", cb);
    }

    var createSlot = function (data) {
      if (data.html) {
        //slot1 should be removed for something generic
        $("." + window.current_slot).html(data.html);
        $("." + window.current_slot).attr("data-html", data.html);
        $("." + window.current_slot).attr("data-title", data.title);
        $("." + window.current_slot).attr("data-description", data.description);
        $(".url-input-mod").hide();
        $(".time-input-mod").show();
      } else { 
        $("." + window.current_slot).html("<button>Try Again?</button>");
      }
    }

    // adds URL data from Embedly
    var addURL =  function($input, $button){
      if($input.length !=0){
        $input.on('focus', function(){
          $(this).val("");
          $(this).attr("enabled", true);
        })

        $button.on('click', function(){
          var url = $input.val();
          $input.val("");
          //do something with data
          console.log("current slot: " + window.current_slot)
          $("." + window.current_slot).attr("data-url", url);
          data = callEmbedly(url, createSlot);
          
          return false;
        });
      }
    }

    // Adds start, end time from user
    var addTime = function($input1, $input2, $button){

        $button.on('click', function(){
          var start = $input1.val();
          var end = $input2.val();
          $input1.val("");
          $input2.val("");

          //load data into slot div
          $("." + window.current_slot).attr("data-start", start);
          $("." + window.current_slot).attr("data-end", end);

          //onclick
          $("#" + window.current_slot + " button").on('click', function(){
            moveToHugeSlot(this.parentNode);
            playSlot(window.current_slot, start, end);
          });
          $("#" + window.current_slot + " button").text(  "Play"); 
          
          $(".time-input-mod").hide();

          return false;
        });
    }

    //setup forms
    var current_slot;
    var players;
    addURL($("#url-input"),$(".button",".url-input-mod"));
    addTime($("#time-input-1"),$("#time-input-2"),$(".button",".time-input-mod"));
    $(".save-mod button").on('click', saveBoard);
});
