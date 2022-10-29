export default class ZegoPluginResult {
    code = "";
    message = "";
    constructor(code = "", message = "", result = "") {
        this.code = code;
        this.message = message;
    }
}