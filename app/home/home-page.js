var HomeViewModel = require("./home-view-model").HomeViewModel;
let applicationSettings = require("application-settings")
let Frame = require("ui/frame")


function onNavigatingTo(args) {
    var page = args.object;
    page.bindingContext = new HomeViewModel();
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