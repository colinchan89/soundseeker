var express = require('express'),
		soundcloud = express.Router(),
		SC = require('node-soundcloud'),
		eventful = require('eventful-node'),
    client = new eventful.Client('tX9rVSJRM96LsCtP'),
		request = require('request')
// Initialize client
SC.init({
	id: '7ce0c4a7238f05f3fada1cdcff5b489c',
  secret: 'a2039f8373bab2514ae7e6f796e95033',
  uri: 'http://localhost:3000/',
	accessToken: 'https://api.soundcloud.com/oauth2/token'
})

soundcloud.get('/events/:zip', function(req,res){
	client.searchEvents({ keywords: 'concerts', location: req.params.zip, within: 10, date: 'This Week', sort_order: 'popularity'}, function(err, data){
		if(err) throw err
		// console.log('Received ' + data.search.total_items + ' events')
		var events = data.search.events.event
		// events.forEach(function(evt){
		// 	var artists = evt.performers.performer
		// 	console.log(artists)
		// 	if(artists.length > 1){
		// 		artists.forEach(function(a){
		// 			console.log(a.name)
		// 		})
		// 	}
		// 	console.log(evt.performers.performer.name)
		// })
		res.json(events)
	})
})


soundcloud.get('/events/single/:id', function(req,res){
// sample get for event:
// 'http://api.eventful.com/json/events/get?id='req.params.id'&app_key=tX9rVSJRM96LsCtP'
	request('http://api.eventful.com/json/events/get?id=' + req.params.id + '&app_key=tX9rVSJRM96LsCtP', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var performers = []
			// var artists = JSON.parse(body).performers.performer
			res.json(JSON.parse(body)) // Parse JSON Object returned from eventful
			if(JSON.parse(body).performers){
				if(JSON.parse(body).performers.performer.length > 1){
					JSON.parse(body).performers.performer.forEach(function(a){
						performers.push(a.name)
					})
				}
				else {
					performers.push(JSON.parse(body).performers.performer.name)
				}
			}
			console.log(performers)
			// SC.get('/tracks', {tags: performers}, function(err, track) {
			// 	if (err) throw err
			// 	else console.log('success')
			// 	console.log(track[0].id)
			// 	res.json(track)
			// 	track.forEach(function(n){
			// 		console.log(n.permalink_url)
			// 	})
			// })
		}
	})
})


module.exports = soundcloud
