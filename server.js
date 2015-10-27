var app = require('./express-instance'),
    http = require('http')

http.createServer(app).listen(app.get('port'), () => {
    console.log(`Express server listening on port ${app.get('port')}`)
}).on('error', e => {
    console.error(e)
})

process.title = 'nodejs - http listener'