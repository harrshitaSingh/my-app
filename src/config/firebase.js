import firebase from "firebase";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from "./config";

let firebaseConfig = {};

if (environment === "production") {
  firebaseConfig = {
    apiKey: "AIzaSyCJVQl2nkZXe36-mhmfG0xQ2PSgaDBP3v8",
    authDomain: "charming-shield-300804.firebaseapp.com",
    projectId: "charming-shield-300804",
    storageBucket: "charming-shield-300804.appspot.com",
    messagingSenderId: "303239150168",
    appId: "1:303239150168:web:e5a1bd2adbcdc752cae82d",
    measurementId: "G-68LY2278VG",
  };
} else {
  firebaseConfig = {
    apiKey: "AIzaSyDh1xGKmWaRStY2z_XLCMgrLs6Onvj2xYI",
    authDomain: "startstaging.firebaseapp.com",
    projectId: "startstaging",
    storageBucket: "startstaging.appspot.com",
    messagingSenderId: "546936271294",
    appId: "1:546936271294:web:cf223dde266eb0354e89ef",
    measurementId: "G-NYB7DCYEPY",
  };
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const analytics = firebase.analytics();
export const messaging = firebase.messaging();
// console.log("MESSAGING", messaging);
// messaging.getToken().then((res) => console.log("TOKEN OF TEH DEVICE", res));

// const messaging = getMessaging(firebase);
//......

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage(messaging, (payload) => {
      // console.log("payload", payload);
      resolve(payload);
    });
  });
export default firebase;
