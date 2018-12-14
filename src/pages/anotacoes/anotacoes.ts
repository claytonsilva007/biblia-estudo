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
  versiculosFiltro: Versiculo[];

  constructor(public bibliaProvider: ConfiguracaoBibliaProvider, private storage: Storage, public constantes: ConstantesProvider) {
    
    this.todosFavoritosList = [];
    this.versiculosList = [];
    this.versiculosFiltro = [];

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
    let versiculo: Versiculo;
    this.storage.get(this.constantes.CHAVE_FAVORITOS).then(result => {
      if(result !== null && result !== undefined){
        this.todosFavoritosList = result;

        this.todosFavoritosList.forEach(f => {
          versiculo = this.getVersiculo(f.chave);
          versiculo.backgroundColor = f.cor;
          this.versiculosList.push(versiculo);
        });
      }
    });

    this.versiculosFiltro = this.versiculosList;
  }

  getDescricaoCompletaVersiculo(versiculo: Versiculo): string{
    return this.bibliaProvider.getDescricaoCompletaVersiculo(versiculo);
  }

  filtrarFavoritos(cor: string){
    let favAux = this.todosFavoritosList.filter(f => f.cor === cor);
    this.versiculosList = [];
    favAux.forEach(f => this.versiculosList.push(this.getVersiculo(f.chave)));
  }

  limparFiltro(){
    this.versiculosList = this.versiculosFiltro;
  }

  exibirBotaoLimparFiltro(): boolean{
    let podeExibirBotao = false;
    
    if(this.versiculosList.length !== this.versiculosFiltro.length){
      podeExibirBotao = true;
    }

    return podeExibirBotao;

  }

}
