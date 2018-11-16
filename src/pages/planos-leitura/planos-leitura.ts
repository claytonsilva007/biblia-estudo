import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, Events } from 'ionic-angular';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { PlanoLeitura, UnidadesLeituraDiaria } from '../../models/PlanosLeitura';
import { ModalComentariosPostPage } from '../modal-comentarios-post/modal-comentarios-post';
import { DetalhePlanoLeituraPage } from '../detalhe-plano-leitura/detalhe-plano-leitura';

@IonicPage()
@Component({
  selector: 'page-planos-leitura',
  templateUrl: 'planos-leitura.html',
})
export class PlanosLeituraPage {
  
  planosLeitura: PlanoLeitura[];
  percentualCompletude: number;
  qtdeSegmentos: number;
  qtdeSegmentosLidos: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private bibliaProvider: ConfiguracaoBibliaProvider, 
    public modalCtrl: ModalController, private toastCtrl: ToastController, public events: Events) {

    this.planosLeitura = [];
    this.planosLeitura = this.bibliaProvider.biblia.planosDeLeitura;
    this.qtdeSegmentos = 0;
    this.qtdeSegmentosLidos = 0;
    this.percentualCompletude = 0;

    events.subscribe('planoLeitura:incrementar', () => {
      this.calcularPercentualCompletude();
    });

    events.subscribe('planoLeitura:reiniciar', (planoLeitura) => {
      this.reiniciarPlanoLeitura(planoLeitura);
    });

    events.subscribe('planoLeitura:reprogramar', (planoLeitura, unidadesLeituraAtrasadas) => {
      this.reprogramarDatasAtrasadas(planoLeitura, unidadesLeituraAtrasadas);
    });

  }

  iniciarPlanoLeitura(planoLeitura: PlanoLeitura){
    
    planoLeitura.ativo = true;
    var currentDate = new Date(new Date().getTime());
    currentDate.setDate(currentDate.getDate() -10);

    planoLeitura.unidadesLeituraDiaria.forEach( (uld) => {
      let data = currentDate.setDate(currentDate.getDate() + 1);
      uld.dataParaLeitura = new Date(data);
      
      uld.segmentosLeituraDiaria.forEach(sld => {
        sld.descricaoSegmento = this.formatarDescricaoSegmento(sld.segmentoLeitura);
      });

    }); 
    
    this.navegarParaDetalhePlanoLeitura(planoLeitura);
    
  }

  reiniciarPlanoLeitura(planoLeitura: PlanoLeitura){
    
    var currentDate = new Date(new Date().getTime());
    currentDate.setDate(currentDate.getDate() - 1);

    this.bibliaProvider.biblia.planosDeLeitura
          .filter(plano => plano.titulo === planoLeitura.titulo)[0].unidadesLeituraDiaria
          .forEach(uld => {
            let data = currentDate.setDate(currentDate.getDate() + 1);
            uld.dataParaLeitura = new Date(data);
            
            uld.segmentosLeituraDiaria.forEach(s => {
              s.statusLeitura = false;
            })
          });

    this.percentualCompletude = 0;
    this.exibirMensagem("Plano de Leitura reiniciado com sucesso!");
    
  }

  /**
   * 
   * @param planoLeitura 
   * @param unidadesLeituraAtrasadas 
   */
  reprogramarDatasAtrasadas(planoLeitura: PlanoLeitura, unidadesLeitura: UnidadesLeituraDiaria[]){
    this.bibliaProvider.biblia.planosDeLeitura.filter(p => p.titulo === planoLeitura.titulo)[0].unidadesLeituraDiaria = unidadesLeitura;
    
    var currentDate = new Date(new Date().getTime());
    currentDate.setDate(currentDate.getDate() - 1);

    let x = this.bibliaProvider.biblia.planosDeLeitura
      .filter(p => p.titulo === planoLeitura.titulo)[0].unidadesLeituraDiaria.filter(uld => {
        if(uld.segmentosLeituraDiaria.filter(sld => sld.statusLeitura === false)){
          return uld;
        }
      }).forEach(uld => {

        let data = currentDate.setDate(currentDate.getDate() + 1);
        uld.dataParaLeitura = new Date(data);

      });
console.log(x);
  }

  visualisarDetalhesPlanoLeitura(planoLeitura: PlanoLeitura){
    planoLeitura.unidadesLeituraDiaria.forEach((uld) => {
      uld.segmentosLeituraDiaria.forEach(sld => {
        sld.descricaoSegmento = this.formatarDescricaoSegmento(sld.segmentoLeitura);
      });
    }); 

    this.navCtrl.push(DetalhePlanoLeituraPage, { planoParam: planoLeitura });
  }

  formatarDescricaoSegmento(descricaoCompacta: string): string {
    let auxDesc: string[] = descricaoCompacta.split(";");
    let indexLivro: number = Number(auxDesc[0]) - 1;
    let indexCapitulo: number = Number(auxDesc[1]) - 1;
    let descricaoVersic: string = "";

    if(auxDesc[2]==="0"){
      let num = this.bibliaProvider.biblia.livros[indexLivro].capitulos[indexCapitulo].versiculos.length;
      descricaoVersic = descricaoVersic.concat("1-", num.toString());
    } else {
      descricaoVersic = auxDesc[2];
    }

    let nomeLivro: string = this.bibliaProvider.biblia.livros[indexLivro].nome.concat(" ", auxDesc[1], ".", descricaoVersic);
    return nomeLivro;
  }

  calcularPercentualCompletude(){
    
    this.qtdeSegmentos = 0;
    this.qtdeSegmentosLidos = 0;
    
    this.bibliaProvider.biblia.planosDeLeitura
          .filter(p => p.ativo)
          .forEach(p => {
            p.unidadesLeituraDiaria.forEach(u => { 
               this.incrementarTotalSegmentos(u.segmentosLeituraDiaria.length);
               this.incrementarSegmentosLidos(u.segmentosLeituraDiaria.filter(s => s.statusLeitura === true).length);
            });
          });

          
     if(this.qtdeSegmentosLidos !== 0 ){
      this.percentualCompletude = Math.round((this.qtdeSegmentosLidos / this.qtdeSegmentos) * 100);     
     } 
     
  }

  incrementarTotalSegmentos(i: number){
    this.qtdeSegmentos = this.qtdeSegmentos + i;
  }

  incrementarSegmentosLidos(i: number){
    this.qtdeSegmentosLidos = this.qtdeSegmentosLidos + i;
  }

  navegarParaDetalhePlanoLeitura(planoLeitura: PlanoLeitura){
    this.navCtrl.push(DetalhePlanoLeituraPage, { planoParam: planoLeitura });
  }

  comentar(planoLeitura: PlanoLeitura){
    this.modalCtrl.create(ModalComentariosPostPage, {planoLeitura: planoLeitura}).present();
  }

  curtir(planoLeitura: PlanoLeitura){
    planoLeitura.likes++;
  }

  compartilhar(planoLeitura: PlanoLeitura){
    planoLeitura.compartilhamentos++;
  }

  ionViewDidLoad(){
    this.calcularPercentualCompletude();
  }

  exibirMensagem(mensagem: string){
    let toast = this.toastCtrl.create({
      message: mensagem,
      duration: 4000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

}