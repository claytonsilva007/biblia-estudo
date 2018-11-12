import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { PlanoLeitura } from '../../models/PlanosLeitura';
import { ModalComentariosPostPage } from '../modal-comentarios-post/modal-comentarios-post';
import { ModalDetalhePlanosLeituraPage } from '../modal-detalhe-planos-leitura/modal-detalhe-planos-leitura';



@IonicPage()
@Component({
  selector: 'page-planos-leitura',
  templateUrl: 'planos-leitura.html',
})
export class PlanosLeituraPage {
  planosLeitura: PlanoLeitura[];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private bibliaProvider: ConfiguracaoBibliaProvider, 
                public modalCtrl: ModalController, private toastCtrl: ToastController) {

    this.planosLeitura = [];
    this.planosLeitura = this.bibliaProvider.biblia.planosDeLeitura;

  }

  iniciarPlanoLeitura(planoLeitura: PlanoLeitura){
    
    planoLeitura.ativo = true;
    var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

    planoLeitura.unidadesLeituraDiaria.forEach(uld => {
      let data = currentDate.setDate(currentDate.getDate() + 1);
      uld.dataParaLeitura = new Date(data);
    }); 
    
    this.modalCtrl.create(ModalDetalhePlanosLeituraPage, {planoParam: planoLeitura}).present();
    //this.exibirMensagem("Seu Plano de Leitura foi configurado com sucesso!");
    
  }

  abrirPlanoLeituraSelecionado(){
    this.modalCtrl.create(ModalDetalhePlanosLeituraPage).present();
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