import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TyreComponent } from './tyre.component';

describe('TyreComponent', () => {
  let component: TyreComponent;
  let fixture: ComponentFixture<TyreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TyreComponent]
    });
    fixture = TestBed.createComponent(TyreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
