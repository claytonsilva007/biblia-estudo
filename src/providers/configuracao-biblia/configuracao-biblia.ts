import { Injectable, ViewChild } from '@angular/core';
import { Livro, Capitulo, Biblia, Versiculo } from "../../models/Biblia";
import { ConstantesProvider } from '../constantes/constantes';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';



@Injectable()
export class ConfiguracaoBibliaProvider {
  @ViewChild('nav') navCtrl: NavController;

  biblia: Biblia = null;
  tipoConfig: number;
  
  versiculos: Versiculo[] = [];
  
  constructor(private storage: Storage, private constantes: ConstantesProvider) { 
    this.biblia = new Biblia();
  } 

  configurarBiblia(bibliaParam: string, tipoConfigParam: number){
    this.tipoConfig = tipoConfigParam;        
    let bibliaAux = JSON.parse(bibliaParam);       
    bibliaAux.livros.forEach(x => this.popularArrayLivros(x)); 
    
    if (this.tipoConfig == 2) {
      let bibliaTemp = JSON.stringify(this.biblia);
      this.storage.clear().then(sucess => console.log("removeu tudo"));
      this.storage.set(this.constantes.BIBLIA_CHAVE, bibliaAux);
      this.tipoConfig = 1;
      //this.configurarBiblia();
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

    if(this.tipoConfig == 1){ // local
      capituloParam.versiculos.forEach(versiculo => {
        capituloParam.versiculos.push(versiculo); 
      });
    } else if(this.tipoConfig == 2){ //web
      capituloTemp = new Capitulo();
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

  salvar(){
    this.storage.set(this.constantes.BIBLIA_CHAVE, this.biblia);
    //this.storage.set(this.constantes.BIBLIA_CHAVE, JSON.stringify(this.biblia));
  }

}