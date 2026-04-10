import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OilHistoryComponent } from './oil-history.component';

describe('OilHistoryComponent', () => {
  let component: OilHistoryComponent;
  let fixture: ComponentFixture<OilHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OilHistoryComponent]
    });
    fixture = TestBed.createComponent(OilHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
