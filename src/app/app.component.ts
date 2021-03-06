import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, MenuController, Events, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ConsultarVersiculoPage } from '../pages/consultar-versiculo/consultar-versiculo';

import { ConfiguracaoBibliaProvider } from '../providers/configuracao-biblia/configuracao-biblia';
import { ConstantesProvider } from '../providers/constantes/constantes';
import { Storage } from '@ionic/storage';

import { AngularFireDatabase } from '@angular/fire/database';
import { UtilProvider } from '../providers/util/util';
import { PlanosLeituraPage } from '../pages/planos-leitura/planos-leitura';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PlanoLeitura } from '../models/PlanosLeitura';
import { Notificacao } from '../models/Notificacao';
import { TimelinePage } from '../pages/timeline/timeline';
import { HinariosPage } from '../pages/hinarios/hinarios';
import { LeituraColetivaPage } from '../pages/leitura-coletiva/leitura-coletiva';
import { DevocionalDiariaPage } from '../pages/devocional-diaria/devocional-diaria';
import { ConfiguracoesPage } from '../pages/configuracoes/configuracoes';
import { AnotacoesPage } from '../pages/anotacoes/anotacoes';
import { RemoverAnunciosPage } from '../pages/remover-anuncios/remover-anuncios';
import { FaleConoscoPage } from '../pages/fale-conosco/fale-conosco';
import { AppMinimize } from '@ionic-native/app-minimize';
import { LoginPage } from '../pages/login/login';
import { AngularFireAuth } from '@angular/fire/auth';
import { FavoritosPage } from '../pages/favoritos/favoritos';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  pages: Array<{ title: string, component: any, icon: string }>;
  loading: any;
  modalListPages: string[];
  notificacaoList: Notificacao[];
  redirecionarParaPlanoLeitura: boolean;
  isLogado: boolean;
  userName: string;
  photoURL;
  
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private configBiblia: ConfiguracaoBibliaProvider, private loadingCtrl: LoadingController, private storage: Storage, 
    public constantes: ConstantesProvider, private afDB: AngularFireDatabase, private utilProvider: UtilProvider, 
    private localNotifications: LocalNotifications, public events: Events, private afAuth: AngularFireAuth,
    private menuCtrl: MenuController, private app: App, private appMinimize: AppMinimize) {
    
    this.redirecionarParaPlanoLeitura = false;

    this.isLogado = false;

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      //{ title: 'Login', component: LoginPage, icon: 'log-in' },
      //{ title: 'Página Pessoal', component: TimelinePage, icon: 'people' },
      { title: 'Biblia de Estudo', component: HomePage, icon: 'book'},
      { title: 'Consultar Versísulos', component: ConsultarVersiculoPage, icon: 'search'},
      { title: 'Devocional Diária', component: DevocionalDiariaPage, icon: 'clock' },
      { title: 'Planos de Leitura', component: PlanosLeituraPage, icon: 'map' },
      { title: 'Leitura Coletiva', component: LeituraColetivaPage, icon: 'bookmarks' },
      { title: 'Hinários', component: HinariosPage, icon: 'megaphone' },
      { title: 'Anotações', component: AnotacoesPage, icon: 'text' },
      { title: 'Favoritos', component: FavoritosPage, icon: 'star' },
      { title: 'Fale conosco', component: FaleConoscoPage, icon: 'chatbubbles' },
      { title: 'Configurações', component: ConfiguracoesPage, icon: 'settings' },      
      { title: 'Remover Anúncios', component: RemoverAnunciosPage, icon: 'remove-circle' }
    ];

    /*Adicionando essa verificação para evitar erros no browser*/
    if (this.platform.is('android')){
      events.subscribe('planoLeitura:criarLocalNotification', (planoLeitura) => {
        this.configLocalNotification(planoLeitura);
      });

      events.subscribe('planoLeitura:cancelarLocalNotification', (planoLeitura) => {
        this.cancelarLocalNotification(planoLeitura);
      });

      events.subscribe('planoLeitura:reiniciarLocalNotification', (planoLeitura) => {
        this.cancelarLocalNotification(planoLeitura);
        this.configLocalNotification(planoLeitura);
      });

      events.subscribe('planoLeitura:cancelarNotificacaoIndividual', (idNotificacao) => {
        this.cancelarNotificacaoIndividual(idNotificacao);
      });

      events.subscribe('planoLeitura:desativar-som', (planoLeitura) => {
        this.desativarSom(planoLeitura);
      });

      events.subscribe('user:login', (user) => {
        this.userName = user.displayName;
        this.photoURL = user.photoURL;
        this.storage.set(this.constantes.USUARIO_LOGADO, user);
        this.isLogado = true;
      });

      events.subscribe('user:login-email', (user) => {
        this.userName = user.displayName;
        this.photoURL = "assets/icon/drawable-xhdpi-icon.png";
        user.photoURL = "assets/icon/drawable-xhdpi-icon.png";
        this.storage.set(this.constantes.USUARIO_LOGADO, user);
        this.isLogado = true;
      });
    }
  }


  initializeApp() {

    this.platform.ready().then(() => {

      this.storage.get(this.constantes.USUARIO_LOGADO).then( (usr) => {
         this.userName = usr.displayName;
         this.photoURL = usr.photoURL;
         this.isLogado = true; 
      }).catch(() =>{
        this.photoURL = undefined;
        this.userName = undefined;
        this.isLogado = false;
      });
      
      this.showLoading("<br></br>Por favor, aguarde enquanto configuramos a Bíblia.");

      this.storage.get(this.constantes.CKECK_BIBLIA_STORAGE).then(val => {
      
        if (val !== null) {
          this.storage.get(this.constantes.BIBLIA_CHAVE).then(biblia => {
            this.configBiblia.configurarBiblia(biblia);
            
            if (this.redirecionarParaPlanoLeitura) {
              this.redirecionarParaPlanoLeitura = false;
              this.rootPage = PlanosLeituraPage;
            } else {
              this.nav.push(HomePage);
            }

            this.hideLoading();
          });

        } else {

            this.afDB.list("biblias/biblia").snapshotChanges().subscribe(item => {

            item.map(obj => {
              this.configBiblia.getBibliaFormatada(JSON.stringify(obj.payload.val()));              
              this.configBiblia.setBibliaConfigurada(this.configBiblia.getBibliaFormatada(JSON.stringify(obj.payload.val())));
              this.storage.set(this.constantes.CKECK_BIBLIA_STORAGE, "true");
              this.storage.set(this.constantes.CHAVE_FAVORITOS, null);
              this.storage.set(this.constantes.CHAVE_SITUACAO_NOTIFICACOES, true);
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

    this.configBackButtom();

    /*Adicionando essa verificação para evitar erros no browser*/
    if (this.platform.is('android')){
      this.localNotifications.on('click').subscribe(() => {
        this.redirecionarParaPlanoLeitura = true;
        this.nav.push(PlanosLeituraPage);
      })}
    

  } // fim método inicializeApp()

  
  
  configBackButtom() {
    this.platform.registerBackButtonAction(() => {      
      let nav = this.app.getActiveNavs()[0];
      let activeView = nav.getActive();

      if (this.menuCtrl.isOpen()) {
          this.menuCtrl.close();
          return;
      } else if (activeView.name === 'HomePage') {        
        this.appMinimize.minimize();
        this.storage.set(this.constantes.BIBLIA_CHAVE, this.configBiblia.getBiblia()); 
      } else if(activeView.name === 'ModalCmp'){        
        activeView.dismiss();      
      } else if(activeView.name !== 'HomePage' && activeView.name !== 'ModalCmp' && nav.canGoBack()){
         nav.pop();
      } else {
        nav.setRoot(HomePage);
      }
    });
  }


  configLocalNotification(planoLeitura: PlanoLeitura){
    let notificacaoListParam = this.prepararListLocalNotification(planoLeitura);
    this.localNotifications.schedule(notificacaoListParam);
    this.storage.set(this.constantes.CHAVE_PREFERENCIAS_NOTIFICACOES, true);
  }
  

  prepararListLocalNotification(planoLeitura: PlanoLeitura): Notificacao[] {
    
    let dataLeitura: Date;
    let notificacao: Notificacao;
    this.notificacaoList = [];

    planoLeitura.unidadesLeituraDiaria.forEach( (uld, index) => {
      
      notificacao = new Notificacao(); 
      dataLeitura = new Date(new Date().getTime());
      notificacao.id = planoLeitura.codigo + index+1;
      notificacao.title = "Plano de Leitura " + planoLeitura.titulo;
      notificacao.text = uld.tituloLeituraDiaria;
      dataLeitura = new Date((uld.dataParaLeitura));
      notificacao.trigger.at = new Date(dataLeitura.setHours(13, 15, 0));
      this.notificacaoList.push(notificacao);

    });

    return this.notificacaoList;
  }

  cancelarLocalNotification(planoLeitura: PlanoLeitura){
    planoLeitura.unidadesLeituraDiaria.forEach((uld, index) => {
      this.localNotifications.cancel((index+1));
    });
    this.storage.set(this.constantes.CHAVE_PREFERENCIAS_NOTIFICACOES, false);
  }

  cancelarNotificacaoIndividual(idNotificacao){
    this.localNotifications.cancel(idNotificacao);
  }

  desativarSom(planoLeitura: PlanoLeitura){
    planoLeitura.unidadesLeituraDiaria.forEach((uld, index) => {
      this.localNotifications.get((index + 1)).then(r => {
        r.sound = null;
      });
    });
  }

  ativarSom(planoLeitura: PlanoLeitura) {
    planoLeitura.unidadesLeituraDiaria.forEach((uld, index) => {
      this.localNotifications.get((index + 1)).then(r => {
        r.sound = "res://platform_default";
      });
    });
  }
  
  private showLoading(mensagem: string) {
    let min = Math.ceil(0);
    let max = Math.floor(this.utilProvider.versiculos.length);    
    let indexDaSorte: number = Math.floor(Math.random() * (max - min + 1)) + min;
    let versiculoDaSorte = this.utilProvider.versiculos[indexDaSorte];
    versiculoDaSorte = versiculoDaSorte.concat(mensagem);

    this.loading = this.loadingCtrl.create({
      content: versiculoDaSorte
    });

    this.loading.present();    
  }   
  
  private hideLoading() {
    this.loading.dismiss();
  }

  login() {
    this.isLogado = true;
    this.nav.setRoot(LoginPage);
  }

  logout() {
    this.afAuth.auth.signOut();
    this.storage.remove(this.constantes.USUARIO_LOGADO).then( () => {
      this.isLogado = false;
      this.photoURL = undefined;
      this.userName = undefined;
    });
}

  navegarParaPerfil(){
    this.nav.push(TimelinePage);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(HomePage);
    this.nav.push(page.component);
  }
    
}
