import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { PlanoLeitura } from '../../models/PlanosLeitura';
import { ModalComentariosPostPage } from '../modal-comentarios-post/modal-comentarios-post';



@IonicPage()
@Component({
  selector: 'page-planos-leitura',
  templateUrl: 'planos-leitura.html',
})
export class PlanosLeituraPage {
  planosLeitura: PlanoLeitura[];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private bibliaProvider: ConfiguracaoBibliaProvider, public modalCtrl: ModalController) {
    this.planosLeitura = [];
    this.planosLeitura = this.bibliaProvider.biblia.planosDeLeitura;
  }

  comentar(planoLeitura: PlanoLeitura){
    let modal = this.modalCtrl.create(ModalComentariosPostPage, {planoLeitura: planoLeitura}).present();
  }

  curtir(planoLeitura: PlanoLeitura){
    planoLeitura.likes++;
  }

  compartilhar(planoLeitura: PlanoLeitura){
    planoLeitura.compartilhamentos++;
  }

}
