import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { authInterceptorProviders } from './_helper/auth.interceptor';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SavedAnalysesComponent } from './saved-analyses/saved-analyses.component';
import { AnalysisResultComponent } from './analysis-result/analysis-result.component';
import { PreferencesComponent } from './preferences/preferences.component';

import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SavedAnalysesComponent,
    AnalysisResultComponent,
    PreferencesComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
