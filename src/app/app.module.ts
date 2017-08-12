import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { FormWizardModule } from 'angular2-wizard';
import { SeLoginComponent } from './se-login/se-login.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { BlankComponent } from './blank/blank.component';
import { StackExchangeService } from './stack-exchange.service';
import { AlertManagerService } from './alert-manager.service';
import { AlertableDirective } from './alertable/alertable.directive';
import { SitePickerComponent } from './site-picker/site-picker.component';
import { SeSiteShortPipe } from './se-site-short.pipe';

const appRoutes: Routes = [
  { path: '', component: CalculatorComponent },
  { path: 'blank', component: BlankComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SeLoginComponent,
    CalculatorComponent,
    BlankComponent,
    AlertableDirective,
    SitePickerComponent,
    SeSiteShortPipe
  ],
  imports: [
    BrowserModule,
    FormWizardModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false }),
    AlertModule.forRoot()
  ],
  providers: [StackExchangeService, AlertManagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
