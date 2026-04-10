import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TyreModalComponent } from './tyre-modal.component';

describe('TyreModalComponent', () => {
  let component: TyreModalComponent;
  let fixture: ComponentFixture<TyreModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TyreModalComponent]
    });
    fixture = TestBed.createComponent(TyreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
