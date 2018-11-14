import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, Events } from 'ionic-angular';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { PlanoLeitura } from '../../models/PlanosLeitura';
import { ModalComentariosPostPage } from '../modal-comentarios-post/modal-comentarios-post';
import { DetalhePlanoLeituraPage } from '../detalhe-plano-leitura/detalhe-plano-leitura';



@IonicPage()
@Component({
  selector: 'page-planos-leitura',
  templateUrl: 'planos-leitura.html',
})
export class PlanosLeituraPage {
  planosLeitura: PlanoLeitura[];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private bibliaProvider: ConfiguracaoBibliaProvider, 
    public modalCtrl: ModalController, private toastCtrl: ToastController, public events: Events) {

    this.planosLeitura = [];
    this.planosLeitura = this.bibliaProvider.biblia.planosDeLeitura;

  }

  iniciarPlanoLeitura(planoLeitura: PlanoLeitura){
    
    planoLeitura.ativo = true;
    var currentDate = new Date(new Date().getTime());

    planoLeitura.unidadesLeituraDiaria.forEach( (uld, index) => {
      let data = currentDate.setDate(currentDate.getDate() + index);
      uld.dataParaLeitura = new Date(data);
      
      uld.segmentosLeituraDiaria.forEach(sld => {
        sld.descricaoSegmento = this.formatarDescricaoSegmento(sld.segmentoLeitura);
      });

    }); 
    
    this.navegarParaDetalhePlanoLeitura(planoLeitura);
    
  }

  formatarDescricaoSegmento(descricaoCompacta: string): string {
    let auxDesc: string[] = descricaoCompacta.split(";");
    let indexLivro: number = Number(auxDesc[0]) - 1;
    let nomeLivro: string = this.bibliaProvider.biblia.livros[indexLivro].nome.concat(" ", auxDesc[1], ".", auxDesc[2]);
    return nomeLivro;
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