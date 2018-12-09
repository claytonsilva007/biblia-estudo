import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {HttpClientModule} from '@angular/common/http';
import { ConfiguracaoBibliaProvider } from '../providers/configuracao-biblia/configuracao-biblia';

import "froala-editor/js/froala_editor.pkgd.min.js";
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { ComentariosPage } from '../pages/comentarios/comentarios';
import { ModalTodosComentariosPage } from '../pages/modal-todos-comentarios/modal-todos-comentarios';
import { SincronizadorProvider } from '../providers/sincronizador/sincronizador';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { IonicStorageModule } from '@ionic/storage';
import { ConstantesProvider } from '../providers/constantes/constantes';
import { ConsultarVersiculoPage } from '../pages/consultar-versiculo/consultar-versiculo';

import { SocialSharing } from '@ionic-native/social-sharing';
import { UtilProvider } from '../providers/util/util';
import { AppMinimize } from '@ionic-native/app-minimize';
import { ModalFontePage } from '../pages/modal-fonte/modal-fonte';
import { PlanosLeituraPage } from '../pages/planos-leitura/planos-leitura';
import { ModalComentariosPostPage } from '../pages/modal-comentarios-post/modal-comentarios-post';
import { DetalhePlanoLeituraPage } from '../pages/detalhe-plano-leitura/detalhe-plano-leitura';
import { PainelPlanoLeituraPage } from '../pages/painel-plano-leitura/painel-plano-leitura';

import { ProgressBarModule } from "angular-progress-bar";
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AutenticationProvider } from '../providers/autentication/autentication';
import { DevocionalDiariaPage } from '../pages/devocional-diaria/devocional-diaria';
import { LoginPage } from '../pages/login/login';
import { LeituraColetivaPage } from '../pages/leitura-coletiva/leitura-coletiva';
import { HinariosPage } from '../pages/hinarios/hinarios';
import { AnotacoesPage } from '../pages/anotacoes/anotacoes';
import { FaleConoscoPage } from '../pages/fale-conosco/fale-conosco';
import { RemoverAnunciosPage } from '../pages/remover-anuncios/remover-anuncios';
import { ConfiguracoesPage } from '../pages/configuracoes/configuracoes';
import { TimelinePage } from '../pages/timeline/timeline';
import { RegisterPage } from '../pages/register/register';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

export const firebaseConfig = {
  apiKey: "AIzaSyBoOBgbbcVK1v7-k_4wj-wCJESmKr2TFeI",
  authDomain: "biblia-estudo.firebaseapp.com",
  databaseURL: "https://biblia-estudo.firebaseio.com",
  projectId: "biblia-estudo",
  storageBucket: "biblia-estudo.appspot.com",
  messagingSenderId: "513997295997"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ConsultarVersiculoPage,
    ComentariosPage,
    ModalTodosComentariosPage,
    ModalFontePage,
    PlanosLeituraPage,
    ModalComentariosPostPage, 
    DetalhePlanoLeituraPage,
    PainelPlanoLeituraPage,
    DevocionalDiariaPage,
    LoginPage,
    LeituraColetivaPage,
    HinariosPage,
    AnotacoesPage,
    FaleConoscoPage,
    RemoverAnunciosPage,
    ConfiguracoesPage,
    TimelinePage,
    RegisterPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    ProgressBarModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ConsultarVersiculoPage,
    ComentariosPage, 
    ModalTodosComentariosPage,
    ModalFontePage,
    PlanosLeituraPage,
    ModalComentariosPostPage, 
    DetalhePlanoLeituraPage,
    PainelPlanoLeituraPage,
    DevocionalDiariaPage,
    LoginPage,
    LeituraColetivaPage,
    HinariosPage,
    AnotacoesPage,
    FaleConoscoPage,
    RemoverAnunciosPage,
    ConfiguracoesPage,
    TimelinePage,
    RegisterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},    
    HttpClientModule,
    ConfiguracaoBibliaProvider,
    SincronizadorProvider,
    AngularFireDatabase,
    ConstantesProvider,
    SocialSharing,
    UtilProvider,
    AppMinimize,
    LocalNotifications,
    AutenticationProvider,
    Facebook,
    GooglePlus,
    AutenticationProvider    
  ]
})
export class AppModule {}
