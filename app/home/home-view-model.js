var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var firebase = require("nativescript-plugin-firebase");

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
            function (result) {
                console.log("firebase.init done");
                this.firebaseInitialized = true;
                alert('Firebase connected');
            },
            function (error) {
                console.log("firebase.init error: " + error);
            }
        );
    }

    add() {
        if (this.firebaseInitialized) {
            const note = {
                title: this.newTitle, 
                content: this.newContent 
            };
            try {
                // use 'firebase' object imported from the plugin
                firebase.setValue(
                    '/notes',
                    note
                ).then(() => {
                    this.set('newTitle', '');
                    this.set('newContent', '');
                }, (err) => {
                    alert(err);
                });

                // firebase.push(
                //     '/notes',
                //     note
                // ).then(() => {
                //     this.set('newTitle', '');
                //     this.set('newContent', '');
                // }, (err) => {
                //     alert(err);
                // });
            } catch (e) {
                alert(e);
            }
        }
    }
}  

exports.HomeViewModel = HomeViewModel