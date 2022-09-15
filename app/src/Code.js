function onInstall() {
    onOpen();
}

function onOpen() {

    var ui = SpreadsheetHelper.getUi();
    if (ui != undefined && ui != null) {
        ui.createMenu("Metabase Test")
            .addItem("Abrir..", "openSideBar")
            .addSeparator()
            .addItem("Importar Consulta", "importQuestion")
            .addItem("Importar todas as Consultas na Planilha", "importAllQuestions")
            .addToUi();
    }
}

function openSideBar() {
    var html = HtmlService.createTemplateFromFile("view/sidebar").evaluate();
    SpreadsheetApp.getUi().showSidebar(html);
}

class Core {
    static getSheetNumbers() {
        var sheets = SpreadsheetHelper.getSheets();
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
        const token = Metabase.getToken(baseUrl, username, password);
        properties.setToken(token);
        return token;
    }

    static getQuestionAndFillSheet(query) {
        var values = this.getQuestionAsCsv(query);
        this.fillSheetFromCsv(values, query);
    }

    static getQuestionAsCsv(query) {
        const baseUrl = properties.getBaseUrl();
        let token = properties.getToken();
        const parameters = this.createParameters(query.parameters);
        try {
            if (token == undefined || token == null) token = this.getToken();
            return Metabase.getQuestionAsCsv(baseUrl, token, query.id, parameters);
        } catch (e) {
            if (e.name == "UnauthorizedError") {
                token = this.getToken();
                return Metabase.getQuestionAsCsv(baseUrl, token, query.id, parameters);
            } else {
                throw e;
            }
        }
    }

    static createParameters(parameters) {
        let newParameters = [];
        for (let i = 0; i < parameters.length; i++) {
            const value = parameters[i]["value"];
            if(value != undefined && value != null && value != '') {
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
        var values = jsonData["dataset_query"]["native"]["template-tags"];

        let parameters = [];
        for (const [key, value] of Object.entries(values)) {
            const object = {
                target: key || value["name"],
                name: value["display-name"],
                type: value["type"],
                "widget-type": value["widget-type"],
            };
            parameters.push(object);
        }

        return {id: id, name: name, parameters: parameters};
    }

    static fillSheetFromCsv(values, query) {
        const sheet = SpreadsheetHelper.getSheet(query.sheet);
        const rows = values;
        const header = rows[0];

        console.log(query.range);

        new Range(1, header.length, null, null)
            .toSheetRange(sheet)
            .clear({contentsOnly: true});
        new Range(1, header.length, 1, rows.length)
            .toSheetRange(sheet)
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
