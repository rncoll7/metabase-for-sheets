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