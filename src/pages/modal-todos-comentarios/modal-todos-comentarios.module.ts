import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalTodosComentariosPage } from './modal-todos-comentarios';

@NgModule({
  declarations: [
    ModalTodosComentariosPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalTodosComentariosPage),
  ],
})
export class ModalTodosComentariosPageModule {}
