import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UnidadesLeituraDiaria, SegmentoLeituraDiaria, PlanoLeitura } from '../../models/PlanosLeitura';
import { ConfiguracaoBibliaProvider } from '../../providers/configuracao-biblia/configuracao-biblia';
import { Capitulo } from '../../models/Biblia';

@IonicPage()
@Component({
  selector: 'page-painel-plano-leitura',
  templateUrl: 'painel-plano-leitura.html',
})
export class PainelPlanoLeituraPage {

  planoLeituraSelecionado: PlanoLeitura;
  unidadeLeituraDiaria: UnidadesLeituraDiaria;
  segmentoLeituraDiaria: SegmentoLeituraDiaria;
  capitulo: Capitulo;
  capituloSelecionado: Capitulo;
  capitulosLeituraDiaria: Capitulo[];
  leituraRealizada: boolean;
  numVersicBase: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private bibliaProvider: ConfiguracaoBibliaProvider) {
    this.planoLeituraSelecionado = navParams.get("planoLeitura")
    this.unidadeLeituraDiaria = navParams.get("unidadeLeitura");
    this.segmentoLeituraDiaria = navParams.get("segmentoLeitura");
    this.capitulo = new Capitulo();
    this.capituloSelecionado = new Capitulo();
    this.capitulosLeituraDiaria = [];
    
    this.carregarTextoSegmentoLeitura(this.segmentoLeituraDiaria);
    this.leituraRealizada = this.segmentoLeituraDiaria.statusLeitura;
  }

  carregarTextoSegmentoLeitura(segmentoLeituraDiariaParam: SegmentoLeituraDiaria){

    let v: string[] = segmentoLeituraDiariaParam.segmentoLeitura.split(";");
    let indexLivro: number = (Number(v[0]) -1);
    let indexCap: number = (Number(v[1]) -1);
    let indexVersicIni: number = 0;
    let indexVersicFim: number = 0;
    
    this.capitulo = this.bibliaProvider.biblia.livros[indexLivro].capitulos[indexCap];

    if(v[2] === "0"){
      this.numVersicBase = 1;
      indexVersicFim = this.capitulo.versiculos.length;
    } else if(v[2].indexOf("-") >= 0){
      let aux: string[] = v[2].split("-");
      indexVersicIni = Number(aux[0]);
      indexVersicFim = Number(aux[1]);
    }
    
    this.capitulo.versiculos = this.capitulo.versiculos.slice(indexVersicIni, indexVersicFim+1);
    this.capituloSelecionado = this.capitulo;
    this.capitulosLeituraDiaria.push(this.capitulo);

    this.capitulo = new Capitulo();
    this.numVersicBase = indexVersicIni;
  }


  atualizarStatusLeituraSegmento(){
    
    let dax1: Date;
    let dax2: Date;

    this.bibliaProvider.biblia.planosDeLeitura
                .filter(p => p.titulo === this.planoLeituraSelecionado.titulo)[0].unidadesLeituraDiaria  // plano de leitura na bíblia provider                      
                .filter(uld =>                                                                           // unidade de leitura da mesma data daquela passada por parâmetro
                  {
                    dax1 = new Date(uld.dataParaLeitura);
                    dax2 = new Date(this.unidadeLeituraDiaria.dataParaLeitura)

                  if (dax1.getDate() === dax2.getDate() && dax1.getMonth() === dax2.getMonth() && dax1.getFullYear() === dax2.getFullYear()){
                      return uld;
                    }
                })[0].segmentosLeituraDiaria.filter(sld => sld.segmentoLeitura === this.segmentoLeituraDiaria.segmentoLeitura)[0].statusLeitura = this.leituraRealizada;
    
    this.segmentoLeituraDiaria.statusLeitura = this.leituraRealizada;
  }  

}
