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
        const _type = {
            'id'                     :'id',
            'boolean'                :'boolean',
            'category'               :'category',
            'location/city'          :'location',
            'location/country'       :'location',
            'location/state'         :'location',
            'location/zip_code'      :'location',
            'date'                   :'date',
            'date/all-options'       :'date',
            'date/month-year'        :'date',
            'date/quarter-year'      :'date',
            'date/range'             :'date',
            'date/relative'          :'date',
            'date/single'            :'date',
            'number'                 :'number',
            'number/!='              :'number',
            'number/<='              :'number',
            'number/='               :'number',
            'number/>='              :'number',
            'number/between'         :'number',
            'string/!='              :'text',
            'string/='               :'text',
            'string/contains'        :'text',
            'string/does-not-contain':'text',
            'string/ends-with'       :'text',
            'string/starts-with'     :'text',
            'text'                   :'text'
        }[type] || type;


        return {"type": _type, "target": target, "value": value}
    }

}
