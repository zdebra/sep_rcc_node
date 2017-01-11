# Run
## Environment variables
You need to have specified following environment variables:
- PASS_HASH=$2a$12$VT3Yt5SBMw.XjdBG3elfneMG12Y5QJkE3ORFy1uFd66NXXDE0gxum
- PORT=3000
- HOST=localhost
- MONGO_DB_URL=mongodb://localhost:27017/rcc
- WSDL_URL=http://localhost:8088?wsdl

If you set `NODE_ENV` to `production` then you have to set those variables manually. Otherwise application
requires them specified in `.env` file placed in root directory. See <https://www.npmjs.com/package/dotenv>.

## Mongodb
```sh
mongod --dbpath <path to data directory>
```

## Nodejs
You need to have nodejs `7.3.0`.

Run in root directory:
```sh
node -- harmony index.js
```

Harmony is used for tested feature of await/async ES7 specification.