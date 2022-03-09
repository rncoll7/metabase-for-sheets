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

I'm currently working on:

- Interface response
- Schedule job

## Links:

- https://github.com/google/clasp
- https://github.com/google/clasp/blob/master/docs/run.md#prerequisites
- https://console.cloud.google.com/apis/credentials
- https://console.cloud.google.com/apis/credentials/consent
- https://docs.google.com/spreadsheets/d/104Cxi5PJh2pdK2osMIeMtBWnamJIpQt6oFVpD47BPiE
- https://script.google.com/home/projects/1qNrGXpMgntO2NTRdlTWeXvTEfRdOFA6MVgZqBqhw0a-xxhN5ui7zQw5c