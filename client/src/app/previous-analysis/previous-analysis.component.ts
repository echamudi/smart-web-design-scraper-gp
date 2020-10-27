import { Component, OnInit } from '@angular/core';
import { gql } from '@apollo/client/core';
import { from as observableFrom } from 'rxjs';
import { TokenStorageService } from '../_services/token-storage.service';
import { AuthService } from '../_services/auth.service';

type AnalysisLite = {id: string, date: string, url: string};

@Component({
  selector: 'app-previous-analysis',
  templateUrl: './previous-analysis.component.html',
  styleUrls: ['./previous-analysis.component.scss']
})
export class PreviousAnalysisComponent implements OnInit {

  constructor(private tokenStorage: TokenStorageService, private authService: AuthService) { }

  analyses: AnalysisLite[] = [];

  ngOnInit(): void {
    const tok = this.tokenStorage.getToken();

    observableFrom(
      this.authService.client.query({
        query: gql`query {
          getAnalyses {
            id,
            date,
            url
          }
        }`,
        variables: {
        },
        context: {
          headers: {
            'x-access-token': tok
          }
        }
      })
    ).subscribe(
      data => {
        const rawAnalyses = data?.data?.getAnalyses ?? [];

        this.analyses = rawAnalyses.map((el) => ({
          ...el,
          date: (new Date(parseInt(el.date, 10))).toLocaleString()
        }));

        console.log('Analyses', this.analyses);
      },
      err => {
        console.log('Err', err);
      }
    );
  }

}
