import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { Favoritos } from '../../models/Favoritos';
import { Storage } from '@ionic/storage';
import { ConstantesProvider } from '../../providers/constantes/constantes';
import { Versiculo } from '../../models/Biblia';

@IonicPage()
@Component({
  selector: 'page-anotacoes',
  templateUrl: 'anotacoes.html',
})
export class AnotacoesPage {

  todosFavoritosList: Favoritos[];

  constructor(public bibliaProvider: ConfiguracaoBibliaProvider, private storage: Storage, public constantes: ConstantesProvider) {
    this.todosFavoritosList = [];
    this.consultarTodosFavoritos();
  }

  getTextoVersiculo(chave: string): string {
    let versiculo: Versiculo = this.bibliaProvider.getVersiculo(chave);
    
    if(versiculo !== undefined){
      return versiculo.texto;
    }   
    
  }

  getLivroCapVersic(chave: string): string{
    return this.bibliaProvider.getLivroCapVersic(chave);
  }

  consultarTodosFavoritos() {
    this.storage.get(this.constantes.CHAVE_FAVORITOS).then(result => {
      if(result !== null && result !== undefined){
        this.todosFavoritosList = result;
      }
    });
  }

}
