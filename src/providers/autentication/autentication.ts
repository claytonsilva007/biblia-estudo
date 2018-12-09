import { Injectable, ViewChild } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase/app';
import { HomePage } from '../../pages/home/home';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AutenticationProvider {
  @ViewChild('myNav') nav;

  constructor(private platform: Platform, private fb: Facebook, private googlePlus: GooglePlus, 
    public events: Events, private afAuth: AngularFireAuth) {
    
  }

  signInWithFacebook() {
    if (this.platform.is('cordova')) {
      return this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        this.nav.push(HomePage);
        return firebase.auth().signInWithCredential(facebookCredential);
      })
    }
    else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => {
          this.events.publish("user:login", res.user);
          this.nav.push(HomePage);
        });
    }
  }

  googleLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.googlePlus.login({
        'webClientId': '513997295997-lvvjsj7lr2epv19uvd517q1r61o05u7p.apps.googleusercontent.com',
        'offline': true
      }).then(res => {
        const googleCredential = firebase.auth.GoogleAuthProvider
          .credential(res.idToken);

        firebase.auth().signInWithCredential(googleCredential)
          .then(response => {
            resolve(response);
            this.nav.push(HomePage);
          });
      }, err => {
        console.error("Error: ", err)
        reject(err);
      });
    });
  }
}
