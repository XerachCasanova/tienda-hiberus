import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductosModule } from './productos/productos.module';
import { ProductosService } from './productos/productos.service';
import { CategoriasModule } from './categorias/categorias.module';
import { CategoriasService } from './categorias/categorias.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';
import { UsuariosService } from './usuarios/usuarios.service';
import { PedidosService } from './pedidos/pedidos.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import 'moment/locale/es';

import { ErroresComponent } from './errores/errores/errores.component';
import { ErroresService } from './errores/errores/errores.service';
import { AuthInterceptorService } from './authentication/auth-interceptor.service';
import { ShellComponent } from './shell/shell.component';
import { NotLoggedComponent } from './not-logged/not-logged.component';
import { PublicshellComponent } from './public/shell/publicshell.component';
import { MatBadgeModule } from '@angular/material/badge';



export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'right',
  allowNegative: false,
  decimal: ',',
  precision: 2,
  prefix: '',
  suffix: ' €',
  thousands: '.',
};

@NgModule({
  declarations: [
    AppComponent,
    ErroresComponent,
    ShellComponent,
    NotLoggedComponent,
    PublicshellComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ProductosModule,
    CategoriasModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatCheckboxModule,
    FormsModule,
    LayoutModule,
    MatButtonModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatBadgeModule,
  ],
  providers: [
    ErroresService,
    ProductosService,
    UsuariosService,
    CategoriasService,
    PedidosService,
    MatDatepickerModule,
    MatNativeDateModule,
    {
      provide: CURRENCY_MASK_CONFIG,
      useValue: CustomCurrencyMaskConfig,
    },
    {       
      provide: HTTP_INTERCEPTORS,      
      useClass: AuthInterceptorService,     
      multi:true   
     },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
