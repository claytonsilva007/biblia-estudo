import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { PlanoLeitura } from '../../models/PlanosLeitura';


@IonicPage()
@Component({
  selector: 'page-modal-comentarios-post',
  templateUrl: 'modal-comentarios-post.html',
})
export class ModalComentariosPostPage {

  planoLeitura: PlanoLeitura;
  comentario: string;
  tituloPagina: string = "Comentários";

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.planoLeitura = this.navParams.get("planoLeitura");  
    console.log(this.planoLeitura.titulo);
    this.tituloPagina = this.planoLeitura.titulo;
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

}
