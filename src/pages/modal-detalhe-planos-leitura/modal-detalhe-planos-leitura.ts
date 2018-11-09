import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';

@IonicPage()
@Component({
  selector: 'page-modal-detalhe-planos-leitura',
  templateUrl: 'modal-detalhe-planos-leitura.html',
})
export class ModalDetalhePlanosLeituraPage {

  constructor(public navParams: NavParams, private bibliaProvider: ConfiguracaoBibliaProvider, private viewCtrl: ViewController) {
  
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }
  
}
