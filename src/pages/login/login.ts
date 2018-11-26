import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';

import { GooglePlus } from '@ionic-native/google-plus';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [GooglePlus]
})
export class LoginPage {

  displayName: any;
  email: any;
  familyName: any;
  givenName: any;
  userId: any;
  imageUrl: any;

  isLoggedIn:boolean = false;

  constructor(private googlePlus: GooglePlus, public navCtrl: NavController, public navParams: NavParams, public forgotCtrl: AlertController, public menu: MenuController, private toastCtrl: ToastController) {
    this.menu.swipeEnable(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  // go to register page
  register() {
    this.navCtrl.push(RegisterPage);
  }

  loginUser(): void {
    this.googlePlus.login({
      'webClientId': '513997295997-lvvjsj7lr2epv19uvd517q1r61o05u7p.apps.googleusercontent.com',
      'offline': true
    }).then( res => {
            const googleCredential = firebase.auth.GoogleAuthProvider
                .credential(res.idToken);
   
            firebase.auth().signInWithCredential(googleCredential)
          .then( response => {
            console.log("Firebase success: " + JSON.stringify(response));
          });
    }, err => {
        console.error("Error: ", err)
    });
  }

  loginGoogle() {
    this.googlePlus.login({"installed":{"client_id":"513997295997-2rcql9g0m639ge4b0voaco9ccjvomhog.apps.googleusercontent.com","project_id":"biblia-estudo","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://www.googleapis.com/oauth2/v3/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}})
      .then(res => {
        console.log(res);
        this.displayName = res.displayName;
        this.email = res.email;
        this.familyName = res.familyName;
        this.givenName = res.givenName;
        this.userId = res.userId;
        this.imageUrl = res.imageUrl;

        this.isLoggedIn = true;

        this.navCtrl.setRoot(HomePage);
      })
      .catch(err => console.error(err));
  }

  logout() {
    this.googlePlus.logout()
      .then(res => {
        console.log(res);
        this.displayName = "";
        this.email = "";
        this.familyName = "";
        this.givenName = "";
        this.userId = "";
        this.imageUrl = "";

        this.isLoggedIn = false;
      })
      .catch(err => console.error(err));
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
