import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';
import { PlanoLeitura, UnidadesLeituraDiaria, SegmentoLeituraDiaria } from '../../models/PlanosLeitura';
import { PainelPlanoLeituraPage } from '../painel-plano-leitura/painel-plano-leitura';


@IonicPage()
@Component({
  selector: 'page-detalhe-plano-leitura',
  templateUrl: 'detalhe-plano-leitura.html',
})
export class DetalhePlanoLeituraPage {

  planoLeitura: PlanoLeitura;
  unidadesLeitura: UnidadesLeituraDiaria[];

  unidadeLeituraDiaAtual: UnidadesLeituraDiaria;
  unidadesLeituraAtrasadas: UnidadesLeituraDiaria[];
  dataSegmentoLeitura: Date;
  dataHoje: Date;


  segmentoSelecionado: string;

  constructor(public navParams: NavParams, private navCtrl: NavController) {
    this.segmentoSelecionado = "hoje";
    this.unidadesLeituraAtrasadas = [];
    this.planoLeitura = new PlanoLeitura();
    this.planoLeitura = JSON.parse(JSON.stringify(this.navParams.get("planoParam")));
    this.unidadesLeitura = this.planoLeitura.unidadesLeituraDiaria;
    this.filtrarUnidadeLeituraDiaAtual();
    this.filtrarUnidadesLeituraAtrasadas();
  }

  filtrarUnidadeLeituraDiaAtual() {
    this.unidadeLeituraDiaAtual = new UnidadesLeituraDiaria();

    this.planoLeitura.unidadesLeituraDiaria.forEach(uld => {
      if (this.recuperarLeituraDataAtual(uld.dataParaLeitura)) {
        this.unidadeLeituraDiaAtual = uld;
        return false;
      } else {
        return true;
      }
    });
  }

  recuperarLeituraDataAtual(data: Date): boolean {
    let achou: boolean = false;
    let dataHoje = new Date(new Date().getTime());
    let dataAux: Date = new Date(data);

    if (dataHoje.getDate() === dataAux.getDate() && dataHoje.getMonth() === dataAux.getMonth() && dataHoje.getFullYear() === dataAux.getFullYear()) {
      achou = true;
    }
    return achou;
  }

  filtrarUnidadesLeituraAtrasadas() {

    this.unidadesLeituraAtrasadas = this.planoLeitura.unidadesLeituraDiaria
      .filter(uld => this.dataEhAnteriorHoje(uld.dataParaLeitura))
      .filter(uld => this.verificaAtrasosSegmento(uld.segmentosLeituraDiaria));
      
  }

  verificaAtrasosSegmento(sld: SegmentoLeituraDiaria[]){
     if(sld.filter(s => s.statusLeitura === false).length > 0){
       return true;
     } else {
       return false;
     }
  }

  dataEhAnteriorHoje(data: Date) {
    
    let ehAnterior = false;
    this.dataSegmentoLeitura = new Date(data);
    this.dataHoje = new Date(new Date().getDate()+1); 

    if (this.dataSegmentoLeitura.getTime() < this.dataHoje.getTime()) {
      ehAnterior = true;
    }

    return ehAnterior;
  }


  navegarParaLeituraDiaAtual(segmentoLeitura: SegmentoLeituraDiaria){
    this.navCtrl.push(PainelPlanoLeituraPage, {"unidadeLeitura": this.unidadeLeituraDiaAtual, "segmentoLeitura": segmentoLeitura, "planoLeitura": this.planoLeitura});
  }

  navegarParaLeitura(unidadeLeitura: UnidadesLeituraDiaria, segmentoLeitura: SegmentoLeituraDiaria){
    this.navCtrl.push(PainelPlanoLeituraPage, { "unidadeLeitura": unidadeLeitura, "segmentoLeitura": segmentoLeitura, "planoLeitura": this.planoLeitura });
  }

  ionViewDidLoad() {
    
  }

}

