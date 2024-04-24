# Metabase for Sheets

Based on [bplmp/metabase-google-sheets-add-on](https://github.com/bplmp/metabase-google-sheets-add-on).

This Google Sheets add-on imports the result of a Metabase question to a Google Sheet by using the Metabase API.

## Preview

![Preview](images/preview.gif)

## Metabase API Access

Currently, the add-on authenticates with Metabase by using a user account. You can use your own user account or create a
dedicated one for the add-on. It sends the username and password
and [gets a token](https://github.com/metabase/metabase/wiki/Using-the-REST-API#authorizing) in response that it uses to
make requests. If the token is expired (after a certain period of time it will expire) then the script requests a new
token.

## I'm currently working on:

- Interface response
- Schedule job (implemented, but script run only for 6 minutes)

## How to use

You can use this as a sheets addon or as a script in a single sheets file.

- [DEVELOPER MODE](DEVELOPER.md)
- [PRODUCTION MODE](PRODUCTION.md)

## Links:

- https://github.com/google/clasp
- https://github.com/google/clasp/blob/master/docs/run.md#prerequisites
- https://console.cloud.google.com/apis/credentials
- https://console.cloud.google.com/apis/credentials/consent
- https://developers.google.com/apps-script/add-ons/how-tos/publish-add-on-overview
- https://developers.google.com/workspace/marketplace/how-to-publish
