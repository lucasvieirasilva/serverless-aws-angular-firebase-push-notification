# Serverless Framework + Angular + Firebase

## Prerequirement

Install serverless cli.

```shellscript
npm i -g serverless
```

## Deploy Backend

### Install dependencies

Navigate to Folder

```shellscript
cd api
```

Install dependencies

```shellscript
npm i
```

### Deploy

Change variables `firebase_api_key`, `facebook_app_id`, `google_app_id` in file `config.yml` to your app information.

Deploy backend environment

```shellscript
serverless deploy
```

## Deploy Front-end

### Install dependencies

Navigate to Folder

```shellscript
cd client
```

Install dependencies

```shellscript
npm i
```

Change variables `messagingSenderId` in files `src/firebase-messaging-sw/js`, `src/manifest.json`, `src/environments/environment.prod.ts`, `src/environments/environment.ts` to your firebase cloud messaging senderId.

Deploy to S3 + CloudFront

```shellscript
npm run build-deploy
```