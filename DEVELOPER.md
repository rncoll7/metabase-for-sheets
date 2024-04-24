# Deploy as single sheets file (Development mode)


## step-by-step

### Config

1. Open a sheets file, go to "Extensions > Apps Script"
![local_appscript.png](images%2Flocal_appscript.png)


2. go to "Configs > Script ID" and copy it
![local_scriptId.png](images%2Flocal_scriptId.png)


3. Open de file [.clasp.json](.clasp.json) and replace the `scriptId`

### Install dependenciesnpm

 - With npm `npm install`
 - With yarn `yarn install`

### Authorize local script

- With npm `npm run authorize`
- With yarn `yarn run authorize`

### push code to sheets

- With npm `npm run push`
- With yarn `yarn run push`

### push code to sheets and sync local changes in real time

 - With npm `npm run watch`
 - With yarn `yarn run watch`