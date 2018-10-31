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
    ModalFontePage
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
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ConsultarVersiculoPage,
    ComentariosPage, 
    ModalTodosComentariosPage,
    ModalFontePage
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
    AppMinimize
  ]
})
export class AppModule {}
