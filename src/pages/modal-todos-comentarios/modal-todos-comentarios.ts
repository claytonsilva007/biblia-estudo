import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-todos-comentarios',
  templateUrl: 'modal-todos-comentarios.html',
})
export class ModalTodosComentariosPage {

  comentarios: string[];
  titulo: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewController: ViewController) {
    this.comentarios = new Array();
    this.titulo = "";
  }

  ionViewDidLoad() {
    this.comentarios = this.navParams.get("comentariosParam");
    this.titulo = this.navParams.get("titulo");
  }

  closeModal() {
    this.viewController.dismiss({"qtdeComentarios": this.comentarios.length});
  }

  excluirComentario(index: number){
    this.comentarios.splice(index, 1);
    
    if(this.comentarios.length == 0){
      this.closeModal();
    }
  }

  public options: Object = {
    placeholder: "Edit Me",
    events: {
      'froalaEditor.focus': function (e, editor) {
        console.log(editor.selection.get());
      }
    }
  }

}
