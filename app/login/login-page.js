
var createViewModel = require("./login-view-model").createViewModel;
let Frame = require("ui/frame")
let facebookPlugin = require("nativescript-facebook");
let applicationSettings = require("application-settings")
var firebase = require("nativescript-plugin-firebase");

function onNavigatingTo(args) {
    let isUserLoggedIn = applicationSettings.getString("myLoggedInUser")
    if(isUserLoggedIn) {
        navigateToHome()
    }
    var page = args.object;
    page.bindingContext = createViewModel();

}

function fbLogin() {
    
    facebookPlugin.login(
        (err, fbData) => {
            if (err) {
              alert("Error during login: " + err.message);
            } else {
            //   console.log(fbData.token);
                applicationSettings.setString("myLoggedInUser", fbData.token)
                navigateToHome();
            }
        }
      )
}

function navigateToHome() {
    Frame.topmost().navigate("home/home-page");
}

function googleLogin (args) {
    console.log("asdasdasd")
    firebase.login({
        type: firebase.LoginType.GOOGLE,
      }).then(
          function (result) {
            console.log(JSON.stringify(result));
            applicationSettings.setString("myLoggedInUser", result.uid)
            navigateToHome();
          },
          function (errorMessage) {
            console.log(errorMessage);
          }
      );
}
exports.googleLogin = googleLogin;
exports.fbLogin = fbLogin;
exports.onNavigatingTo = onNavigatingTo;