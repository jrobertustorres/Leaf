import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'sons-list',
    loadChildren: () => import('./sons-list/sons-list.module').then( m => m.SonsListPageModule)
  },
  {
    path: 'breath',
    loadChildren: () => import('./breath/breath.module').then( m => m.BreathPageModule)
  },
  {
    path: 'para-voce',
    loadChildren: () => import('./para-voce/para-voce.module').then( m => m.ParaVocePageModule)
  },
  {
    path: 'radios',
    loadChildren: () => import('./radios/radios.module').then( m => m.RadiosPageModule)
  },
  {
    path: 'favoritos',
    loadChildren: () => import('./pages/favoritos/favoritos.module').then( m => m.FavoritosPageModule)
  },
  {
    path: 'mais',
    loadChildren: () => import('./pages/mais/mais.module').then( m => m.MaisPageModule)
  },
  {
    path: 'tab3',
    loadChildren: () => import('./tab3/tab3.module').then( m => m.Tab3PageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
