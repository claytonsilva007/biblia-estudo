import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  userProfile: any = null;
  constructor(public navCtrl: NavController, private googlePlus: GooglePlus) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userProfile = user;
      } else {
        this.userProfile = null;
      }
    });
  }

  loginUser(): void {
    this.googlePlus.login({
      'webClientId': '513997295997-lvvjsj7lr2epv19uvd517q1r61o05u7p.apps.googleusercontent.com',
      'offline': true
    }).then(res => {
      const googleCredential = firebase.auth.GoogleAuthProvider
        .credential(res.idToken);

      firebase.auth().signInWithCredential(googleCredential)
        .then(response => {
          console.log("Firebase success: " + JSON.stringify(response));
    });
  }, err => {
  console.error("Error: ", err)
});
}

}
