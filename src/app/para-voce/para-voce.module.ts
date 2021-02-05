import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParaVocePageRoutingModule } from './para-voce-routing.module';

import { ParaVocePage } from './para-voce.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParaVocePageRoutingModule
  ],
  declarations: [ParaVocePage]
})
export class ParaVocePageModule {}
