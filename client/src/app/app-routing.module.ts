import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AnalysisResultComponent } from './analysis-result/analysis-result.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PreviousAnalysisComponent } from './previous-analysis/previous-analysis.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'analysis-result', component: AnalysisResultComponent },
  { path: 'previous-analysis', component: PreviousAnalysisComponent },
  { path: 'preferences', component: PreferencesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
