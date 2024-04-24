# Deploy as single sheets file (Development mode)


## step-by-step

### Config (pre-script)

1. Create Script on (https://script.google.com/u/2/home)

2. go to "Configs > Script ID" and copy it
   ![local_scriptId.png](images%2Flocal_scriptId.png)

3. Open de file [.clasp.prod.json](.clasp.prod.json) and replace the `scriptId`

### Install dependenciesnpm

 - With npm `npm install`
 - With yarn `yarn install`

### Authorize local script

- With npm `npm run authorize.prod`
- With yarn `yarn run authorize.prod`

### push code to script

- With npm `npm run push.prod`
- With yarn `yarn run push.prod`

### Config (post-script)

1. Create google cloud project
2. Authorize apis & Create APP
   > https://console.cloud.google.com/apis/api/appsmarket-component.googleapis.com/credentials

### Deploy

1. Deploy script

   ![prod_deployscript1.png](images%2Fprod_deployscript1.png)
2. 
   ![prod_deployscript2.png](images%2Fprod_deployscript2.png)

2. Update app do release the script deployed

### Access on sheets

1. Get app on marketplace

## Links:
- https://developers.google.com/apps-script/add-ons/how-tos/publish-add-on-overview
- https://developers.google.com/workspace/marketplace/how-to-publish