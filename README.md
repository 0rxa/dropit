# dropit

## Deployment

#### Locally
```sh
sudo docker-compose up -d
```

## Routes

#### On /

POST /register

```js
{
	"name": String,
	"password": String,
	"email": String
}
```

**returns:** profile id of new user

---

POST /login

```js
{
	"name": String,
	"password": String
}
```

**returns:** bearer token

---

#### On /post

GET /:profileId

**returns:** JSON object with posts on profile with :profileId

---

POST /:profileId

```js
{
	"author": String,
	"description": String,
	"content": String,

}
```

**returns:** object if of new post

---

POST /comment/:profileId/:postId

```js
{
	"content": String
}
```

**returns:** object id of new comment

---

GET /comment/:profileId/:postId

**returns:** comments in specified post

---

#### On /profile

GET /

**returns:** JSON object with profiles of authenticated user

---

POST /create

```js
{
	"name": String
}
```

**returns:** object id of new profile

---

POST /add\_member/:profileId

```js
{
	"name": String // Name of user to add as member
}
```
