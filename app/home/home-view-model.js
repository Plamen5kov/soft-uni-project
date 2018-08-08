var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var firebase = require("nativescript-plugin-firebase");
const _ = require("lodash");

var firebaseInitialized = false;

class HomeViewModel extends Observable {
    constructor(loggedInUser, page) {
      super();
      this.presentEntries = [];
      this.loggedInUser = loggedInUser
      this.newTitle = '';
      this.newContent = '';
      this.notes = new ObservableArray();
      this._initializeFirebase();
      this.page = page;
      this.getNotes();
    }

    _initializeFirebase() {
        if (!firebaseInitialized) {
            firebase.init({
                persist: true,
                onMessageReceivedCallback: function(message) {
                    console.log("Title: " + message.title);
                    console.log("Body: " + message.body);
                    // if your server passed a custom property called 'foo', then do this:
                    console.log("Value of 'foo': " + message.data.foo);
                  }
            }).then((result) => {
                    firebaseInitialized = true;
                    this.getNotes();
                },
                (error) => {
                    alert(error);
                    console.log("firebase.init error: " + error);
                }
            ).finally(() => { console.log('finally init');});
        }
    }

    getNotes() {
        if (firebaseInitialized) {
            let onQueryEvent = (result) => {
                // note that the query returns 1 match at a time
                // in the order specified in the query
                console.log('onQuery called');
                if (!result.error) {
                    const sortedResult = _(result.value).map(entry => ({
                        createdAt: entry.createdAt,
                        title: entry.title,
                        content: entry.content
                    }))
                    .sortBy('createdAt')
                    .value();

                    this.notes.push(sortedResult);
                    console.log(result);
                    this.presentEntries = _.keys(result.value);
                } else {
                    console.log(result.error);
                }
              };
        
              firebase.query(onQueryEvent, '/notes/' + this.loggedInUser, {
                singleEvent: true,
                orderBy: {
                    type: firebase.QueryOrderByType.CHILD,
                    value: "createdAt"
                }
              });

              let onChildEvent = (result) => {
                  if (this.presentEntries.indexOf(result.key) === -1) {
                    console.log('childAdded');
                    console.log(result);
                    this.notes.push(result.value);
                    this.presentEntries.push(result.key);
                  }
                // this.notes.push(result.value);
              }
              firebase.addChildEventListener(onChildEvent, "/notes/" + this.loggedInUser).then((listenerWrapper) => {
                  var path = listenerWrapper.path;
                  var listeners = listenerWrapper.listeners; // an Array of listeners added
                  // you can store the wrapper somewhere to later call 'removeEventListeners'
                }
              );
        }
    }

    add() {
        if (firebaseInitialized) {
            if (_.isEmpty(this.newTitle) || _.isEmpty(this.newContent)) {
                console.log("Failed to push data - fields are empty");
                return;
            }

            const note = {
                title: this.newTitle, 
                content: this.newContent,
                createdAt: firebase.ServerValue.TIMESTAMP
            };
            try {
                firebase.push(
                    '/notes/' + this.loggedInUser,
                    note
                ).then(() => {
                    alert('Added a note entry!');
                    this.set('newTitle', '');
                    this.set('newContent', '');
                }, (err) => {
                    console.log(err);
                    alert(err);
                }).finally(() => {
                });
            } catch (e) {
                console.log(e);
                alert(e);
            }
        }
    }
}  

exports.HomeViewModel = HomeViewModel