import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { PlanoLeitura, UnidadesLeituraDiaria, SegmentoLeituraDiaria } from '../../models/PlanosLeitura';


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

  constructor(public navParams: NavParams, private bibliaProvider: ConfiguracaoBibliaProvider) {
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

  ionViewDidLoad() {
    
  }

}

