let http = require('http')
const { sign } = require('crypto')
let crypto = require('crypto')
let SECRET = '123456' // github上设置的webhook密码
function sign(body) {
  return `sha1=`+ crypto.createHmac('sha1',SECRET).update(body).digest('hex')
}
let server = http.createServer(function (req, res) {
  if (req.method == 'POST' && req.url == '/webhook') {
    let buffers = []
    res.on('data', function (buffer) {
      buffers.push(buffer)
    })
    res.on('end', function (buffer) {
      let body = Buffer.concat(buffers)
      let event = req.headers['x-gitHub-event']
      // github请求传递的签名
      let signature = req.headers['x-hub-signature']
      if (signature !== sign(body)) {
        res.end('Not Allowed')
      }
    })
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: true }))
  } else {
    res.end('Not Found')
  }
})
server.listen(4000, () => {
  console.log('webhooks服务已在4000端口上启动了=====');
})