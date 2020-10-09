import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// import { authInterceptorProviders } from './_helper/auth.interceptor';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AnalysisResultComponent } from './analysis-result/analysis-result.component';
import { PreferencesComponent } from './preferences/preferences.component';

import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PreviousAnalysisComponent } from './previous-analysis/previous-analysis.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AnalysisResultComponent,
    PreferencesComponent,
    LoginComponent,
    SignupComponent,
    PreviousAnalysisComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    // authInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
