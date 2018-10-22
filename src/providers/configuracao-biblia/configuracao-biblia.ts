import { Injectable } from '@angular/core';
import { Livro, Capitulo, Biblia, Versiculo } from "../../models/Biblia";
import { ConstantesProvider } from '../constantes/constantes';
import { Storage } from '@ionic/storage';



@Injectable()
export class ConfiguracaoBibliaProvider {

  biblia: Biblia = null;
  livros: Livro[];
  
  constructor(private storage: Storage, private constantes: ConstantesProvider) { 
    
  } 

  configurarBiblia(bibliaParam: string){
    this.livros = new Array();
    this.biblia = new Biblia();
   
    let x = JSON.parse(bibliaParam);

    JSON.parse(x).forEach(livro => {
      this.popularArrayLivros(livro);
    });

    this.biblia.livros = this.livros;
    
  }

  popularArrayLivros(livroParam) {
    let livro = new Livro();
    livro.abreviatura = livroParam.abbrev;
    livro.nome = livroParam.name;

    livroParam.chapters.forEach(capitulo => {
      livro.capitulos.push(this.cadCapitulo(capitulo));
    });

    this.livros.push(livro);
  }

  cadCapitulo(arrayVersiculos) {
    let capitulo = new Capitulo();
    arrayVersiculos.forEach(versiculoStr => {
      capitulo.versiculos.push(new Versiculo(versiculoStr)); 
    });
     
    return capitulo;
  }

  getBiblia(){
    return this.biblia;
  }
 
  salvar(){
    this.storage.set(this.constantes.BIBLIA_CHAVE, this.biblia);
  }

}