import { Injectable } from '@angular/core';
import * as jsonFile from "../../../src/assets/data/biblia.json";
import { Livro, Capitulo, Biblia, Versiculo } from "../../models/Biblia";
import { HttpClient } from '@angular/common/http';
import { File } from '@ionic-native/file';
import { ToastController } from 'ionic-angular';


@Injectable()
export class ConfiguracaoBibliaProvider {

  bibliaStr: string = JSON.stringify(jsonFile);
  
  biblia: Biblia = null;
  livros: Livro[];
  
  constructor(private http: HttpClient, private file: File, public toastCtrl: ToastController) { 
    //this.remover();
  }
  
  

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

  exibirMensagem(texto: string){
    const toast = this.toastCtrl.create({
      message: texto,
      duration: 3000
    });
    toast.present();
  }
  
  
}