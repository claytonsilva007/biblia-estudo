import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalComentariosPostPage } from './modal-comentarios-post';

@NgModule({
  declarations: [
    ModalComentariosPostPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalComentariosPostPage),
  ],
})
export class ModalComentariosPostPageModule {}
