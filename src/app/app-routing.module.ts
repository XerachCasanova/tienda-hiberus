import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: '',
    loadChildren: () =>
          import('./public/shell/publicshell-module').then((m) => m.PublicShellModule),
  }, 
  {
    path: 'panel',
    loadChildren: () =>
          import('./shell/shell-module').then((m) => m.ShellModule),
  }, 
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
