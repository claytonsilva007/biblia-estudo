import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, ActionSheetController, Events } from 'ionic-angular';
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

  totalDePaginas: number;
  unidadesLeituraPorPagina: number;
  paginaAtual: number;

  constructor(public navParams: NavParams, private navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public events: Events) {
    this.segmentoSelecionado = "hoje";
    this.unidadesLeituraAtrasadas = [];
    this.planoLeitura = new PlanoLeitura();
    this.planoLeitura = JSON.parse(JSON.stringify(this.navParams.get("planoParam")));
    this.filtrarUnidadeLeituraDiaAtual();
    this.filtrarUnidadesLeituraAtrasadas();
    this.unidadesLeitura = [];
    this.totalDePaginas = Math.round(this.planoLeitura.unidadesLeituraDiaria.length / this.unidadesLeituraPorPagina) + 1;
    this.paginaAtual = 0;
    this.unidadesLeituraPorPagina = 10;

    this.carregarPrimeirasUnidadesLeitura();
  }

  carregarPrimeirasUnidadesLeitura(){
    for(let i=0; i< this.unidadesLeituraPorPagina; i++){
      this.unidadesLeitura.push(this.planoLeitura.unidadesLeituraDiaria[i]);
    }

    this.paginaAtual += 1;

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

  doInfinite(infiniteScroll) {
    
    setTimeout(() => {
      let result = this.planoLeitura.unidadesLeituraDiaria.slice(this.paginaAtual * this.unidadesLeituraPorPagina);

      for (let i = 0; i < this.unidadesLeituraPorPagina; i++) {
        if (result[i] != undefined) {
          this.unidadesLeitura.push(result[i]);
        }
      }

      this.paginaAtual += 1;

      infiniteScroll.complete();
    }, 400);
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Opçoes do Plano de Leitura',
      buttons: [
        {
          text: 'Reiniciar Plano de Leitura',
          role: 'destructive',
          handler: () => {
            this.events.publish('planoLeitura:reiniciar', this.planoLeitura);
            this.unidadeLeituraDiaAtual.segmentosLeituraDiaria.forEach(s => s.statusLeitura = false);
          }
        },
        {
          text: 'Reprogramar leituras atrasadas',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Cancelar notificações',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Emitir notificações',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

}

