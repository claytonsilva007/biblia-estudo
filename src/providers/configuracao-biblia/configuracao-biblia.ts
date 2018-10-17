import { Injectable } from '@angular/core';
import * as jsonFile from "../../../src/assets/data/biblia.json";
import { Livro, Capitulo, Biblia, Versiculo } from "../../models/Biblia";


@Injectable()
export class ConfiguracaoBibliaProvider {

  bibliaStr: string = JSON.stringify(jsonFile);

  biblia: Biblia = null;
  livros: Livro[];

  constructor() { }

  configurarBiblia(){
    this.livros = new Array();
    this.biblia = new Biblia();

    JSON.parse(this.bibliaStr).forEach(livro => {
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
    if (this.biblia == null){
      this.configurarBiblia();
    }
    return this.biblia;
  }
}