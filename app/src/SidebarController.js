function openErrorDialog(e){
    let html = '';
    if (e.name == 'MetabaseError'){
        html += `<p><code>${e.status} - ${e.payload}</code></p>`;
    }
    if (e.stack != undefined && e.stack != undefined){
        html += `<p><code style="white-space: pre-wrap;">${e.stack}/<code></p>`;
    }
    
    const ui = SpreadsheetApp.getUi();
    const htmlOutput = HtmlService.createHtmlOutput(html);
    ui.showModalDialog(htmlOutput, e.message);
}

function processConfigForm(object) {
    try {
        if (!object.base_url) {
            return "!base_url"
        }
        if (!object.username) {
            return "!username"
        }
        if (!object.password) {
            return "!password"
        }
    
        properties.setBaseUrl(object.base_url);
        properties.setUsername(object.username);
        properties.setPassword(object.password);
        return true;
    } catch (e) {
        openErrorDialog(e);
        return false;
    }
}

function feachConfigForm() {
    try { 
        return {
            "base_url": properties.getBaseUrl(),
            "username": properties.getUsername()
        }
    } catch (e) {
        openErrorDialog(e);
        return false;
    }
}

function processEditForm(object) {
    try {
        if (!object.query_id) {
            return "!query_id"
        }
        if (!object.name) {
            return "!name"
        }
        if (!object.sheet) {
            return "!sheet"
        }
    
        query = {
            "uuid": object.uuid || Utilities.getUuid(),
            "id": object.query_id,
            "name": object.name,
            "sheet": object.sheet,
            "range": object.range,
            "parameters": []
        }
    
        const parameters = JSON.parse(object.parameters || '[]');
        for (let i = 0; i < parameters.length; i++) {
            let parameter = parameters[i];
            parameter.value = object[parameter.slug];
            query.parameters.push(parameter);
        }
    
        properties.setQuery(query);
        return true;
    } catch (e) {
        openErrorDialog(e);
        return false;
    }
}

function feachEditForm(uuid) {
    try {
        return properties.getQuery(uuid);   
    } catch (e) {
        openErrorDialog(e);
        return false;
    }
}

function deleteQuery(uuid) {
    try {
        const ui = SpreadsheetApp.getUi();
        var result = ui.alert(`Confirmar deleção?`, ui.ButtonSet.YES_NO);

        if (result == ui.Button.YES) {
            return properties.deleteQuery(uuid);
        } else {
            return false;
        } 
    } catch (e) {
        openErrorDialog(e);
        return false;
    }
}

function feachQueries() {
    try {
        return properties.getQueries();   
    } catch (e) {
        openErrorDialog(e);
        return false;
    }
}

function feachQueryDetails(id) {
    try {
        return Core.getQuestionDetailsSimplified(id);        
    } catch (e) {
        openErrorDialog(e);
        return false;
    }
}

function clean() {
    try {
        properties.setQueries([]);        
    } catch (e) {
        openErrorDialog(e);
        return false;
    }
}

function executeQuery(uuid) {
    try {
        let query = properties.getQuery(uuid);
        return Core.getQuestionAndFillSheet(query);        
    } catch (e) {
        openErrorDialog(e);
        return false;
    }
}