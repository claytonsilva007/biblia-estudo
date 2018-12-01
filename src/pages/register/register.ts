import { Component } from "@angular/core";
import { NavController, ToastController } from "ionic-angular";
import { LoginPage } from "../login/login";
import { HomePage } from "../home/home";
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import firebase from 'firebase/app';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  credentialsForm: FormGroup;

  constructor(public nav: NavController, private formBuilder: FormBuilder, private toastCtrl: ToastController) {

    this.credentialsForm = this.formBuilder.group({
      email: [''],
      password: ['']
    });

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
    let email = this.credentialsForm.controls['email'].value;
    let password = this.credentialsForm.controls['password'].value;
    
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
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
