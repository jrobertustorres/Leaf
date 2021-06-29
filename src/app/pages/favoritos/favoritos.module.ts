import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule} from "@ngx-translate/core";
import { IonicModule } from '@ionic/angular';

import { FavoritosPageRoutingModule } from './favoritos-routing.module';

import { FavoritosPage } from './favoritos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoritosPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [FavoritosPage]
})
export class FavoritosPageModule {constructor(public translatemodule: TranslateModule){  
}}
