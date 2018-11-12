import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PlanoLeitura } from '../../models/PlanosLeitura';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { ModalDetalhePlanosLeituraPage } from '../modal-detalhe-planos-leitura/modal-detalhe-planos-leitura';

@IonicPage()
@Component({
  selector: 'page-planos-leitura-ativos',
  templateUrl: 'planos-leitura-ativos.html',
})
export class PlanosLeituraAtivosPage {

  planosLeitura: PlanoLeitura[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private bibliaProvider: ConfiguracaoBibliaProvider) {
    this.planosLeitura = [];
    this.planosLeitura = this.bibliaProvider.biblia.planosDeLeitura.filter(pl => pl.ativo === true);
  }

  navegarParaDetalhePlanoLeitura(planoLeitura: PlanoLeitura){
    this.navCtrl.push(ModalDetalhePlanosLeituraPage, {planoParam: planoLeitura});
  }

}
