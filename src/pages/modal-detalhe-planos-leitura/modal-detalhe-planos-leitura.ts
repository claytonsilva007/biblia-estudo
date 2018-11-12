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
  
  unidadeLeituraDiaAtual: UnidadesLeituraDiaria;
  unidadesLeituraAtrasadas: UnidadesLeituraDiaria[];

  constructor(public navParams: NavParams, private bibliaProvider: ConfiguracaoBibliaProvider, private viewCtrl: ViewController) {
    this.planoLeitura = new PlanoLeitura();
    this.planoLeitura = JSON.parse(JSON.stringify(this.navParams.get("planoParam")));
    this.unidadesLeitura = this.planoLeitura.unidadesLeituraDiaria;
    this.filtrarUnidadeLeituraDiaAtual();
  }

  filtrarUnidadeLeituraDiaAtual(){
    this.unidadeLeituraDiaAtual = new UnidadesLeituraDiaria();

    this.planoLeitura.unidadesLeituraDiaria.forEach(uld => { 
      if(this.recuperarLeituraDataAtual(uld.dataParaLeitura)){
        this.unidadeLeituraDiaAtual = uld;
        return false;
      } else {
        return true;
      }
    });    
  }

  recuperarLeituraDataAtual(data: Date): boolean{
    let achou: boolean = false;
    let dataHoje = new Date(new Date().getTime());
    let dataAux: Date = new Date(data);

    if(dataHoje.getDate() === dataAux.getDate() && dataHoje.getMonth() === dataAux.getMonth() && dataHoje.getFullYear() === dataAux.getFullYear()){
      achou = true;
    }
    return achou;
  }

  filtrarUnidadesLeituraAtrasadas(){
    this.unidadesLeituraAtrasadas = [];
    this.planoLeitura.unidadesLeituraDiaria.forEach(uld => this.verificaSeDataEhAnterior(uld.dataParaLeitura));
  }

  verificaSeDataEhAnterior(data: Date){
    let dataAux = new Date(data);
    let dataHoje = new Date(new Date().getTime());

    if(dataAux.getTime() > dataHoje.getTime()){
      console.log("Não há atrasos.");
    }

  }

  ionViewDidEnter(){
    
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }
  
}
