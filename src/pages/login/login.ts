import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController, AlertController, Platform, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';

import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import { FormBuilder, FormGroup } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  displayName;
  userEmailSenha: UserEmailSenha;
  email:string = "";
  password:string = "";
  credentialsForm: FormGroup;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public forgotCtrl: AlertController, public menu: MenuController, 
              private toastCtrl: ToastController, private afAuth: AngularFireAuth, private fb: Facebook, private platform: Platform, 
    public events: Events, private googlePlus: GooglePlus, private formBuilder: FormBuilder) {
    
    this.userEmailSenha = new UserEmailSenha();
    this.menu.swipeEnable(false);
                
    afAuth.authState.subscribe( (user: firebase.User) => {
      if (!user) {
        this.displayName = null;
        return;
      }

      this.displayName = user.displayName;
      this.events.publish("user:login", user);
    }); 


    this.credentialsForm = this.formBuilder.group({
      email: [''],
      password: ['']
    });

  }

  onSignIn() {
    console.log('SignInPage: onSignIn()');
  }

  onForgotPassword() {
    console.log('SignInPage: onForgotPassword()');
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
  
  // go to register page
  register() {
    this.navCtrl.push(RegisterPage);
  }

  async login() {
    
   try {
      var r = await this.afAuth.auth.signInWithEmailAndPassword(
        this.credentialsForm.controls['email'].value,
        this.credentialsForm.controls['password'].value
      );
      if (r) {
        console.log("Successfully logged in!");
        this.navCtrl.setRoot('HomePage');
      }

    } catch (err) {
      console.error(err);
    }
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

export class UserEmailSenha{
  email: string;
  password: string;

  constructor(){
    this.email = "";
    this.password;
  }
}

