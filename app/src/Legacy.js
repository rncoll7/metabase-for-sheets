
function alert() {
    const ui = SpreadsheetApp.getUi()
    if (ui != null) {
        return ui.alert.apply(this, arguments);
    }
}

function importQuestion() {

    var metabaseQuestionNum = Browser.inputBox('Metabase question number (This will replace all data in the current tab with the result)', Browser.Buttons.OK_CANCEL);
    if (metabaseQuestionNum != 'cancel' && !isNaN(metabaseQuestionNum)) {

        try {
            Core.getQuestionAndFillSheetLegacy({"id": metabaseQuestionNum, "parameters": []});
            Core.logSuccess('importQuestion', {"metabaseQuestionNum": metabaseQuestionNum});
            alert('Question ' + metabaseQuestionNum + ' successfully imported.');
        } catch (e) {
            Core.logError('importQuestion', {"metabaseQuestionNum": metabaseQuestionNum}, e);
            alert('Question ' + metabaseQuestionNum + ' failed to import. ' + status.error);
        }

    } else if (metabaseQuestionNum == 'cancel') {
        alert('You have canceled.');
    } else {
        alert('You did not enter a number.');
    }
}

function importAllQuestions() {
    var ui = SpreadsheetApp.getUi();

    var result = ui.alert('Isso ira importar as consultas para abas contendo "(metabase/NUMERO_DA_CONSULTA)". Após a barra o numero da consulta no Metabase (exemplo: "(metabase/152)").', ui.ButtonSet.YES_NO);

    if (result == ui.Button.YES) {
        var questions = Core.getSheetNumbers();
        for (var i = 0; i < questions.length; i++) {
            questions[i].done = false;
        }

        if (questions.length === 0) {
            ui.alert("Nenhuma consulta encontrada.");
            return;
        }

        var questionNumbers = [];
        for (var i = 0; i < questions.length; i++) {
            questionNumbers.push(questions[i].questionNumber);
        }

        var go = ui.alert('Importar ' + questions.length + ' consulta(s): ' + questionNumbers.join(', ') + '. Continuar?', ui.ButtonSet.YES_NO);

        if (go == ui.Button.YES) {
            var startDate = new Date().toLocaleTimeString();
            var htmlOutput = HtmlService.createHtmlOutput(`<p>Iniciado em ${startDate}...</p>`);
            ui.showModalDialog(htmlOutput, 'Importando consulta');

            htmlOutput.append(`<ul>`);
            for (var i = 0; i < questions.length; i++) {
                var metabaseQuestionNum = questions[i].questionNumber;
                var sheetName = questions[i].sheetName;

                try {
                    Core.getQuestionAndFillSheetLegacy({"id": metabaseQuestionNum, "sheet": sheetName, "parameters": []});
                    Core.logSuccess('importAllQuestions', {"metabaseQuestionNum": metabaseQuestionNum});
                    htmlOutput.append(`<li>${metabaseQuestionNum}: Ok</li>`);
                } catch (e) {
                    Core.logError('importAllQuestions', {"metabaseQuestionNum": metabaseQuestionNum}, e);
                    htmlOutput.append(`<li>${metabaseQuestionNum}: Erro</li>`);
                }
            }
            htmlOutput.append(`</ul>`);

            var endDate = new Date().toLocaleTimeString();
            htmlOutput.append('<p>Finalizado em ' + endDate + '.</p></hr>');

            ui.showModalDialog(htmlOutput, 'Importando');

        } else {
            ui.alert('Cancelado.');
        }
    } else {
        ui.alert('Cancelado.');
    }
}