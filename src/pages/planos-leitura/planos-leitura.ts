import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { PlanoLeitura } from '../../models/PlanosLeitura';



@IonicPage()
@Component({
  selector: 'page-planos-leitura',
  templateUrl: 'planos-leitura.html',
})
export class PlanosLeituraPage {
  planosLeitura: PlanoLeitura[];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private bibliaProvider: ConfiguracaoBibliaProvider) {
    this.planosLeitura = [];
    this.planosLeitura = this.bibliaProvider.biblia.planosDeLeitura;
  }

}
