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
      BibliaNovoFormato.livros.push(this.getLivroNovoFormato(livro));// = this.getArrayLivros(livro);
    });
    
    return BibliaNovoFormato;
  }


  private getLivroNovoFormato(livroParam): Livro {
    let livro = new Livro();

    livro.abreviatura = livroParam.abreviatura;
    livro.nome = livroParam.nome;
  
    livroParam.capitulos.forEach(capitulo => { 
      livro.capitulos.push(this.cadCapitulo(capitulo));
    });
    
    return livro;
   
  }

  configurarBiblia(bibliaParam){
    if(bibliaParam.livros === undefined){
      let bibliaAux = JSON.parse(bibliaParam);       
      bibliaAux.livros.forEach(x => this.popularArrayLivros(x)); 
    } else {
      bibliaParam.livros.forEach(x => this.popularArrayLivros(x)); 
    }
  }

  popularArrayLivros(livroParam) {
    let livro = new Livro();
    let capitulo = new Capitulo();

    livro.abreviatura = livroParam.abreviatura;
    livro.nome = livroParam.nome;
  
    livroParam.capitulos.forEach(capitulo => { 
      livro.capitulos.push(this.cadCapitulo(capitulo));
    });

    this.biblia.livros.push(livro);
   
  }

  cadCapitulo(capituloParam) {
    let capituloTemp: Capitulo;
    let versiculotemp: Versiculo;
    capituloTemp = new Capitulo();

    if(capituloParam.versiculos !== undefined){
      capituloTemp = capituloParam;
    } else {
      capituloParam.forEach(textoVersiculo => {
        versiculotemp = new Versiculo();
        versiculotemp.texto = textoVersiculo;
        capituloTemp.versiculos.push(versiculotemp);
      });
    }
         
    return capituloTemp;
  }  

  cadastrarCapitulo(capitulo): Capitulo{
    let capituloTemp = new Capitulo();

    capitulo.versiculos.forEach(textoVersiculo => {
      this.instanciarVersiculos(textoVersiculo);
    });

    return capituloTemp;
  }

  instanciarVersiculos(texto: string): Versiculo{
    let versiculo = new Versiculo();
    versiculo.texto = texto;  
    return versiculo;
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