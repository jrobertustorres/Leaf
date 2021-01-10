import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SonsListPageRoutingModule } from './sons-list-routing.module';

import { SonsListPage } from './sons-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SonsListPageRoutingModule
  ],
  declarations: [SonsListPage]
})
export class SonsListPageModule {}
