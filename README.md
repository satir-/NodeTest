# Node Persistent Storage
Express + Node.js - implementation of the test API for two pieces of functionality:
* In-memory stack (LIFO);
* In-memory key-value store with TTL.

Both features will allow persistent access to a data for a specified period of time (TTL).

### Preconditions:
Installed node.js and npm.

### Install:
```bash
$ npm install
```

### Usage:
General
```bash
$ npm start
```

Development mode with enabled logging
```bash
$ npm run dev-start
```
### API:
#### Stack
Default time for stack to persist - __24h__

* Add item to stack
```bash
$ POST {BODY} /stack/push
```
Where __{BODY}__ - `application/JSON` type. 
* Get item from stack
```bash
$ GET /stack/pop
```
* Get stack length
```bash
$ GET /stack/
```
#### TTL Store
* Get from key-value store
```bash
$ GET /ttl-store/:key
```
* Add to key-value store
```bash
$ POST {BODY} /ttl-store
```
Where __{BODY}__ - `application/JSON` type object with following properties:
```js
  {
    key,   // key to reach the data
    value, // data to store
    ttl    // (optional) time for a data to persist in ms 
  }
```
* Delete from key-value store
```bash
$ DELETE /ttl-store/:key
```

### Test:
```bash
$ npm test
```
