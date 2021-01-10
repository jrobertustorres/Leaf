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
    path: 'music-player',
    loadChildren: () => import('./music-player/music-player.module').then( m => m.MusicPlayerPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
