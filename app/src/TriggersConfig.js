class TriggersConfig {
    addTriggers(spreadsheetId) {
        var hour = Browser.inputBox(
            "Horário para execução",
            Browser.Buttons.OK_CANCEL
        );
        if (hour != "cancel" && !isNaN(hour)) {
            deleteAllTriggers();
            ScriptApp.newTrigger("importAllQuestionsTrigger")
                .forSpreadsheet(spreadsheetId)
                .timeBased()
                .atHour(hour)
                .everyDays(1)
                .create();
        }
    }

    deleteAllTriggers() {
        var triggers = ScriptApp.getProjectTriggers();
        for (var i = 0; i < triggers.length; i++) {
            ScriptApp.deleteTrigger(triggers[i]);
        }
    }
}
