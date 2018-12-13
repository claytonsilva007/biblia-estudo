import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { Versiculo } from '../../models/Biblia';
import { Favoritos } from '../../models/Favoritos';

@IonicPage()
@Component({
  selector: 'page-anotacoes',
  templateUrl: 'anotacoes.html',
})
export class AnotacoesPage {

  todosFavoritosList: Favoritos[];

  constructor(public bibliaProvider: ConfiguracaoBibliaProvider) {
    this.todosFavoritosList = [];
    this.todosFavoritosList = this.bibliaProvider.consultarTodosFavoritos();
  }

  getTextoVersiculo(chave: string): string{
    return this.bibliaProvider.getTextoVersiculo(chave);
  }

}
