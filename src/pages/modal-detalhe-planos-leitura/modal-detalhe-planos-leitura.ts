import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { PlanoLeitura, UnidadesLeituraDiaria } from '../../models/PlanosLeitura';

@IonicPage()
@Component({
  selector: 'page-modal-detalhe-planos-leitura',
  templateUrl: 'modal-detalhe-planos-leitura.html',
})
export class ModalDetalhePlanosLeituraPage {

  planoLeitura: PlanoLeitura;
  unidadesLeitura: UnidadesLeituraDiaria[];


  constructor(public navParams: NavParams, private bibliaProvider: ConfiguracaoBibliaProvider, private viewCtrl: ViewController) {
    this.planoLeitura = new PlanoLeitura();
    this.planoLeitura = JSON.parse(JSON.stringify(this.navParams.get("planoParam")));
    this.unidadesLeitura = this.planoLeitura.unidadesLeituraDiaria;

    this.unidadesLeitura.forEach(uld => console.log(uld));

    console.log(this.planoLeitura.unidadesLeituraDiaria[0].dataParaLeitura);
  }

  ionViewDidEnter(){
    
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }
  
}
