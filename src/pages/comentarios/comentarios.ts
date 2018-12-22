import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, ModalController } from 'ionic-angular';
import { Biblia, Versiculo } from '../../models/Biblia';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';

@IonicPage()
@Component({
  selector: 'page-comentarios',
  templateUrl: 'comentarios.html',
})
export class ComentariosPage {

  biblia: Biblia = new Biblia();
  comentario: string; 
  titulo: string;
  versiculo: Versiculo;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, 
              public toastCtrl: ToastController, public bibliaProvider: ConfiguracaoBibliaProvider, 
              public modalCtrl: ModalController) {

    this.comentario = "";
    this.titulo = "";
  }

  ionViewDidLoad() {
    this.versiculo = new Versiculo();
    this.versiculo  = this.navParams.get("versiculo");
    this.comentario = this.versiculo.comentariosUsuario[0]; 
    this.titulo = this.bibliaProvider.getDescricaoCompletaVersiculo(this.versiculo);
  }

  cancelar(){
    this.viewCtrl.dismiss({ "comentario": this.comentario});
  }

  salvar(){
    if(this.comentario !== ""){
      this.viewCtrl.dismiss({ comentario: this.comentario });
    } else {
      const toast = this.toastCtrl.create({
        message: 'Adicione algum comentário!',
        duration: 3000
      });
      toast.present();
    }

  }

  excluirComentario(){
     this.bibliaProvider.biblia
        .livros[this.versiculo.codigoLivro]
        .capitulos[this.versiculo.codigoLivro]
        .versiculos[this.versiculo.codigoVersiculo]
        .comentariosUsuario.splice(0);

        this.viewCtrl.dismiss({ comentario: null });
     
  }

}

