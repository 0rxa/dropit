const http = require('http')
const fs = require('fs')

const file = fs.readFileSync('./daft-punk-get-lucky.jpg');
const data = JSON.stringify({
    author: 'test',
    name: "testpost",
    media: file.toString('base64')
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/post',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}

const req = http.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', (d) => {
    process.stdout.write(d)
  })
})

req.on('error', (error) => {
  console.error(error)
})

req.write(data)
req.end()
