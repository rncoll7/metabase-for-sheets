/* 
 * References 
 * - https://developers.google.com/apps-script/guides/properties 
 * - https://developers.google.com/apps-script/reference/properties/properties
 */

class Properties {

    constructor() {
        try {
            this.script = PropertiesService.getScriptProperties();
            this.document = PropertiesService.getDocumentProperties();
            this.local = this.document.getProperty('local_config') || true;
            try {
                this.user = PropertiesService.getUserProperties();
            } catch (ignore) {
                this.user = null
                this.local = true
            }
        } catch (error){
            console.error({
                success: false,
                function: 'Properties.constructor',
                error: {message: error.message, stack: error.stack},
            });
        }
    }

    getProperty(name) {
        if (this.local) {
            return this.document.getProperty(name);
        } else {
            return this.user.getProperty(name);
        }
    }

    setProperty(name, value) {
        if (this.local) {
            return this.document.setProperty(name, value);
        } else {
            return this.user.setProperty(name, value);
        }
    }

    hasProperty(name) {
        const value = this.getProperty(name);
        return (value != null && value != undefined && value != '');
    }

    useLocalConfig() {
        this.document.setProperty('local_config', true);
        this.local = true;
    }

    useUserConfig() {
        this.document.setProperty('local_config', false);
        this.local = false;
    }


    // BASE_URL
    getBaseUrl() {
        return this.getProperty('BASE_URL');
    }

    setBaseUrl(value) {
        this.setProperty('BASE_URL', value);
    }

    hasBaseUrl() {
        return this.hasProperty('BASE_URL');
    }

    // USERNAME
    getUsername() {
        return this.getProperty('USERNAME');
    }

    setUsername(value) {
        this.setProperty('USERNAME', value);
    }

    hasUsername() {
        return this.hasProperty('USERNAME');
    }

    // PASSWORD
    getPassword() {
        return this.getProperty('PASSWORD');
    }

    setPassword(value) {
        this.setProperty('PASSWORD', value);
    }

    hasPassword() {
        return this.hasProperty('PASSWORD');
    }

    // TOKEN
    getToken() {
        return this.getProperty('TOKEN');
    }

    setToken(value) {
        this.setProperty('TOKEN', value);
    }

    hasToken() {
        return this.hasProperty('TOKEN');
    }

    // QUERY
    getQueries() {
        let queries = [];
        for (const [key, query] of Object.entries(this.script.getProperties())) {
            if (key.indexOf(`QUERY_${SpreadsheetApp.getActive().getId()}_`) > -1) {
                queries.push(JSON.parse(query));
            }
        }
        return queries;
    }

    getQuery(uuid, spreadsheetId = SpreadsheetApp.getActive().getId()) {
        return JSON.parse(this.script.getProperty(`QUERY_${spreadsheetId}_${uuid}`));
    }

    deleteQuery(uuid, spreadsheetId = SpreadsheetApp.getActive().getId()) {
        this.script.deleteProperty(`QUERY_${spreadsheetId}_${uuid}`);
        console.info('deleteQuery', `QUERY_${spreadsheetId}_${uuid}`);
    }

    setQuery(query, spreadsheetId = SpreadsheetApp.getActive().getId()) {
        this.script.setProperty(`QUERY_${spreadsheetId}_${query.uuid}`, JSON.stringify(query));
        console.info(`QUERY_${spreadsheetId}_${query.uuid}`, JSON.stringify(query));
    }


    // Triggers
    getTriggers() {

        let triggers = [];
        for (const [key, value] of Object.entries(this.script.getProperties())) {
            if (key.indexOf('TRIGGER_') > -1) {
                triggers.push(JSON.parse(value));
            }
        }
        return triggers;
    }

    getTrigger(uuid) {
        return this.script.getProperty(`TRIGGER_${uuid}`);
    }

    deleteTrigger(uuid) {
        this.script.deleteProperty(`TRIGGER_${uuid}`);
        console.info('deleteTrigger', `TRIGGER_${uuid}`);
    }

    setTrigger(trigger) {
        this.script.setProperty(`TRIGGER_${trigger.uuid}`, JSON.stringify(trigger));
        console.info('setTrigger', `TRIGGER_${trigger.uuid}`, JSON.stringify(trigger));
    }

    nedAuth() {
        return !(this.hasBaseUrl() && this.hasUsername() && this.hasPassword());
    }

    updateStorage(){
        let version = parseInt(this.document.getProperty('storage-version') || 0);
        
        if (version === 0 || version === 1) {
            let queries
            const queries_text = this.document.getProperty('QUERIES');
            if (queries_text != null) {
                queries = JSON.parse(queries_text);
            } else {
                queries =  [];
            }
            for (let i = 0; i < queries.length; i++) {
                if (queries[i].uuid == null){
                    queries[i].uuid = Utilities.getUuid();
                }
            }

            for (const query of queries) {
                this.setQuery(query);
            }
            version = 2;
        }
    }

}

let properties = new Properties();


function deleteTest() {
    const queries = properties.getQueries();
    const uuid = '7795d6c4-ce96-4009-9879-015452902197'
    const ok = properties.deleteQuery(uuid);
    return ok;
}
