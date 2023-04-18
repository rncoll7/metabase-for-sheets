function onInstall() {
    onOpen();
}

function onOpen() {
    let ui = SpreadsheetHelper.getUi();
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

        if (!baseUrl || !username || !password) {
            throw new Error("Por favor verificar configurações!");
        }

        const token = Metabase.getToken(baseUrl, username, password);
        properties.setToken(token);
        return token;
    }

    static getQuestionAndFillSheet(query) {
        var values = this.getQuestion(query);
        this.fillSheet(values, query);
    }

    static getQuestionAndFillSheetLegacy(query) {
        var values = this.getQuestion(query, "csv");
        this.fillSheetFromCsv(values, query);
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

    static fillSheetFromCsv(values, query) {
        const sheet = SpreadsheetHelper.getSheet(query.sheet);
        const rows = values;
        const header = rows[0];

        new Range(1, header.length, null, null)
            .toSheetRange(sheet)
            .clear({ contentsOnly: true });
        new Range(1, header.length, 1, rows.length)
            .toSheetRange(sheet)
            .setValues(rows);
    }

    static fillSheet(values, query) {
        const sheet = SpreadsheetHelper.getSheet(query.sheet);
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
