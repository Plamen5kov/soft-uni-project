
var createViewModel = require("./login-view-model").createViewModel;
let Frame = require("ui/frame")

function onNavigatingTo(args) {
    var page = args.object;
    page.bindingContext = createViewModel();

    Frame.topmost().navigate("home/home-page");
}

exports.onNavigatingTo = onNavigatingTo;