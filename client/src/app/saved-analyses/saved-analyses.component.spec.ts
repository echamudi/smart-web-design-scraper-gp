import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedAnalysesComponent } from './saved-analyses.component';

describe('SavedAnalysesComponent', () => {
  let component: SavedAnalysesComponent;
  let fixture: ComponentFixture<SavedAnalysesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedAnalysesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedAnalysesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
