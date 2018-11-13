import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UnidadesLeituraDiaria, SegmentoLeituraDiaria } from '../../models/PlanosLeitura';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { Capitulo } from '../../models/Biblia';

@IonicPage()
@Component({
  selector: 'page-painel-plano-leitura',
  templateUrl: 'painel-plano-leitura.html',
})
export class PainelPlanoLeituraPage {

  unidadeLeituraDiaria: UnidadesLeituraDiaria;
  segmentoLeituraDiaria: SegmentoLeituraDiaria;
  capitulo: Capitulo;

  capitulosLeituraDiaria: Capitulo[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private bibliaProvider: ConfiguracaoBibliaProvider) {
    this.unidadeLeituraDiaria = navParams.get("unidadeLeitura");
    this.segmentoLeituraDiaria = navParams.get("segmentoLeitura");
    this.capitulo = new Capitulo();
    this.capitulosLeituraDiaria = [];
    this.carergarUnidadeLeituraDiaria();
  }

  carergarUnidadeLeituraDiaria(){
    this.unidadeLeituraDiaria.segmentosLeituraDiaria.forEach(uld => this.carregarTextoSegmentoLeitura(uld));
  }

  carregarTextoSegmentoLeitura(segmentoLeituraDiariaParam: SegmentoLeituraDiaria){

    let v: string[] = segmentoLeituraDiariaParam.segmentoLeitura.split(";");
    let indexLivro: number = (Number(v[0]) -1);
    let indexCap: number = (Number(v[1]) -1);
    let indexVersicIni: number = 0;
    let indexVersicFim: number = 0;
    
    this.capitulo = this.bibliaProvider.biblia.livros[indexLivro].capitulos[indexCap];

    if(v[2] === "0"){
      indexVersicFim = this.capitulo.versiculos.length;
    } else if(v[2].indexOf("-") >= 0){
      let aux: string[] = v[2].split("-");
      indexVersicIni = Number(aux[0]);
      indexVersicFim = Number(aux[1]);
    }
    
    this.capitulo.versiculos = this.capitulo.versiculos.slice(indexVersicIni, indexVersicFim);
    this.capitulosLeituraDiaria.push(this.capitulo);
    this.capitulo = new Capitulo();

  }


  ionViewDidLoad() {
    
  }

}
