import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

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

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, 
              private configBiblia: ConfiguracaoBibliaProvider,
              private storage: Storage, public constantes: ConstantesProvider, private afDB: AngularFireDatabase) {
    
      this.initializeApp();      

      // used for an example of ngFor and navigation
      this.pages = [
        { title: 'Home', component: HomePage },
        { title: 'List', component: ListPage }
      ];

  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.storage.get(this.constantes.CKECK_BIBLIA_STORAGE).then(val => {
        if(val !== null){
          console.log("VAI PEGAR DO BANCO");            
          this.storage.get(this.constantes.BIBLIA_CHAVE).then(biblia => {
          this.configBiblia.configurarBiblia(JSON.stringify(biblia));
          this.configBiblia.setTipoConfig(1);
          console.log("PEGOU DO BANCO");
          });
        } else {
          this.afDB.list("biblias/biblia").snapshotChanges().subscribe(item => 
            {           
             // item.forEach(livro => 
              //{
                item.map(obj => {
                  console.log("VAI PEGAR DA WEB");
                  console.log(obj.payload.val());
                  this.configBiblia.configurarBiblia(JSON.stringify(obj.payload.val())); 
                  this.storage.set(this.constantes.BIBLIA_CHAVE, obj.payload.val());
                  this.storage.set(this.constantes.CKECK_BIBLIA_STORAGE, "true");
                  this.configBiblia.setTipoConfig(2);
                  console.log("PEGOU DA WEB");
                });
             // }); 
            });
          }
        }).catch(err => {console.log("ERRO: " + err)});  

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });


    this.platform.registerBackButtonAction(() => {
      
      let nav = this.nav.getAllChildNavs[0];
   
      let activeView = nav.getActive();         
   
      if(activeView.name === 'HomePage') {
        if (nav.canGoBack()){
          nav.pop();
        } else {
          this.configBiblia.salvar();
        }
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
