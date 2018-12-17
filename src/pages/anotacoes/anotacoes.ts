import { Component } from '@angular/core';
import { IonicPage, ModalController } from 'ionic-angular';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { Versiculo } from '../../models/Biblia';
import { QueryProvider } from '../../providers/consulta-versiculo/query';
import { ComentariosPage } from '../comentarios/comentarios';
import { ConstantesProvider } from '../../providers/constantes/constantes';

@IonicPage()
@Component({
  selector: 'page-anotacoes',
  templateUrl: 'anotacoes.html',
})
export class AnotacoesPage {

  verciculosComentados: Versiculo[];
  
  constructor(public query: QueryProvider, public bibliaProvider: ConfiguracaoBibliaProvider, 
              public modalCtrl: ModalController, public constantes: ConstantesProvider) {

    this.verciculosComentados = [];
    this.verciculosComentados = this.query.filtrarVersiculosComentados();  
  }

  ionViewDidLoad(){   
      //this.verciculosComentados = this.query.filtrarVersiculosComentados();      
  }

  getDescricaoCompletaVersiculo(versiculo: Versiculo): string{
    return this.bibliaProvider.getDescricaoCompletaVersiculo(versiculo);
  }

  editarComentario(v: Versiculo){
    let modalComentarios = this.modalCtrl.create(ComentariosPage, { 
      "qtdeComentarios": v.comentariosUsuario.length,  
      "indexLivro": v.codigoLivro,
      "nomeLivro": this.bibliaProvider.biblia.livros[v.codigoLivro].nome, 
      "numCapitulo": v.codigoCapitulo + 1, 
      "numVersiculo": v.codigoVersiculo + 1,
      "comentario": v.comentariosUsuario });

      modalComentarios.present();
      modalComentarios.onDidDismiss(data => { 

      if(data.comentario !== "" && data.comentario !== undefined && data.comentario !== null){

        this.bibliaProvider.biblia.livros[v.codigoLivro]
        .capitulos[v.codigoCapitulo + 1]
        .versiculos[v.codigoVersiculo]
        .comentariosUsuario[0] = data.comentario;

        v.comentariosUsuario = data.comentario;

        this.bibliaProvider.biblia.livros[v.codigoLivro]
        .capitulos[v.codigoCapitulo + 1]
        .versiculos[v.codigoVersiculo]
        .backgroundColor = "#EBEFF2";

        } else {
          this.bibliaProvider.biblia.livros[v.codigoLivro]
          .capitulos[v.codigoCapitulo + 1]
          .versiculos[v.codigoVersiculo]
          .backgroundColor = this.constantes.TEXTO_SEM_COR;

          let index = this.verciculosComentados.findIndex(versc => versc.texto === v.texto);
          this.verciculosComentados.splice(index);
          this.verciculosComentados = this.query.filtrarVersiculosComentados();
        } 
    });    
  }

}
