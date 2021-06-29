import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RadiosPage } from './radios.page';

const routes: Routes = [
  {
    path: '',
    component: RadiosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RadiosPageRoutingModule {}
