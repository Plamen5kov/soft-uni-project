
var createViewModel = require("./login-view-model").createViewModel;
let Frame = require("ui/frame")
let facebookPlugin = require("nativescript-facebook");
let applicationSettings = require("application-settings")
var firebase = require("nativescript-plugin-firebase");
var FeedbackPlugin = require("nativescript-feedback");
var feedback = new FeedbackPlugin.Feedback();
const loggedInUser = require("~/config.json")
var http = require("http");

function onNavigatingTo(args) {

    let isUserLoggedIn = applicationSettings.getString(loggedInUser.LOGGED_USER)
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
                const FACEBOOK_GRAPH_API_URL = "https://graph.facebook.com/v2.9"
                http.getJSON(FACEBOOK_GRAPH_API_URL + "/me?access_token=" + fbData.token).then((res) => {
                    applicationSettings.setString(loggedInUser.LOGGED_USER, res.id)
                    navigateToHome();
                  }, function (err) {
                    alert("Error getting user info: " + err);
                  });
            }
        }
      )
}

function navigateToHome() {
    Frame.topmost().navigate("home/home-page");
}

function googleLogin (args) {
    firebase.login({
        type: firebase.LoginType.GOOGLE,
      }).then(
          function (result) {
            console.log(JSON.stringify(result));
            applicationSettings.setString(loggedInUser.LOGGED_USER, result.uid)
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