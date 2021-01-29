import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BreathPage } from './breath.page';

const routes: Routes = [
  {
    path: '',
    component: BreathPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BreathPageRoutingModule {}
