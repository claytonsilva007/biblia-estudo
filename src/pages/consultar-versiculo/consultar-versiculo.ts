import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Versiculo } from '../../models/Biblia';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { ConstantesProvider } from '../../providers/constantes/constantes';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-consultar-versiculo',
  templateUrl: 'consultar-versiculo.html',
})
export class ConsultarVersiculoPage {

  searchQuery: string = '';
  items: string[];
  retorno: Versiculo[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private bibliaProvider: ConfiguracaoBibliaProvider, 
                public constantes: ConstantesProvider) {

  }

  ionViewDidLoad() {    
    this.filtarPorMultiplosNiveis(["Jesus", "Chorou"]);
  }

  getItems(ev: any) {
    
    if (ev.cancelable || ' ' !== ev.target.value){
      this.retorno = [];
    }
    
    const val: string = ev.target.value;

    if (val && val.trim() != '' && val.length > 10) {
      this.filtarPorMultiplosNiveis(this.prepararArrayPalavrasDeBusca(val));
    } 
  }

  prepararArrayPalavrasDeBusca(chaveDeBusca: string): string[]{
    chaveDeBusca = chaveDeBusca.replace(/( )+/g, ' ');
    let listaDePalavras: string[] = chaveDeBusca.split(" ");
    return listaDePalavras;
  }

  filtarPorMultiplosNiveis(arrayPalavras: string[]) {
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

  }

  getRegex(palavras: string[]): string {
    let regexStr: string = "^";

    palavras.forEach(palavra => {
      regexStr = regexStr.concat("(?=.*", palavra, ")" );
    });

    regexStr = regexStr.concat(".*$"); 

    return regexStr;
  } 

  navegarParaLivro(versiculo: Versiculo){
    versiculo.backgroundColor = this.constantes.COR_TEXTO_SELECIONADO;
    this.navCtrl.push(HomePage, {versiculoParam: versiculo});
  }

}
