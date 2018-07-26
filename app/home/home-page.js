var HomeViewModel = require("./home-view-model").HomeViewModel;
let applicationSettings = require("application-settings")
let Frame = require("ui/frame")
const loggedInUserConst = require("~/config.json")

function onNavigatingTo(args) {
    var page = args.object;
    var loggedInUser = applicationSettings.getString(loggedInUserConst.LOGGED_USER)
    page.bindingContext = new HomeViewModel(loggedInUser, page);
    page.getViewById("lv_notes").refresh()
}
function logout (args) {
    applicationSettings.clear()
    Frame.topmost().navigate({
        moduleName: "login/login-page",
        clearHistory: true
    })
}

exports.logout = logout;
exports.onNavigatingTo = onNavigatingTo;