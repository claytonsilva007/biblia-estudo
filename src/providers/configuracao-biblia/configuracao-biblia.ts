import { Injectable, ViewChild } from '@angular/core';
import { Livro, Capitulo, Biblia, Versiculo } from "../../models/Biblia";
import { ConstantesProvider } from '../constantes/constantes';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';



@Injectable()
export class ConfiguracaoBibliaProvider {

  biblia: Biblia = null;
  versiculos: Versiculo[] = [];
  
  constructor(private storage: Storage, private constantes: ConstantesProvider) { 
    this.biblia = new Biblia();
  } 

  getBibliaFormatada(bibliaFormatoWeb: string): Biblia{
    let bibliaAux = JSON.parse(bibliaFormatoWeb); 
    let BibliaNovoFormato: Biblia = new Biblia();

    bibliaAux.livros.forEach(livro => {
      BibliaNovoFormato.livros.push(this.getLivroNovoFormato(livro));
    });
    
    return BibliaNovoFormato;
  }


  private getLivroNovoFormato(livroParam): Livro {
    let livro = new Livro();

    livro.abreviatura = livroParam.abreviatura;
    livro.nome = livroParam.nome;
  
    livroParam.capitulos.forEach((capitulo, index)=> { 
      livro.capitulos.push(this.cadCapitulo(capitulo, index));
    });
    
    return livro;
   
  }

  configurarBiblia(bibliaParam){
    if(bibliaParam.livros === undefined){
      let bibliaAux = JSON.parse(bibliaParam);       
      bibliaAux.livros.forEach( (livro, indexLivro) => this.popularArrayLivros(livro, indexLivro)); 
    } else {
      bibliaParam.livros.forEach((livro, indexLivro) => this.popularArrayLivros(livro, indexLivro)); 
    }
  }

  popularArrayLivros(livroParam, indexLivro: number) {
    let livro = new Livro();
    let capitulo = new Capitulo();

    livro.abreviatura = livroParam.abreviatura;
    livro.nome = livroParam.nome;
    livro.codigoLivro = indexLivro;
  
    livroParam.capitulos.forEach((capitulo, indexCapitulo) => { 
      livro.capitulos.push(this.cadCapitulo(capitulo, indexCapitulo));
    });

    this.biblia.livros.push(livro);
   
  }

  cadCapitulo(capituloParam, indexCapitulo: number) {
    let capituloTemp: Capitulo;
    let versiculotemp: Versiculo;
    capituloTemp = new Capitulo();

    if(capituloParam.versiculos !== undefined){
      
      capituloTemp = capituloParam;
      capituloTemp.codigoCapitulo = indexCapitulo;
      capituloTemp.versiculos.forEach( (versiculo, indexVersiculo) => {
        versiculo.codigoVersiculo = indexVersiculo;
        versiculo.codigoCapitulo = indexCapitulo;
      });

    } else {
      
      capituloParam.forEach( (textoVersiculo, indexVersiculo) => {
        versiculotemp = new Versiculo();
        versiculotemp.texto = textoVersiculo;
        versiculotemp.codigoVersiculo = indexVersiculo;
        versiculotemp.codigoCapitulo = indexCapitulo;
        capituloTemp.codigoCapitulo = indexCapitulo;
        capituloTemp.versiculos.push(versiculotemp);

      });
    }
         
    return capituloTemp;
  }  

  getBiblia(){
    return this.biblia;
  }

  setBibliaConfigurada(bibliaConfigurada: Biblia){
    this.biblia = bibliaConfigurada;
  }

  salvarBiblia(biblia: Biblia){
    this.storage.set(this.constantes.BIBLIA_CHAVE, biblia);
  }

  salvar(){
    this.storage.set(this.constantes.BIBLIA_CHAVE, this.biblia);
    //this.storage.set(this.constantes.BIBLIA_CHAVE, JSON.stringify(this.biblia));
  }

}