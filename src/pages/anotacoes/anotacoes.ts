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
  favoritosFiltro: Favoritos[];
  exibirBtnLimparFiltro: boolean;

  constructor(public bibliaProvider: ConfiguracaoBibliaProvider, private storage: Storage, public constantes: ConstantesProvider) {
    
    this.todosFavoritosList = [];
    this.favoritosFiltro = [];
    this.exibirBtnLimparFiltro = false;
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

  /**Refatorar a recuperação da cor após refactoring da persistência dos livros */
  consultarTodosFavoritos() {
    this.storage.get(this.constantes.CHAVE_FAVORITOS).then(result => {
      if(result !== null && result !== undefined){
        this.todosFavoritosList = result;
        this.favoritosFiltro = this.todosFavoritosList;
      }
    });

  }

  getDescricaoCompletaVersiculo(versiculo: Versiculo): string{
    return this.bibliaProvider.getDescricaoCompletaVersiculo(versiculo);
  }

  filtrarFavoritos(cor: string){
    this.todosFavoritosList = this.todosFavoritosList.filter(f => f.cor === cor);
    this.exibirBtnLimparFiltro = true;
  }

  limparFiltro(){
    this.todosFavoritosList = this.favoritosFiltro;
    this.exibirBtnLimparFiltro = false;
  }

  getDataFavorito(versiculo: Versiculo): string{
    let dataRetorno = "";
    this.todosFavoritosList.forEach(f => {
      let chave = this.bibliaProvider.getChave(versiculo);
      if(f.chave === chave){
        dataRetorno = f.data;
      }
    });

    return dataRetorno;
  }

  excluirFavorito(favorito: Favoritos){
    let index = this.todosFavoritosList.findIndex(x => x.chave === favorito.chave);
    this.todosFavoritosList.splice(index);
    this.todosFavoritosList.forEach(f => console.log(f));
    this.storage.set(this.constantes.CHAVE_FAVORITOS, this.todosFavoritosList);
  }

}
