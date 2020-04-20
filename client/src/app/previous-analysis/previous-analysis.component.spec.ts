import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousAnalysisComponent } from './previous-analysis.component';

describe('PreviousAnalysisComponent', () => {
  let component: PreviousAnalysisComponent;
  let fixture: ComponentFixture<PreviousAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
