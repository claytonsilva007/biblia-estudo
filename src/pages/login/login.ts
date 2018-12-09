import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController, AlertController, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';

import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AutenticationProvider } from '../../providers/autentication/autentication';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  displayName;
  email:string = "";
  password:string = "";
  credentialsForm: FormGroup;
  erro: string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public forgotCtrl: AlertController, public menu: MenuController, 
              private toastCtrl: ToastController, private afAuth: AngularFireAuth, 
              public events: Events, private formBuilder: FormBuilder, private authProvider: AutenticationProvider) {
    
    this.menu.swipeEnable(false);
    this.erro = "";
                
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

  signInWithFacebook() {
    this.authProvider.signInWithFacebook();
  }
  
  googleLogin() {
    this.authProvider.googleLogin();
  }
  
  // go to register page
  register() {
    this.navCtrl.push(RegisterPage);
  }

  async login() {
   let logou:boolean  = false; 
   try {
      await this.afAuth.auth.signInWithEmailAndPassword(this.credentialsForm.controls['email'].value, this.credentialsForm.controls['password'].value)
        .then( () => {
          this.navCtrl.setRoot(HomePage);
        });

    } catch (err) {
      this.erro = err;
    }
  }


  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: 'Esqueceu a senha?',
      message: "Digite seu email para que enviemos um link de reset password.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Resetar senha',
          handler: data => {
              this.resetPassword(data.email);
              let toast = this.toastCtrl.create({
              message: 'Acesse seu email para concluir a recuperação da senha.',
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

   async resetPassword(email){
     console.log(email);
      let emailParam: string = email.toString();
      var auth = firebase.auth();
      auth.sendPasswordResetEmail(emailParam).then(function () {
        this.navCtrl.publish(HomePage);
      }).catch((error) => console.log(error))
  }

}


