import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PublicShellRoutingModule } from './publicshell-routing.module';
import { PublicshellComponent } from './publicshell.component';
import {MatBadgeModule} from '@angular/material/badge';


@NgModule({
    declarations: [
  
    ],
    imports: [
        PublicShellRoutingModule,
        CommonModule,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        LayoutModule,
        MatButtonModule,
        MatListModule,
        MatSnackBarModule,
        MatBadgeModule,
        
    ],
    bootstrap: [PublicshellComponent],
  })
  export class PublicShellModule { }
  