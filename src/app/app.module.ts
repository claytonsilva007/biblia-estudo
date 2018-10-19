import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {HttpClientModule} from '@angular/common/http';
import { ConfiguracaoBibliaProvider } from '../providers/configuracao-biblia/configuracao-biblia';

import "froala-editor/js/froala_editor.pkgd.min.js";
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { ComentariosPage } from '../pages/comentarios/comentarios';
import { ModalTodosComentariosPage } from '../pages/modal-todos-comentarios/modal-todos-comentarios';

import { File } from '@ionic-native/file';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ComentariosPage,
    ModalTodosComentariosPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ComentariosPage, 
    ModalTodosComentariosPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},    
    HttpClientModule,
    ConfiguracaoBibliaProvider,
    File
  ]
})
export class AppModule {}
