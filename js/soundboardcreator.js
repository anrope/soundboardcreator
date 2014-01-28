window.addEventListener('message', function (a, b, c) {
  console.log('window message listener', a, b, c)
})

window.setTimeout(function () {
  console.log(document.getElementsByTagName('iframe')[0].id)
}, 1000);

var playById = function(id, start, end) {
  var embed = document.getElementById(id).contentWindow;
  var embedDomain = 'http://cdn.embedly.com';
  
  // set up a listener so we can hear about events happening with the embed
  embed.postMessage(JSON.stringify({
    method: 'addEventListener',
    value: 'event'
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
    console.log('setTimeout pausing', (end - start) * 1000, id);
    embed.postMessage(JSON.stringify({
      method: 'pause'
    }), embedDomain);
  }, (end - start) * 1000);
}
