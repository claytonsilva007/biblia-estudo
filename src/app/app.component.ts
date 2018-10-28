import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ConsultarVersiculoPage } from '../pages/consultar-versiculo/consultar-versiculo';

import { ConfiguracaoBibliaProvider } from '../providers/configuracao-biblia/configuracao-biblia';
import { ConstantesProvider } from '../providers/constantes/constantes';
import { Storage } from '@ionic/storage';

import { AngularFireDatabase } from '@angular/fire/database';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  pages: Array<{ title: string, component: any }>;

  loading: any;
  versiculos: string[] = [];

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private configBiblia: ConfiguracaoBibliaProvider, private loadingCtrl: LoadingController,
    private storage: Storage, public constantes: ConstantesProvider, private afDB: AngularFireDatabase) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Biblia de Estudo', component: HomePage },
      { title: 'Consultar Versísulos', component: ConsultarVersiculoPage }
    ];

    this.popularVersiculosDaSorte();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      
      this.showLoading();

      this.storage.get(this.constantes.CKECK_BIBLIA_STORAGE).then(val => {
        if (val !== null) {
          this.storage.get(this.constantes.BIBLIA_CHAVE).then(biblia => {
            this.configBiblia.configurarBiblia(biblia);
            this.hideLoading();
          });
        } else {
          this.afDB.list("biblias/biblia").snapshotChanges().subscribe(item => {
            item.map(obj => {
              this.storage.set(this.constantes.BIBLIA_CHAVE, JSON.stringify(this.configBiblia.getBibliaFormatada(JSON.stringify(obj.payload.val()))));
              this.storage.set(this.constantes.CKECK_BIBLIA_STORAGE, "true");
              this.configBiblia.setBibliaConfigurada(this.configBiblia.getBibliaFormatada(JSON.stringify(obj.payload.val())));
              this.storage.set(this.constantes.CKECK_BIBLIA_STORAGE, "true");
              this.nav.push(HomePage);
              this.hideLoading();
            });
          });
        }
      }).catch(err => {
        console.log("ERRO: " + err)
      });

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });


    this.platform.registerBackButtonAction(() => {
      let nav = this.nav.getAllChildNavs[0];
      let activeView = nav.getActive();

      if (activeView.name === 'HomePage') {
        if (nav.canGoBack()) {
          nav.pop();
        } else {
          this.configBiblia.salvar();
        }
      }
    });
  }

  private showLoading() {
    let min = Math.ceil(0);
    let max = Math.floor(this.versiculos.length);    
    let indexDaSorte: number = Math.floor(Math.random() * (max - min + 1)) + min;
    let versiculoDaSorte = this.versiculos[indexDaSorte];

    this.loading = this.loadingCtrl.create({
      content: versiculoDaSorte
    });

    this.loading.present();    
  } 
  
  private hideLoading() {
    this.loading.dismiss();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  popularVersiculosDaSorte(){
    this.versiculos.push("Pv. 16.3 - Confia ao Senhor as tuas obras, e teus pensamentos serão estabelecidos.");
    this.versiculos.push("Nm. 6.24-26 - O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti e tenha misericórdia de ti; o Senhor sobre ti levante o seu rosto e te dê a paz.");
    this.versiculos.push("Pv. 16.3 - Confia ao Senhor as tuas obras, e teus pensamentos serão estabelecidos.");
    this.versiculos.push("Jr. 29.11 - Porque eu bem sei os pensamentos que penso de vós, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais. ");
    this.versiculos.push("Fp. 4.19 - O meu Deus, segundo as suas riquezas, suprirá todas as vossas necessidades em glória, por Cristo Jesus.");
    this.versiculos.push("Êx. 23.25 - E servireis ao Senhor, vosso Deus, e ele abençoará o vosso pão e a vossa água; e eu tirarei do meio de ti as enfermidades.");
    this.versiculos.push("Sl. 34.8 - Provai e vede que o Senhor é bom; bem - aventurado o homem que nele confia.");
    this.versiculos.push("Pv. 16.20 - O que atenta prudentemente para a palavra achará o bem, e o que confia no Senhor será bem - aventurado.");
    this.versiculos.push("6.26-27 - Mas a vós, que ouvis, digo: Amai a vossos inimigos, fazei bem aos que vos aborrecem, bendizei os que vos maldizem e orai pelos que vos caluniam. Lc. ");
    this.versiculos.push("Fm. 1.25 - A graça de nosso Senhor Jesus Cristo seja com o vosso espírito. Amém! ");
    this.versiculos.push("Gl. 5.22-23 - Mas o fruto do Espírito é: amor, gozo, paz, longanimidade, benignidade, bondade, fé, mansidão, temperança. Contra essas coisas não há lei. ");
    this.versiculos.push("Dt. 28.1 - E será que, se ouvires a voz do Senhor, teu Deus, tendo cuidado de guardar todos os seus mandamentos que eu te ordeno hoje, o Senhor, teu Deus, te exaltará sobre todas as nações da terra.");
    this.versiculos.push("Mt. 5.9 - Bem-aventurados os pacificadores, porque eles serão chamados filhos de Deus.");
    this.versiculos.push("Fp. 4.23 - A graça de nosso Senhor Jesus Cristo seja com vós todos. Amém!");
    this.versiculos.push("Lc. 6.45 - O homem bom, do bom tesouro do seu coração, tira o bem, e o homem mau, do mau tesouro do seu coração, tira o mal, porque da abundância do seu coração fala a boca.");
    this.versiculos.push("Mt. 25.21 - E o seu senhor lhe disse: Bem está, servo bom e fiel. Sobre o pouco foste fiel, sobre muito te colocarei; entra no gozo do teu senhor.");
    this.versiculos.push("Sl 119.2 - Bem-aventurados os que guardam os seus testemunhos e o buscam de todo o coração.");
    this.versiculos.push("Mt. 5.6 - Bem-aventurados os que têm fome e sede de justiça, porque eles serão fartos.");
    this.versiculos.push("Sl. 56.3 - No dia em que eu temer, hei de confiar em ti.");
    this.versiculos.push("I Jo. 5.14 - E esta é a confiança que temos nele: que, se pedirmos alguma coisa, segundo a sua vontade, ele nos ouve.");
    this.versiculos.push("II Cor. 5.7 - Porque andamos por fé e não por vista.");
    this.versiculos.push("Jo 11.40 - Disse-lhe Jesus: Não te hei dito que, se creres, verás a glória de Deus?");
  }
}
