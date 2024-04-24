function openErrorDialog(e){
    let html = '';
    let style = 'width: 98%;resize: none;overflow: hidden;border: 0px;background: #ddd;border-radius: 5px;'
    if (e.name === 'MetabaseError'){
        html += `<code>HTTP Status Code: ${e.status}</code><br/><code>Origin IP: ${ipify()}</code><br/>`;
    }
    if (e.payload != null){
        html += `<code>Payload:</code><textarea style="min-height: 62px;${style}" readonly>${e.payload}</textarea>`;
    }
    if (e.stack != null){
        html += `<code>Trace:</code><textarea style="min-height: 117px;${style}" readonly>${e.stack}</textarea>`;
    }
    html += `</p>`;

    try {
        const ui = SpreadsheetApp.getUi();
        const htmlOutput = HtmlService.createHtmlOutput(html);
        ui.showModalDialog(htmlOutput, e.message);
    } catch (error){
        console.error({
            success: false,
            function: 'openErrorDialog',
            inputs: {message: e.message, stack: e.stack},
            error: {message: error.message, stack: error.stack},
        });
    }
}

function ipify(){
    try{
        var response = UrlFetchApp.fetch("https://api.ipify.org");
        if (response.getResponseCode() !== 200){
            return "";
        }
        return response.getContentText()
    } catch(e){
        return "";
    }
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
            "hour": object.hour,
            "active": object.active === 'true',
            "parameters": []
        }
        console.log('active', object.active, query.active);
    
        const parameters = JSON.parse(object.parameters || '[]');
        for (let i = 0; i < parameters.length; i++) {
            let parameter = parameters[i];
            parameter.value = object[parameter.slug];
            query.parameters.push(parameter);
        }
    
        properties.setQuery(query);
        if (query.active) {
            properties.setTrigger({uuid: query.uuid, hour: query.hour,
                                   spreadsheetId: SpreadsheetApp.getActiveSpreadsheet().getId()});
        } else {
            properties.deleteTrigger(query.uuid);
        }
        return query;
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

        if (result === ui.Button.YES) {
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

function executeQuery(uuid) {
    try {
        let query = properties.getQuery(uuid);
        return Core.getQuestionAndFillSheet(query);        
    } catch (e) {
        openErrorDialog(e);
        return false;
    }
}