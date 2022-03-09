class SpreadsheetHelper {

    static getSpreadsheet(id) {
        if (id == false || id == undefined || id == null) {
            return SpreadsheetApp.getActiveSpreadsheet();
        } else {
            return SpreadsheetApp.openById(id);
        }
    }

    static getSheet(name, spreadsheet) {

        if (spreadsheet == undefined || !(spreadsheet instanceof Spreadsheet)) {
            spreadsheet = this.getSpreadsheet(spreadsheet);
        }

        if (name == false || name == undefined || name == null) {
            return spreadsheet.getActiveSheet();
        } else {
            return spreadsheet.getSheetByName(name);
        }
    }

    static getSheets(spreadsheet) {

        if (spreadsheet == undefined || !(spreadsheet instanceof Spreadsheet)) {
            spreadsheet = this.getSpreadsheet(spreadsheet);
        }

        return spreadsheet.getSheets();
    }

    static getUi() {
        try {
            return SpreadsheetApp.getUi();
        } catch (e) {
            return null;
        }
    }

    static alert() {
        const ui = this.getUi()
        if (ui != undefined && ui != null) {
            return ui.alert.apply(this, arguments);
        }
    }
}

class Range {

    constructor(minCol, maxCol, minRow, maxRow) {
        this.minCol = isNaN(minCol) ? minCol : this.numberToLetters(minCol);
        this.maxCol = isNaN(maxCol) ? maxCol : this.numberToLetters(maxCol);
        this.minRow = minRow;
        this.maxRow = maxRow;
    }

    toString() {
        let str = ''
        if (this.minCol) str += this.minCol.toString();
        if (this.minRow) str += this.minRow.toString();
        str += ":"
        if (this.maxCol) str += this.maxCol.toString();
        if (this.maxRow) str += this.maxRow.toString();
        return str;
    }

    toSheetRange(sheet) {
        let rangeString = this.toString();
        return sheet.getRange(rangeString);
    }

    numberToLetters(i) {
        if (!(i > 0))
            return
        var c = "";
        while (i > 0) {
            var j = i % 26;
            var i = parseInt(i / 26);
            if (j === 0) {
                j = 26;
                i = i - 1;
            }
            var n = String.fromCharCode(64 + j);
            c = n + c
        }
        return c
    }

}