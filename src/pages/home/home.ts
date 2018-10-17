import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Biblia, Livro, Capitulo, Versiculo } from '../../models/Biblia';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  segmentoSelecionado: string = "livros";
  abaLivroDescricao: string = "Livros"
  abaCapituloDescricao: string = "Capítulos";
  livroSelecionado: Livro = null;
  capituloSelecionado: Capitulo = null;
  currentSelected: number;
  versiculosSelecionados: number[];
  foiSelecionado: boolean = false;

  constructor(public navCtrl: NavController, public bibliaProvider: ConfiguracaoBibliaProvider) {
    this.livroSelecionado = this.bibliaProvider.getBiblia().livros[0];
    this.capituloSelecionado = this.livroSelecionado.capitulos[0];
    this.versiculosSelecionados = new Array();
  } 

  atualizarSegmentoCapitulos(livroParam: Livro){
    this.livroSelecionado = livroParam;
    this.abaLivroDescricao = this.livroSelecionado.nome;
    this.segmentoSelecionado = "capitulos";
    this.abaCapituloDescricao = "Capítulos";
  }

  atualizarSegmentoVersiculos(capituloParam: Capitulo, index: number){
    this.capituloSelecionado = capituloParam;
    this.segmentoSelecionado = "versiculos";
    this.abaCapituloDescricao = "Capítulo: " + index;
  }

  pressEvent(e, versiculo: Versiculo) {
    if (versiculo.backgroundColor === "#FFFFFF"){ // cor padrão
      versiculo.backgroundColor = "#DCDCDC"; // cor da seleçao
    } else {
      versiculo.backgroundColor = "#FFFFFF";
    }
  }

  existemVersiculosSelecionados(): boolean{
    let retorno: boolean = false; 
    if(this.capituloSelecionado !== null){
      if (this.capituloSelecionado.versiculos.filter(versiculoLoop => versiculoLoop.backgroundColor === "#DCDCDC").length > 0){
        retorno = true;
      }
  }
    return retorno;
  }

  setarCor(cor:string){
    if(this.existemVersiculosSelecionados){
      this.capituloSelecionado.versiculos
        .filter(versiculoLoop => versiculoLoop.backgroundColor === "#DCDCDC")
            .forEach(versiculoLoop => versiculoLoop.setCor(cor));
    }
  }
  
}
