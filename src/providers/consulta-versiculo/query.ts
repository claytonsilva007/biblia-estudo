import { Injectable } from '@angular/core';
import { ConfiguracaoBibliaProvider } from '../configuracao-biblia/configuracao-biblia';
import { Versiculo } from '../../models/Biblia';

@Injectable()
export class QueryProvider {

  retorno: Versiculo[] = [];

  constructor(private bibliaProvider: ConfiguracaoBibliaProvider) {
    
  }

  filtarPorMultiplosNiveis(arrayPalavras: string[]): Versiculo[] {
    
    this.filtrarVersiculosComentados();


    let versiculo: Versiculo;
    let retorno: Versiculo[] = [];

    let regex = new RegExp(this.getRegex(arrayPalavras), "i");

    this.bibliaProvider.getBiblia().livros.filter(function search(row) {
      return Object.keys(row).some((key) => {
        if (typeof row[key] === "string") {

          let x = Object.getOwnPropertyDescriptor(row, "texto");

          let textoVersiculo: string = (x !== undefined ? x.value : "");

          if (textoVersiculo.match(regex)) {

            let codCap = Object.getOwnPropertyDescriptor(row, "codigoCapitulo");
            let codVer = Object.getOwnPropertyDescriptor(row, "codigoVersiculo");
            let codLiv = Object.getOwnPropertyDescriptor(row, "codigoLivro");

            versiculo = new Versiculo();
            versiculo.texto = textoVersiculo;
            versiculo.codigoVersiculo = codVer.value;
            versiculo.codigoCapitulo = codCap.value;
            versiculo.codigoLivro = codLiv.value;

            console.log(versiculo);

            retorno.push(versiculo);

            return row;
          }

        } else if (row[key] && typeof row[key] === "object") {
          return search(row[key]);
        }

        return false;
      });
    });

    this.retorno = retorno;
    
    return this.retorno;

  }

  getRegex(palavras: string[]): string {

    let regexStr: string = "^";

    palavras.forEach(palavra => {
      regexStr = regexStr.concat("(?=.*", palavra, ")");
    });

    regexStr = regexStr.concat(".*$");

    return regexStr;
  } 

  filtrarVersiculosComentados(): Versiculo[]{
    
    let versiculo: Versiculo;
    let retorno: Versiculo[] = [];

    this.bibliaProvider.getBiblia().livros.forEach(l => {
      l.capitulos.forEach(c => {
        c.versiculos.filter(v => v.comentariosUsuario.length > 0)
          .forEach(vc => retorno.push(vc));
      });
    });

    return retorno;      
  
  }

}
