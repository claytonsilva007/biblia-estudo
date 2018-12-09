import { Component } from "@angular/core";
import { NavController, ToastController, Events } from "ionic-angular";
import { LoginPage } from "../login/login";
import { HomePage } from "../home/home";
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import firebase from 'firebase/app';
import { regexValidators } from '../../models/Validators'; 
import { AutenticationProvider } from "../../providers/autentication/autentication";

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  credentialsForm: FormGroup;
  erro: string;

  constructor(public nav: NavController, private formBuilder: FormBuilder, private toastCtrl: ToastController, 
              private authProvider: AutenticationProvider, public events: Events) {

    this.erro = "";

    this.credentialsForm = this.formBuilder.group({

      email: ['', Validators.compose([
          Validators.pattern(regexValidators.email),
          Validators.required
        ])
      ], password: [
        '', Validators.compose([
          Validators.pattern(regexValidators.password),
          Validators.required
        ])
      ], nome: ['', Validators.compose([
          Validators.pattern(regexValidators.nome),
          Validators.required
        ])
      ]      
    })
  }

  // register and go to home page
  register() {
    this.nav.setRoot(HomePage);
  }

  // go to login page
  login() {
    this.nav.setRoot(LoginPage);
  }

  createNewUser() {
    if (this.credentialsForm.valid) {
      let email = this.credentialsForm.controls['email'].value;
      let password = this.credentialsForm.controls['password'].value;
      let nome = this.credentialsForm.controls['nome'].value;
      
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then( () => {
        this.events.publish("user:login", new userAux(undefined, nome));
        this.nav.push(LoginPage);
      })
      .catch(function (error) {
        //var errorCode = error.code;
        this.erro = error.message;
      });
    }
  }

  signInWithFacebook() {
    this.authProvider.signInWithFacebook();
  }

  googleLogin() {
    this.authProvider.googleLogin();
  }  

  presentToast(mensagem: string) {
    let toast = this.toastCtrl.create({
      message: mensagem,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}

export class userAux{
  photoUrl: string;
  displayName: string;

  constructor(photo, name){
    this.photoUrl = photo;
    this.displayName = name;
  }
}
