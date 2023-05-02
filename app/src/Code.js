function onInstall() {
    onOpen();
}

function onOpen() {

    let ui = SpreadsheetApp.getUi();
    if (ui !== undefined) {
        let menu = ui.createMenu("Metabase");
        try {
            properties.updateStorage();
            menu.addItem("Abrir..", "openSideBar")
            menu.addSeparator()
            menu.addItem("Importar Consulta", "importQuestion")
            menu.addItem("Importar todas as Consultas na Planilha", "importAllQuestions")
        } catch (e) {
            openErrorDialog(e);
            menu.addItem("Habilitar para este documento", "onOpen")
        }
        menu.addToUi();
    }
}

function openSideBar() {
    var html = HtmlService.createTemplateFromFile("view/sidebar").evaluate();
    SpreadsheetApp.getUi().showSidebar(html);
}

function runTriggers(){
    const currentHour = new Date().getHours() + (new Date().getTimezoneOffset()/60-3);
    properties.getTriggers().forEach(trigger => {
        console.log(currentHour, trigger.hour, trigger.uuid, trigger.spreadsheetId);
        if(currentHour === parseInt(trigger.hour)){
            const _trigger = ScriptApp.newTrigger("runTrigger").timeBased()
                .after(5 * 1000)
                .create();
            PropertiesService.getScriptProperties().setProperty(_trigger.getUniqueId(), JSON.stringify(trigger));
        }
    });
}
function runTrigger(event){
    const trigger = JSON.parse(PropertiesService.getScriptProperties().getProperty(event.triggerUid));
    console.log(trigger.uuid, '!');
    let query = properties.getQuery(trigger.uuid, trigger.spreadsheetId);
    console.log(trigger.uuid, 'getQuery', query);
    Core.getQuestionAndFillSheet(query, trigger.spreadsheetId);
    console.log(trigger.uuid, 'end');


    if (!ScriptApp.getProjectTriggers().some(function (trigger) {
        if (trigger.getUniqueId() === event.triggerUid) {
            ScriptApp.deleteTrigger(trigger);
        }
    })) {
        console.error("Could not find trigger with id '%s'", event.triggerUid);
    }
    PropertiesService.getScriptProperties().deleteProperty(event.triggerUid);
}

class Core {
    static getSheetNumbers() {
        var sheets = SpreadsheetApp.getActive().getSheets();
        var questionNumbers = [];
        for (var i in sheets) {
            var sheetName = sheets[i].getName();
            var questionMatch = sheetName.match("(metabase/([0-9]+))");
            if (questionMatch !== null) {
                var questionNumber = questionMatch[2];
                if (!isNaN(questionNumber) && questionNumber !== "") {
                    questionNumbers.push({
                        questionNumber: questionNumber,
                        sheetName: sheetName,
                    });
                }
            }
        }
        return questionNumbers;
    }

    static getToken() {
        const baseUrl = properties.getBaseUrl();
        const username = properties.getUsername();
        const password = properties.getPassword();

        if (!baseUrl || !username || !password) {
            throw new Error("Por favor verificar configurações!");
        }

        const token = Metabase.getToken(baseUrl, username, password);
        properties.setToken(token);
        return token;
    }

    static getQuestionAndFillSheet(query, spreadsheetId = SpreadsheetApp.getActive().getId()) {
        var values = this.getQuestion(query);
        this.fillSheet(values, query, spreadsheetId);
    }

    static getQuestionAndFillSheetLegacy(query, spreadsheetId = SpreadsheetApp.getActive().getId()) {
        var values = this.getQuestion(query, "csv");
        this.fillSheetFromCsv(values, query, spreadsheetId);
    }

    static getQuestion(query, output = "json") {
        const baseUrl = properties.getBaseUrl();
        let token = properties.getToken();
        const parameters = this.createParameters(query.parameters);

        let attempt = 0;
        while (++attempt <= 2) {
            try {
                if (token == undefined || token == null) token = this.getToken();
                if (output == "csv") {
                    return Metabase.getQuestionAsCsv(baseUrl, token, query.id, parameters);
                } else {
                    return Metabase.getQuestion(baseUrl, token, query.id, parameters);
                }
            } catch (e) {
                if (e.name == "UnauthorizedError") {
                    token = null;
                } else {
                    throw e;
                }
            }
        }
    }

    static createParameters(parameters) {
        let newParameters = [];
        for (let i = 0; i < parameters.length; i++) {
            const value = parameters[i]["value"];
            if (value != undefined && value != null && value != '') {
                const type = parameters[i]["type"];
                const target = parameters[i]["target"];
                const param = Metabase.createParameter(type, target, value);
                newParameters.push(param);
            }
        }
        return newParameters;
    }

    static getQuestionDetails(questionNumber) {
        const baseUrl = properties.getBaseUrl();
        let token = properties.getToken();
        try {
            if (token == undefined || token == null) token = this.getToken();
            return Metabase.getCardDetails(baseUrl, token, questionNumber);
        } catch (e) {
            if (e.name == "UnauthorizedError") {
                token = this.getToken();
                return Metabase.getCardDetails(baseUrl, token, questionNumber);
            } else {
                throw e;
            }
        }
    }

    static getQuestionDetailsSimplified(questionNumber) {
        const jsonData = this.getQuestionDetails(questionNumber);

        var id = jsonData["id"];
        var name = jsonData["name"];
        var parameters = jsonData["parameters"];
        return { id: id, name: name, parameters: parameters };
    }

    static fillSheetFromCsv(values, query, spreadsheetId) {
        const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(query.sheet)
        const rows = values;
        const header = rows[0];

        new Range(1, header.length, null, null)
            .toSheetRange(sheet)
            .clear({ contentsOnly: true });
        new Range(1, header.length, 1, rows.length)
            .toSheetRange(sheet)
            .setValues(rows);
    }

    static fillSheet(values, query, spreadsheetId) {
        const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(query.sheet)
        const cols = values.data.cols;
        const rows = values.data.rows;
        const types = [];

        const headers = [];
        for (let i = 0; i < cols.length; i++){
            const col = cols[i];
            headers.push(col.display_name);
            types.push(col.effective_type);
        }
        new Range(1, headers.length, 1, 1)
            .toSheetRange(sheet)
            .clear({ contentsOnly: true })
            .setValues([headers]);

        new Range(1, headers.length, 2, rows.length+1)
            .toSheetRange(sheet)
            .clear({ contentsOnly: true })
            .setValues(rows);
    }

    static logSuccess(funcName, inputs) {
        console.log({
            success: true,
            function: funcName,
            inputs: inputs,
        });
    }

    static logError(funcName, inputs, error) {
        console.error({
            success: false,
            function: funcName,
            inputs: inputs,
            error: error,
        });
    }
}
