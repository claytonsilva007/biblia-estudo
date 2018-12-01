import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController, AlertController, Platform, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';

import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  displayName;  

  constructor(public navCtrl: NavController, public navParams: NavParams, public forgotCtrl: AlertController, public menu: MenuController, 
              private toastCtrl: ToastController, private afAuth: AngularFireAuth, private fb: Facebook, private platform: Platform, 
    public events: Events, private googlePlus: GooglePlus) {
    
    this.menu.swipeEnable(false);
                
    afAuth.authState.subscribe( (user: firebase.User) => {
      if (!user) {
        this.displayName = null;
        return;
      }

      this.displayName = user.displayName;
      this.events.publish("user:login", user);
    }); 
  }

  signInWithFacebook() {
    if (this.platform.is('cordova')) {
      return this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);               
        this.navCtrl.push(HomePage);
        return firebase.auth().signInWithCredential(facebookCredential);
      })
    }
    else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => {
          this.events.publish("user:login", res.user);
          this.navCtrl.push(HomePage);
        });
    }

  }
  
  googleLogin(): Promise < any > {
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
            this.navCtrl.push(HomePage);
          });
      }, err => {
        console.error("Error: ", err)
        reject(err);
      });
    });
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  // go to register page
  register() {
    this.navCtrl.push(RegisterPage);
  }

  // login and go to home page
  login() {
    this.navCtrl.setRoot(HomePage);
  }

  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: 'Forgot Password?',
      message: "Enter you email address to send a reset link password.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            console.log('Send clicked');
            let toast = this.toastCtrl.create({
              message: 'Email was sended successfully',
              duration: 3000,
              position: 'top',
              cssClass: 'dark-trans',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();
          }
        }
      ]
    });
    forgot.present();
  }

}
