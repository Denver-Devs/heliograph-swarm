var swarm = require('webrtc-swarm')
var signalhub = require('signalhub')
var Rx = require('rx')

/**
 * ```js
 * var swarm = createSwarm('heliograph', [helio.site.org])
 *
 * // Send data to swarm
 * swarm.onNext({
 *   type: 'CONNECT_OFFER',
 *   body: {lat: '', long: ''} 
 * })
 *
 * // Read data from swarm
 * swarm
 *   .subscribe(function (message) {
 *     if (message.type === 'CONNECT_ANSWER') {
 *       console.log(message.body) // {lat: '', long: ''}
 *     }
 *     if (message.type === 'NEW_PEER') {
 *       console.log(message.body) // {peer: '', id: ''}
 *     }
 *   })
 * ```
 *
 * @summary String -> Array String -> Observable Swarm
 */
module.exports = function createSwarm (name, hubs) {
  var observable = Rx.Observable.create(function (obs) {
    var sw = swarm(signalhub(name, hubs))

    sw.on('peer', function (peer, id) {
      obs.onNext({
        type: 'NEW_PEER',
        body: {peer: peer, id: id}
      })
    })

    sw.on('HELIOGRAPH', function (message) {
      obs.onNext({
        type: 'NEW_PEER',
        body: {peer: peer, id: id}
      })
    })

  })

  var observer = Rx.Observer.create(
    function onNext (message) {
      sw.emit('HELIOGRAPH', message)
    },
    function onError () {},
    function onCompleted () {}
  )

  return Rx.Subject.create(observer, observable)
}
