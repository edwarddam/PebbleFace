//Author: Ed Dam

var myAPIKey = '42efb17b4ad3d4a52025106d13376d96';

Pebble.on('message', function(event) {
  var message = event.data;
  if (message.fetch) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      //var url = 'http://api.openweathermap.org/data/2.5/weather?q=Woking,uk' +
      var url = 'http://api.openweathermap.org/data/2.5/weather' +
        '?lat=' + pos.coords.latitude +
        '&lon=' + pos.coords.longitude +
        '&appid=' + myAPIKey;
      request(url, 'GET', function(respText) {
        var locationData = JSON.parse(respText);
        Pebble.postMessage({
          'location': {
            'name': locationData.name
          }
        });
      });
    }, function(err) {
      console.error('Error getting location');
    },
    { timeout: 15000, maximumAge: 60000 });
  }
});

function request(url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function (e) {
    // HTTP 4xx-5xx are errors:
    if (xhr.status >= 400 && xhr.status < 600) {
      console.error('Request failed with HTTP status ' + xhr.status + ', body: ' + this.responseText);
      return;
    }
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
}