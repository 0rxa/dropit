# dropit

Ne docker-compose ka vetem databazen sa per testing se do bej gje tjeter per deployment.
```
sudo docker-compose up -d
cd web/backend/
npm run serve
```

### Paths

```
Postimet e 24h te fundit, flasim ne unix time me milisekonda
GET /posts?timeframe=86400000

Postimi me kte id
GET /posts/id

Per te postuar
POST /post
{
	"name": String,
	"description": String (optional),
	"media": String (bytearray encoded in base64)
}
Kthen ID e postit

Per te komentuar
POST /comment
{
	"postId": String,
	"content": String
}

Per te listuar komentet ne nje post
GET /comment/postId

Per te log in
POST /login
{
	"username": String,
	"password": String
}

Per tu regjistruar
POST /register
{
	"username": String,
	"password": String,
	"email": String
}

```
