import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OilServiceModalComponent } from './oil-service-modal.component';

describe('OilServiceModalComponent', () => {
  let component: OilServiceModalComponent;
  let fixture: ComponentFixture<OilServiceModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OilServiceModalComponent]
    });
    fixture = TestBed.createComponent(OilServiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
