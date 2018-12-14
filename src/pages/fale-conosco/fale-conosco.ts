import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-fale-conosco',
  templateUrl: 'fale-conosco.html',
})
export class FaleConoscoPage {

  credentialsForm: FormGroup;
  erro: string;
  
  constructor(public navCtrl: NavController, private socialSharing: SocialSharing, private toastCtrl: ToastController, private formBuilder: FormBuilder) {
    
    this.erro = "";

    this.credentialsForm = this.formBuilder.group({
      nome: ['', [Validators.required]]
    });

  }

  enviarEmail(){

    this.socialSharing.canShareViaEmail().then(() => {
      
      this.socialSharing.shareViaEmail('Agradecemos o contato - ' + this.credentialsForm.controls['nome'].value, 
          'Feedback - ' + this.credentialsForm.controls['nome'].value, 
          ['bibliadeestudocolaborativo@gmail.com']).then(() => {

        this.presentToast("Obrigado por manter contato conosco. Seu email foi enviado com sucesso");

      }).catch((e) => {
        this.presentToast("Erro ao tentar enviar email. " +  e);
      });
    }).catch((e) => {
      this.presentToast("Erro ao tentar enviar email. " +  e);
    });
  }

  presentToast(msg: string) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }
}
