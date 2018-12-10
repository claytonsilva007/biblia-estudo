import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { Versiculo } from '../../models/Biblia';

@IonicPage()
@Component({
  selector: 'page-anotacoes',
  templateUrl: 'anotacoes.html',
})
export class AnotacoesPage {

  todosFavoritosList: Versiculo[];

  constructor(public bibliaProvider: ConfiguracaoBibliaProvider) {
    this.todosFavoritosList = [];
    this.todosFavoritosList = this.bibliaProvider.consultarTodosFavoritos();
  }

  getDescricaoVersiculo(versiculo: Versiculo): string{
    return this.bibliaProvider.getDescricaoCompletaVersiculo(versiculo);
  }
  
}
