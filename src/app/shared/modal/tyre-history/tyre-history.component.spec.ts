import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TyreHistoryComponent } from './tyre-history.component';

describe('TyreHistoryComponent', () => {
  let component: TyreHistoryComponent;
  let fixture: ComponentFixture<TyreHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TyreHistoryComponent]
    });
    fixture = TestBed.createComponent(TyreHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
