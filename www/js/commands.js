//EscCommand
var _EscCommand = (function () {
    function _EscCommand() {
        this.ESC = "\u001B";
        this.GS = "\u001D";
        this.InitializePrinter = this.ESC + "@";
        this.BoldOn = this.ESC + "E" + "\u0001";
        this.BoldOff = this.ESC + "E" + "\0";
        this.DoubleHeight = this.GS + "!" + "\u0001";
        this.DoubleWidth = this.GS + "!" + "\u0010";
        this.DoubleOn = this.GS + "!" + "\u0011"; // 2x sized text (double-high + double-wide)
        this.DoubleOff = this.GS + "!" + "\0";
        this.PrintAndFeedMaxLine = this.ESC + "J" + "\u00FF"; // 打印并走纸 最大255
        this.TextAlignLeft = this.ESC + "a" + "0";
        this.TextAlignCenter = this.ESC + "a" + "1";
        this.TextAlignRight = this.ESC + "a" + "2";
    }
    _EscCommand.prototype.PrintAndFeedLine = function (verticalUnit) {
        if (verticalUnit > 255)
            verticalUnit = 255;
        if (verticalUnit < 0)
            verticalUnit = 0;
        return this.ESC + "J" + String.fromCharCode(verticalUnit);
    };
    _EscCommand.prototype.CutAndFeedLine = function (verticalUnit) {
        if (verticalUnit === void 0) {
            return this.ESC + "v" + 1;
        }
        if (verticalUnit > 255)
            verticalUnit = 255;
        if (verticalUnit < 0)
            verticalUnit = 0;
        return this.ESC + "V" + String.fromCharCode(verticalUnit);
    };
    return _EscCommand;
} ());
var Esc = new _EscCommand();

var _TscCommand = (function () {
    function _TscCommand() {
        this.CUT = "CUT\n";
        this.CUT = "HOME\n";
    }
    _TscCommand.prototype.sound = function (level, interval) {
        return "SOUND " + level + "," + interval + "\n";
    };
    // X      The x-coordinate of the text 
    // Y      The y-coordinate of the text 
    // font      Font name 
    // 1 English 8 x 12
    // 2 English 12 x 20
    // 3 English 16 x 24
    // 4 English 24 x 32
    // 5 English 32 x 48
    // 6 English 14 x 19
    // 7 English 21 x 27
    // 8 English 14 x 25
    // TST24.BF2     Traditional Chinese  24 x 24     font
    // TSS24.BF2     Simplified Chinese  24 x 24 font (GB)
    // K Korean 24 x 24 font
    // Rotation 0 90 180 270 
    // x_multiplication    Horizontal multiplication, up to 10x.Available factors: 1~10 width (point) of true type font. 1 point=1/72 inch. 
    // y_multiplication    Vertical multiplication, up to 10x. Available factors: 1~10 For true type font, this parameter is used to specify the height (point) of true type font. 1 point=1/72 inch. 
    _TscCommand.prototype.text = function (x, y, font, rotation, x_multiplication, y_multiplication, content) {
        var str = "TEXT " + x + "," + y + ",\"" + font + "\"," + rotation + "," + x_multiplication + "," + y_multiplication + ",\"" + content + "\"\n";
        return str;
    };
    //200DPI 1mm=8dots
    _TscCommand.prototype.feed = function (dots) {
        return "FEED " + dots + "\n";
    };
    _TscCommand.prototype.print = function (count) {
        if (count === void 0) { count = 1; }
        return "PRINT " + count + "\n";
    };
    return _TscCommand;
}());
var Tsc = new _TscCommand();