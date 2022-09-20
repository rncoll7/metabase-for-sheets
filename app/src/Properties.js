/* 
 * References 
 * - https://developers.google.com/apps-script/guides/properties 
 * - https://developers.google.com/apps-script/reference/properties/properties
 */

class Properties {

    constructor() {
        this.script = PropertiesService.getScriptProperties();
        this.user = PropertiesService.getUserProperties();
        this.document = PropertiesService.getDocumentProperties();
        this.local = this.document.getProperty('local_config') || false;
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
        const queries = this.document.getProperty('QUERIES');
        if (queries != null && queries != undefined) {
            return JSON.parse(queries);
        } else {
            return [];
        }
    }

    setQueries(queries) {
        this.document.setProperty('QUERIES', JSON.stringify(queries));
    }

    getQuery(uuid) {
        const queries = this.getQueries();
        return (function () {
            for (var i = 0; i < queries.length; i++) {
                if (queries[i].uuid == uuid) {
                    return queries[i];
                }
            }
        })()
    }

    deleteQuery(uuid) {
        const queries = this.getQueries();
        const index = (function () {
            for (var i = 0; i < queries.length; i++) {
                if (queries[i].uuid == uuid) {
                    return i;
                }
            }
        })()
        if (index > -1) {
            queries.splice(index, 1);
            this.setQueries(queries);
            return true;
        }
        return false;
    }

    setQuery(query) {
        const uuid = query.uuid;
        const queries = this.getQueries();
        const index = (function () {
            for (var i = 0; i < queries.length; i++) {
                if (queries[i].uuid == uuid) {
                    return i;
                }
            }
        })();
        if (index != null && index != undefined) {
            queries[index] = query;
        } else {
            queries.push(query);
        }
        this.setQueries(queries);
    }

    nedAuth() {
        return !(this.hasBaseUrl() && this.hasUsername() && this.hasPassword());
    }

    updateStorage(){
        let version = this.document.getProperty('storage-version') || 0;
        
        if (version == 0) {
            let queries = this.getQueries();
            for (var i = 0; i < queries.length; i++) {
                queries[i].uuid = Utilities.getUuid();
            }
            this.setQueries(queries);
            version = 1;
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