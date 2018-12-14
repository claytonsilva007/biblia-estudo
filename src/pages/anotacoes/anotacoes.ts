import { Component } from '@angular/core';
import { IonicPage, Config } from 'ionic-angular';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { Versiculo } from '../../models/Biblia';
import { QueryProvider } from '../../providers/consulta-versiculo/query';

@IonicPage()
@Component({
  selector: 'page-anotacoes',
  templateUrl: 'anotacoes.html',
})
export class AnotacoesPage {

  verciculosComentados: Versiculo[];
  
  constructor(public query: QueryProvider, public bibliaProvider: ConfiguracaoBibliaProvider) {
    this.verciculosComentados = [];
    this.verciculosComentados = this.query.filtrarVersiculosComentados();  
  }

  getDescricaoCompletaVersiculo(versiculo: Versiculo): string{
    return this.bibliaProvider.getDescricaoCompletaVersiculo(versiculo);
  }

  editarComentario(versiculo: Versiculo){

  }

}
