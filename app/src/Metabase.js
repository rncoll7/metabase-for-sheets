class Metabase {

    static getToken(baseUrl, username, password) {
        const sessionUrl = `${baseUrl}/api/session`;
        const options = {
            "method": "post",
            "headers": {
                "Content-Type": "application/json"
            },
            "payload": JSON.stringify({
                username: username,
                password: password
            })
        };

        const response = UrlFetchApp.fetch(sessionUrl, options);
        const token = JSON.parse(response).id;
        return token;
    }

    static getCardDetails(baseUrl, token, questionNumber) {
        const questionUrl = `${baseUrl}/api/card/${questionNumber}`;

        const options = {
            "method": "get",
            "headers": {
                "X-Metabase-Session": token
            },
            "muteHttpExceptions": true
        };

        const response = UrlFetchApp.fetch(questionUrl, options);
        const statusCode = response.getResponseCode();
        const text = response.getContentText();

        if (statusCode == 200 || statusCode == 202) {
            const jsonData = JSON.parse(text);
            return jsonData;
        } else if (statusCode == 401) {
            throw new UnauthorizedError('Não foi possivel importar a consulta. Metabase');
        } else {
            throw new HttpError('Não foi possivel importar a consulta. Metabase', statusCode, text);
        }
    }

    static getQuestionAsCsv(baseUrl, token, questionNumber, parameters) {
        const questionUrl = `${baseUrl}/api/card/${questionNumber}/query/csv`;

        const options = {
            "method": "post",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Metabase-Session": token
            },
            "muteHttpExceptions": true,
            "payload": {"parameters": JSON.stringify(parameters)}
        };

        const response = UrlFetchApp.fetch(questionUrl, options);
        var statusCode = response.getResponseCode();
        const text = response.getContentText()

        if (statusCode == 200 || statusCode == 202) {
            const values = Utilities.parseCsv(text);
            return values;
        } else if (statusCode == 401) {
            throw new UnauthorizedError('Não foi possivel importar a consulta. Metabase');
        } else {
            throw new HttpError('Não foi possivel importar a consulta. Metabase', statusCode, text);
        }
    }

    static createParameter(type, target, value) {
        return {"type": type, "target": ["variable", ["template-tag", target]], "value": value}
    }

}
