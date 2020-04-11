import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SavedAnalysesComponent } from './saved-analyses/saved-analyses.component';
import { AnalysisResultComponent } from './analysis-result/analysis-result.component';
import { PreferencesComponent } from './preferences/preferences.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'analysis-result', component: AnalysisResultComponent },
  { path: 'saved-analyses', component: SavedAnalysesComponent },
  { path: 'preferences', component: PreferencesComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
