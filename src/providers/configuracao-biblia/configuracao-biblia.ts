import { Injectable } from '@angular/core';
import { Livro, Capitulo, Biblia, Versiculo } from "../../models/Biblia";
import { ConstantesProvider } from '../constantes/constantes';
import { Storage } from '@ionic/storage';



@Injectable()
export class ConfiguracaoBibliaProvider {

  biblia: Biblia = null;
  livros: Livro[] = [];
  tipoConfig: number;
  
  versiculos: Versiculo[] = [];
  
  constructor(private storage: Storage, private constantes: ConstantesProvider) { 
    this.biblia = new Biblia();
  } 

  configurarBiblia(bibliaParam: string){        
    let bibliaAux = JSON.parse(bibliaParam);
       
    bibliaAux.livros.forEach(x => this.popularArrayLivros(x));
    //this.biblia.livros = this.livros;
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

    if(this.tipoConfig === 1){ // local
      capituloParam.versiculos.forEach(versiculo => {
        capituloParam.versiculos.push(versiculo); 
      });
    } else if(this.tipoConfig === 2){ //web
      capituloTemp = new Capitulo();
      capituloParam.forEach(textoVersiculo => {
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
 
  setTipoConfig(tipoConfigParam: number){
    this.tipoConfig = tipoConfigParam;
  }

  salvar(){
    this.storage.set(this.constantes.BIBLIA_CHAVE, this.biblia);
    //this.storage.set(this.constantes.BIBLIA_CHAVE, JSON.stringify(this.biblia));
  }

}