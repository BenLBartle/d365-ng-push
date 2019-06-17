# Dynamics 365 Push Notifications

This is a project to bring PWA style Push Notifications fot Dynamics 365 and Model-driven Apps.

This project uses [Angular](https://angular.io/) and [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging) to capture consent within Dynamics and then push the consent token into CDS.

From this point you can use just about anything to send a push notification to the user with whatever message you want.

## I don't care about the code, I want the app

Great! Hit the releases icon up the top and download the latest solution file. This is a zip file that contains the following:

1) All the web resources required to capture consent from the user, this can be put in your app's site map. The web resource name is `Notifications Landing Page`.
2) The Notification Consents entity, which is used to store the consent token and preferences.

Once you've got this installed, you'll need to do a couple of things.

### Sign up for a Firebase Cloud Messaging account

Create a firebase account, and create a new project within Firebase. We won't be hosting our project there but we will be using the API. When you've created your app you should get some sample JavaScript which contains the Firebase Configuration which should look a bit like:

```javascript
var firebaseConfig = {
    apiKey: "PRzaSyCfZsLQtpUIYycADMlqu72L-L92p3dcqH4",
    authDomain: "dynamics365-1f208.firebaseapp.com",
    databaseURL: "https://dynamics365-1f208.firebaseio.com",
    projectId: "dynamics365-1f208",
    storageBucket: "dynamics365-1f208.appspot.com",
    messagingSenderId: "100652319271",
    appId: "1:100652319271:web:2cc65d8f82a600a5"
  };
```

You will need to add these values into the appConfig.json web resource called `Notifications Configuration File` (`/bartl_/push/assets/config/appConfig.json`). It's pretty obvious where they go.

You'll also need to edit the Service Worker file `Firebase Service Worker` (`/bartl_/push/firebasemessagingsw.js`) and add in your `messagingSenderId`. Again, it's pretty obvious.

### Navigate to your new web resource and validate

Now just log into Dynamics, navigate to your new notification preferences window and boom! It should store your consent. Now you can use any method you want to send a notification to the user. The API documentation is [here](https://firebase.google.com/docs/cloud-messaging/js/first-message). 

### Custom Connectors

I've included a nice custom flow connector within this repo under `Custom Connectors`.

You'll be asked for an Server API Key when creating the connection, you can get this from your *Project Settings* > *Cloud Messaging* in the Firebase Console. You'll need to make sure you specify the value as:

`key=<YourServerKey>`

If you don't include the key= then it won't work.

## I want the code, show me how to build the app!

First of all you'll need the following pre-requisites:

1. npm
2. Angular CLI

Restore the dependencies by running 

```sh
> npm install
```

Then you can validate the thing will run by running `ng serve` from the console for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io). Would help if I'd written some though right? :-)

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/). Would also help if I'd written some of these too... :-)

### Post-build actions

Now because Angular and PWAs really want to be served from the root of the app, and because Dynamics 365 doesn't allow hypens in file names, we need to do a few things before we can upload the files. Do all this to the output files in the `dist/` folder.

1. Rename the `firebase-messaging-sw.js` file to `firebasemessagingsw.js`
2. Rename the `es2015-polyfills.js` file to `es2015polyfills.js`
3. Update the vendor.js file to ensure the service worker registration and scope are set correctly, the registration should look like:
```javascript
navigator.serviceWorker.register("/WebResources/bartl_/push/firebasemessagingsw.js",{scope:"/WebResources/bartl_/push/"})
```
4. Update `index.html` reference to the renamed `es2015polyfills.js` file.

This should get around all the limitations. Now you can use your uploader of choice to push these resources into Dynamics. You'll need to include the two `.json` files as JavaScript web resources.

