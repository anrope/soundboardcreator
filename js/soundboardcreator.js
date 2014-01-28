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
});
