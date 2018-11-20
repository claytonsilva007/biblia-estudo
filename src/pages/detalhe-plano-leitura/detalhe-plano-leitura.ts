import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, ActionSheetController, Events, ToastController, Platform } from 'ionic-angular';
import { PlanoLeitura, UnidadesLeituraDiaria, SegmentoLeituraDiaria } from '../../models/PlanosLeitura';
import { PainelPlanoLeituraPage } from '../painel-plano-leitura/painel-plano-leitura';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { PlanosLeituraPage } from '../planos-leitura/planos-leitura';
import { ConstantesProvider } from '../../providers/constantes/constantes';
import { Storage } from '@ionic/storage';


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
  notificacoeAtivas: boolean; 

  constructor(public navParams: NavParams, private navCtrl: NavController, public actionSheetCtrl: ActionSheetController, 
                private toastCtrl: ToastController, public events: Events, private bibliaProvider: ConfiguracaoBibliaProvider,
    private storage: Storage, private constantes: ConstantesProvider, private platform: Platform) {

    this.notificacoeAtivas = false;
    
    this.storage.get(this.constantes.CHAVE_PREFERENCIAS_NOTIFICACOES).then( response => {
      this.notificacoeAtivas = response;
    });

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

    if (this.platform.is('android')) {
      events.subscribe('planoLeitura:incrementar', () => {
        this.filtrarUnidadesLeituraAtrasadas();
      });
    }
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

    if(this.planoLeitura.ativo){
      this.unidadesLeituraAtrasadas = this.planoLeitura.unidadesLeituraDiaria
        .filter(uld => this.dataEhAnteriorHoje(uld.dataParaLeitura))
        .filter(uld => this.verificaAtrasosSegmento(uld.segmentosLeituraDiaria));
    }
  }

  filtrarUnidadesLeituraPendentes(): UnidadesLeituraDiaria[] {

    return this.planoLeitura.unidadesLeituraDiaria
      .filter(uld => !this.dataEhAnteriorHoje(uld.dataParaLeitura))
      .filter(uld => this.verificaAtrasosSegmento(uld.segmentosLeituraDiaria));

  }

  filtrarUnidadesLeituraLidas(): UnidadesLeituraDiaria[] {

    return this.planoLeitura.unidadesLeituraDiaria
      .filter(uld => this.dataEhAnteriorHoje(uld.dataParaLeitura))
      .filter(uld => this.verificaSegmentoLido(uld.segmentosLeituraDiaria));

  }

  verificaAtrasosSegmento(sld: SegmentoLeituraDiaria[]){
     if(sld.filter(s => s.statusLeitura === false).length > 0){
       return true;
     } else {
       return false;
     }
  }

  verificaSegmentoLido(sld: SegmentoLeituraDiaria[]) {
    if (sld.filter(s => s.statusLeitura === false).length === 0) {
      return true;
    } else {
      return false;
    }
  }

  dataEhAnteriorHoje(data: Date) {

    let ehAnterior = false;
    this.dataSegmentoLeitura = new Date(data);
    this.dataHoje = new Date(new Date().getTime());

    if (this.dataSegmentoLeitura.getFullYear() <= this.dataHoje.getFullYear() 
          && this.dataSegmentoLeitura.getMonth() <= this.dataHoje.getMonth() 
          && this.dataSegmentoLeitura.getDate() < this.dataHoje.getDate()) {
            
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
    
    let unidadesLeitura: UnidadesLeituraDiaria[] = [];
    let unidadesLeituraLidas = this.filtrarUnidadesLeituraLidas();
    let unidadesLeituraPendentes = this.filtrarUnidadesLeituraPendentes();
    
    let buttons: any[] = [];
    
    buttons.push({
      text: 'Reiniciar Plano de Leitura',
      role: 'destructive',
      handler: () => {
        this.events.publish('planoLeitura:reiniciar', this.planoLeitura);
        this.unidadeLeituraDiaAtual.segmentosLeituraDiaria.forEach(s => s.statusLeitura = false);
      }
    });

    buttons.push({
      text: 'Reprogramar leituras atrasadas',

      handler: () => {
        unidadesLeitura = unidadesLeituraLidas.concat(this.unidadesLeituraAtrasadas, unidadesLeituraPendentes);
        this.events.publish('planoLeitura:reprogramar', this.planoLeitura, unidadesLeitura);
        this.filtrarUnidadeLeituraDiaAtual();
        this.filtrarUnidadesLeituraAtrasadas();
        this.presentToast("Suas leituras atrasadas foram reprogramadas!");
      }
    });

    // ALTERNANDO A EXIBIÇÃO DOS BOTÕES DE ACORDO COM A EXISTÊNCIA DE NOTIFICAÇÕES ATIVAS/INATIVAS    
    if (this.notificacoeAtivas) {
      buttons.push({
        text: 'Cancelar notificações',
        handler: () => {
          this.events.publish('planoLeitura:cancelarLocalNotification', this.planoLeitura);
          this.presentToast("As notificações do Plano de Leitura " + this.planoLeitura.titulo + " foram canceladas!");
          this.notificacoeAtivas = false;
        }
      });
    } else {
      buttons.push({
        text: 'Ativar notificações',
        handler: () => {
          this.events.publish('planoLeitura:reiniciarLocalNotification', this.planoLeitura);
          this.presentToast("As notificações do Plano de Leitura " + this.planoLeitura.titulo + " foram ativadas!");
          this.notificacoeAtivas = true;
        }
      });
    }       

    buttons.push({
      text: 'Abandonar Plano de Leitura',
      handler: () => {
        this.events.publish('planoLeitura:cancelarLocalNotification', this.planoLeitura);
        this.abandonarPlanoLeitura(this.planoLeitura);
        this.presentToast("O Plano de Leitura " + this.planoLeitura.titulo + " abandonado com sucesso!");
      }
    });

    buttons.push({
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {

      }
    });  

    let actionSheet = this.actionSheetCtrl.create({
        title: 'Opções do Plano de Leitura ' + this.planoLeitura.titulo,
        buttons
    });

    actionSheet.present();
  }

  abandonarPlanoLeitura(planoLeitura: PlanoLeitura){
    this.bibliaProvider.biblia.planosDeLeitura.filter(p => p.titulo === planoLeitura.titulo)[0].ativo = false;
    this.planoLeitura.ativo = false;
    this.unidadesLeituraAtrasadas = [];

    this.bibliaProvider.biblia.planosDeLeitura
    .filter(p => p.titulo === planoLeitura.titulo)[0].unidadesLeituraDiaria
      .forEach(uld => {
        uld.dataParaLeitura = null;
        uld.segmentosLeituraDiaria.forEach(s => {
          s.statusLeitura = false;
        });
      });

      this.navCtrl.push(PlanosLeituraPage);
  }

  presentToast(mensagem: string) {
    let toast = this.toastCtrl.create({
      message: mensagem,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      
    });

    toast.present();
  }

}

