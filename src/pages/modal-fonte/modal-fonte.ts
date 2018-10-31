import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';

@IonicPage()
@Component({
  selector: 'page-modal-fonte',
  templateUrl: 'modal-fonte.html',
})
export class ModalFontePage {

  tamanhoFonte: number;
  frase: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              private viewController: ViewController, private bibliaProvider: ConfiguracaoBibliaProvider) {

    this.tamanhoFonte = this.bibliaProvider.getBiblia().tamanhoFonte;
    
    this.frase = "Jesus!";
  }

  ionViewDidLoad() {
    
  }

  salvar(){
    this.bibliaProvider.biblia.tamanhoFonte = this.tamanhoFonte;
    this.closeModal();
  }
  
  closeModal() {
    this.viewController.dismiss();
  }

}
