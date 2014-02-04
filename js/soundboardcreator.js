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

///////////////////////
//Setup Board from hash
///////////////////////

var setupSlot = function(data) {
    if (data.html) {
      this.html(data.html);
      this.attr("data-html", data.html);
      this.attr("data-title", data.title);
      this.attr("data-description", data.description);
    }
    return false;
}

var setupBoard = function() {
  var hash = window.location.hash;
  var slot_hash = "";
  if (hash) {
    hash = hash.substring(1, hash.length);
    hash = atob(hash);
    items = hash.split(",");
    for (var i=0;i<items.length;i++) {
      slot_hash = items[i];
      console.log("setting up slot:" + slot_hash);
      var slot_vals = slot_hash.split(";");
      var slot = slot_vals[0];
      var url = decodeURIComponent(slot_vals[1]);
      var start = slot_vals[2].split(":")[0];
      var end = slot_vals[2].split(":")[1];
      window.current_slot = slot;
      $("." + slot).attr("data-url", url);
      callEmbedly(url, setupSlot.bind($("." + slot)));
      setTimeSlot(start, end);
    }
  }
}

/////////////////
//Slot Creation
/////////////////
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

var setTimeSlot = function(start, end) {
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
}

// Adds start, end time from user
var addTime = function($input1, $input2, $button){

    $button.on('click', function(){
      var start = $input1.val();
      var end = $input2.val();
      $input1.val("");
      $input2.val("");

      //load data into slot div
      setTimeSlot(start, end);
      $(".time-input-mod").hide();

      return false;
    });
}

var saveBoard = function () {
  var board_list = [];
  for (var i=1;i<11;i++) {
    if ($('.slot' + i)[0].hasAttribute("data-url")) {
      var time = $('.slot' + i).attr("data-start") 
            + ":" + $('.slot' + i).attr("data-end");
      var url = encodeURIComponent($('.slot' + i).attr("data-url")) + "";
      console.log("saving url and time:" + time + "," + url);
      board_list.push("slot" + i + ";" + url + ";" + time);
    }
  }
  console.log("plaintext hash:" + board_list.join(","));
  hash = btoa(board_list.join(","));
  var board_link = window.location.href.split("#")[0] + "#" + hash;
  $(".link").html('<a target="_blank" href="' + board_link + '">Saved Board</>');
  console.log("creating board link:" + board_link);
}

$(document).ready(function () {
  setupButtonListeners();

  $('.huge-slot').each(function () {
    $(this).hide()
  });
  
  window.addEventListener('message', function (a, b, c) {
    console.log('window message listener', a, b, c)
  })

    //setup forms
    var current_slot;
    var players;
    addURL($("#url-input"),$(".button",".url-input-mod"));
    addTime($("#time-input-1"),$("#time-input-2"),$(".button",".time-input-mod"));
    $(".save-mod button").on('click', saveBoard);
    setupBoard();
});
