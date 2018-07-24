var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var firebase = require("nativescript-plugin-firebase");
const _ = require("lodash");

var firebaseInitialized = false;
var presentEntries = [];

class HomeViewModel extends Observable {
    constructor(page) {
      super();
      this.newTitle = '';
      this.newContent = '';
      this.notes = new ObservableArray();
      this._initializeFirebase();
    }

    _initializeFirebase() {
        if (!firebaseInitialized) {
            firebase.init({
                persist: true
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
                    presentEntries = _.keys(result.value);
                } else {
                    console.log(result.error);
                }
              };
        
              firebase.query(onQueryEvent, '/notes/anon', {
                singleEvent: true,
                orderBy: {
                    type: firebase.QueryOrderByType.CHILD,
                    value: "createdAt"
                }
              });

              let onChildEvent = (result) => {
                  debugger;
                  if (presentEntries.indexOf(result.key) === -1) {
                    console.log('childAdded');
                    console.log(result);
                    this.notes.push(result.value);
                    presentEntries.push(result.key);
                  }
                // this.notes.push(result.value);
              }
              firebase.addChildEventListener(onChildEvent, "/notes/anon").then((listenerWrapper) => {
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
                    '/notes/anon',
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