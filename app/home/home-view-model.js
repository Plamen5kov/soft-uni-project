var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var firebase = require("nativescript-plugin-firebase");

var fireBaseInstance;

class HomeViewModel extends Observable {
    constructor(page) {
      super();
      this.newTitle = '';
      this.newContent = '';
      this.notes = new ObservableArray();
      this._initializeFirebase();
    }

    _initializeFirebase() {
        firebase.init({
        // Optionally pass in properties for database, authentication and cloud messaging,
        // see their respective docs.
        }).then(
            function (instance) {
                console.log("firebase.init done");
                fireBaseInstance = instance;
                alert('Firebase connected');
            },
            function (error) {
            console.log("firebase.init error: " + error);
            }
        );
    }

    add() {
        if (fireBaseInstance) {
            const note = {
                title: this.newTitle, 
                content: this.newContent 
            };
            fireBaseInstance.setValue(
                '/notes',
                {foo:'bar'}
            );
        }
    }
}  

exports.HomeViewModel = HomeViewModel