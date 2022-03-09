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

    getQuery(id) {
        const queries = this.getQueries();
        return (function () {
            for (var i = 0; i < queries.length; i++) {
                if (queries[i].id == id) {
                    return queries[i];
                }
            }
        })()
    }

    setQuery(query) {
        const id = query.id;
        const queries = this.getQueries();
        const index = (function () {
            for (var i = 0; i < queries.length; i++) {
                if (queries[i].id == id) {
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
}

let properties = new Properties();