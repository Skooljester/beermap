var io= require('socket.io')();
var request= require('request');
var db= require('./db/dbmain');
var Q= require("q");
var socket;
function getSocket() {//maybe use a promise library here instead?
  return socket;
}
function setSocket(sock) {
  if (undefined== socket)
    return socket= sock;
}
var gdmdef; //Don't know how this will work with multiple users connected, we shall see
function getDistMat(route, str) {
  gdmdef= Q.defer();
  request({url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+str+'&destinations='+str+'&mode=driving&key=AIzaSyC-Efjagm9D1r_v4Izz6-vYbb3NmmGIvDw', json: true},
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        gdmdef.promise.then(function (obj) {
          obj.emit('distmat', {gmres: body, rarr: route});//This one shouldn't break
        });
      }
  });
}
var prdef;
function paneRender(res, names) {
  prdef= Q.defer();
  function doit(name, num) {
    db.find(db.Brewery, {name: name}, function(dbres) {
      res.render('_tourPane', {
        val: dbres[0],
        index: num
      }, function (err, html) {
        if(err) return console.log(err);
        prdef.promise.then(function (obj) {//I actually don't understand how this works...
          obj.emit('paneRender', {pane: html, brewery: name});//not sure if this has potential to break if promise resolves before done looping
        });
      });
    });
  }
  for(var j= 1; j< names.length; j++) {
    doit(names[j], j);
  }
}
io.on('connection', function (sock) {
  console.log("connected");
  setSocket(sock);
  if(gdmdef)
    gdmdef.resolve(sock);
  if(prdef)
    prdef.resolve(sock);
});

module.exports= io;
module.exports.getSocket= getSocket;
module.exports.setSocket= setSocket;
module.exports.getDistMat= getDistMat;
module.exports.paneRender= paneRender;