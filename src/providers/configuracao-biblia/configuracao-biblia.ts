import { Injectable } from '@angular/core';
import { Livro, Capitulo, Biblia, Versiculo } from "../../models/Biblia";
import { ConstantesProvider } from '../constantes/constantes';
import { Storage } from '@ionic/storage';
import { PlanoLeitura } from '../../models/PlanosLeitura';
import { AngularFireDatabase } from '@angular/fire/database';
import { Favoritos } from '../../models/Favoritos';

@Injectable()
export class ConfiguracaoBibliaProvider {

  biblia: Biblia = null;
  versiculos: Versiculo[] = [];
  
  constructor(private storage: Storage, private constantes: ConstantesProvider, private afDB: AngularFireDatabase) { 
    this.biblia = new Biblia();
  } 

  getBibliaFormatada(bibliaFormatoWeb: string): Biblia{
    let bibliaAux = JSON.parse(bibliaFormatoWeb);
    let BibliaNovoFormato: Biblia = new Biblia();

    bibliaAux.livros.forEach((livro, indexLivro) => {
      BibliaNovoFormato.livros.push(this.getLivroNovoFormato(livro, indexLivro));
    });
    this.configurarPlanosDeLeitura();
    return BibliaNovoFormato;
  }  

  private getLivroNovoFormato(livroParam, indexLivro): Livro {
    let livro = new Livro();

    livro.abreviatura = livroParam.abreviatura;
    livro.nome = livroParam.nome;
    livro.codigoLivro = indexLivro;
  
    livroParam.capitulos.forEach((capitulo, indexCapitulo)=> { 
      livro.capitulos.push(this.cadCapitulo(capitulo, indexCapitulo, indexLivro));
    });

    return livro;
   
  }

  configurarPlanosDeLeitura(){
    let planos: PlanoLeitura[] = [];
    this.afDB.list("biblias/PlanosDeLeitura").snapshotChanges().subscribe(item => {
      item.map(obj => {
        let planosStr = JSON.stringify(obj.payload.val());
        planos.push(JSON.parse(planosStr));
      });
      
      this.biblia.planosDeLeitura = planos;
      this.storage.set(this.constantes.BIBLIA_CHAVE, this.biblia);
      this.storage.set(this.constantes.CKECK_BIBLIA_STORAGE, "true");
    });
  }

  /** Método chamado quando a bíblia encontra-se no BD */
  configurarBiblia(bibliaParam){
    if(bibliaParam.livros === undefined){
      this.biblia = JSON.parse(bibliaParam); 
    } else {
      this.biblia = bibliaParam;
    }    
  }

  popularArrayLivros(livroParam, indexLivro: number) {
    let livro = new Livro();

    livro.abreviatura = livroParam.abreviatura;
    livro.nome = livroParam.nome;
    livro.codigoLivro = indexLivro;
  
    livroParam.capitulos.forEach((capitulo, indexCapitulo) => { 
      livro.capitulos.push(this.cadCapitulo(capitulo, indexCapitulo, indexLivro));
    });

    this.biblia.livros.push(livro);
   
  }

  cadCapitulo(capituloParam, indexCapitulo: number, indexLivro: number) {
    let capituloTemp: Capitulo;
    let versiculotemp: Versiculo;
    capituloTemp = new Capitulo();

    if(capituloParam.versiculos !== undefined){
      capituloTemp.codigoCapitulo = indexCapitulo;
      capituloParam.versiculos.forEach( (textoVersiculo, indexVersiculo) => {
        versiculotemp = new Versiculo();
        versiculotemp.texto = textoVersiculo;
        versiculotemp.codigoVersiculo = indexVersiculo;
        versiculotemp.codigoCapitulo = indexCapitulo;
        versiculotemp.codigoLivro = indexLivro;
        capituloTemp.versiculos.push(versiculotemp);

      });
    }
         
    return capituloTemp;
  }  

  getBiblia(){
    return this.biblia;
  }

  public getDescricaoCompletaVersiculo(versiculo: Versiculo): string {
    let retorno = "";
    let localizacao: string = "";
    retorno = localizacao.concat(this.biblia.livros[versiculo.codigoLivro].nome, " " + (versiculo.codigoCapitulo+1) + "." + (versiculo.codigoVersiculo+1));

    return retorno;
  }

  setBibliaConfigurada(bibliaConfigurada: Biblia){
    this.biblia = bibliaConfigurada;
  }

  salvarBiblia(biblia: Biblia){
    this.storage.set(this.constantes.BIBLIA_CHAVE, biblia);
  }

  salvar(){
    //this.storage.set(this.constantes.BIBLIA_CHAVE, this.biblia);
    //this.storage.set(this.constantes.BIBLIA_CHAVE, JSON.stringify(this.biblia));
  }

  favoritarVersiculos(versiculos: Versiculo[]){
    
    let marcadoresList: Favoritos[] = [];
    let data = new Date();
    this.storage.get(this.constantes.CHAVE_FAVORITOS).then(result => {
      
      if (result !== null && result !== undefined && result.length > 0 ){
        marcadoresList = result;
      } 
           
      versiculos.forEach(v => {
        let chave = v.codigoLivro.toString() + ";" + v.codigoCapitulo.toString() + ";" + v.codigoVersiculo.toString();
        let backgroundColor = v.backgroundColor;

        marcadoresList.push(new Favoritos(chave, backgroundColor, data));
      });
      this.storage.set(this.constantes.CHAVE_FAVORITOS, marcadoresList);
    });

  }

  consultarTodosFavoritos(): Versiculo[] {
    let favoritos: Favoritos[] = [];
    let versiculos: Versiculo[] = [];
    let versiculo: Versiculo;

    this.storage.get(this.constantes.CHAVE_FAVORITOS).then(result => {
      favoritos = result;
      if(favoritos !== null && favoritos !== undefined){
        favoritos.forEach(f => {
          let v = f.chave.split(";");
          versiculo = this.biblia.livros[v[0]].capitulos[v[1]].versiculos[v[2]];
          versiculo.backgroundColor = f.backgroundColor;
          versiculos.push(versiculo);
        });
      }
    });
    
    return versiculos;
  }

}