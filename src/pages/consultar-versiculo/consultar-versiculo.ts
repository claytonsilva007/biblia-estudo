import { Component, VERSION } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Biblia, Versiculo } from '../../models/Biblia';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { ConstantesProvider } from '../../providers/constantes/constantes';

@IonicPage()
@Component({
  selector: 'page-consultar-versiculo',
  templateUrl: 'consultar-versiculo.html',
})
export class ConsultarVersiculoPage {

  searchQuery: string = '';
  items: string[];
  retorno: Versiculo[] = [];

  amplitudePesquisa: string;
  biblia: Biblia;
  versiculos: Versiculo[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private bibliaProvider: ConfiguracaoBibliaProvider, public constantes: ConstantesProvider) {

  }

  filtarPorMultiplosNiveis(){
    let versiculo: Versiculo;
    let retorno: Versiculo[] = [];
    let regex = new RegExp("^(?=.*Deus)(?=.*céus)(?=.*terra).*$"); 

      this.bibliaProvider.getBiblia().livros.filter(function search(row) {        
        return Object.keys(row).some((key) => {        
          if(typeof row[key] === "string") { 
              
              let x = Object.getOwnPropertyDescriptor(row, "texto");
              
              let textoVersiculo: string = (x !== undefined ? x.value: "");              

              if(textoVersiculo.match(regex)){

                let codCap = Object.getOwnPropertyDescriptor(row, "codigoCapitulo");
                let codVer = Object.getOwnPropertyDescriptor(row, "codigoVersiculo");
                let codLiv = row.codigoLivro;

                versiculo = new Versiculo();
                versiculo.texto = textoVersiculo;
                versiculo.codigoVersiculo = codVer.value;
                versiculo.codigoCapitulo = codCap.value;
                
                retorno.push(versiculo);
                
                return row;
              }              
              
            } else if(row[key] && typeof row[key] === "object") {             
              return search(row[key]);                                     
            }

          return false;                                                     
      });
    }); 

    this.retorno = retorno;

  }
  
}
