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
  versiculosList: Versiculo[];

  constructor(public bibliaProvider: ConfiguracaoBibliaProvider, private storage: Storage, public constantes: ConstantesProvider) {
    
    this.todosFavoritosList = [];
    this.versiculosList = [];

    this.consultarTodosFavoritos();
  }

  getVersiculo(chave: string): Versiculo {
    let versiculo: Versiculo = this.bibliaProvider.getVersiculo(chave);
    
    if(versiculo !== undefined){
      return versiculo;
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

  getDescricaoCompletaVersiculo(versiculo: Versiculo): string{
    return this.bibliaProvider.getDescricaoCompletaVersiculo(versiculo);
  }

  filtrarFavoritos(cor: string){
    let versiculoAux: Versiculo;
    this.todosFavoritosList.forEach(f => {
      versiculoAux =  this.getVersiculo(f.chave);
      if(versiculoAux.backgroundColor === cor){
        this.versiculosList.push(versiculoAux);
      }
    });
  }

}
