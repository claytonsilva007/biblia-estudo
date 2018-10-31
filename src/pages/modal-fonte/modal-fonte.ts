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
  

  aumentar(){
    this.tamanhoFonte = this.tamanhoFonte + 0.1;
  }

  diminuir(){
    this.tamanhoFonte = this.tamanhoFonte - 0.1;
  }

  salvar(){
    this.bibliaProvider.biblia.tamanhoFonte = this.tamanhoFonte;
    this.viewController.dismiss();
  }
  
  closeModal() {
    this.viewController.dismiss();
  }

}
