var HomeViewModel = require("./home-view-model").HomeViewModel;

function onNavigatingTo(args) {
    var page = args.object;
    page.bindingContext = new HomeViewModel();
}

exports.onNavigatingTo = onNavigatingTo;