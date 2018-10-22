import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, ModalController } from 'ionic-angular';
import { Biblia, Livro, Capitulo, Versiculo } from '../../models/Biblia';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { ModalTodosComentariosPage } from '../modal-todos-comentarios/modal-todos-comentarios';

@IonicPage()
@Component({
  selector: 'page-comentarios',
  templateUrl: 'comentarios.html',
})
export class ComentariosPage {

  biblia: Biblia = new Biblia();
  comentario: string;
  nomeLivro: string;
  indexLivro: number;
  numCapitulo: number;
  numVersiculo: number;
  qtdeComentarios: number;
  comentariosUsuarios: string[];
  exibirTodosOsComentarios: boolean;
  tituloParam: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController, public bibliaProvider: ConfiguracaoBibliaProvider, public modalCtrl: ModalController) {
    this.comentario = "";
    this.exibirTodosOsComentarios = false;
    this.tituloParam = "";
  }

  ionViewDidLoad() {
    this.nomeLivro = this.navParams.get("nomeLivro");
    this.indexLivro = this.navParams.get("indexLivro");
    this.numCapitulo = this.navParams.get("numCapitulo")
    this.numVersiculo = this.navParams.get("numVersiculo");    
    this.qtdeComentarios = this.navParams.get("qtdeComentarios"); 
    this.carregarComentarios();   
  }

  cancelar(){
    this.viewCtrl.dismiss({ "comentario": ""});
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

    this.bibliaProvider.salvar();

  }

  carregarComentarios(){
    this.comentariosUsuarios = new Array();
    if(this.qtdeComentarios > 0){
      let livro: Livro = this.bibliaProvider.getBiblia().livros[this.indexLivro];
      let capitulo: Capitulo = livro.capitulos[this.numCapitulo - 1];
      let versiculo: Versiculo = capitulo.versiculos[this.numVersiculo - 1];      
      this.comentariosUsuarios = versiculo.comentariosUsuario;
    }
  }

  exibirComentarios(){
    this.tituloParam = "Comentários: " + this.nomeLivro + " " + this.numCapitulo + "." + this.numVersiculo; 
    let modalTodosComentarios = this.modalCtrl.create(ModalTodosComentariosPage, {"comentariosParam": this.comentariosUsuarios, "titulo": this.tituloParam});
    modalTodosComentarios.present();
  }

}

