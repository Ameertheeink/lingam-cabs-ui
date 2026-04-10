import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollutionModalComponent } from './pollution-modal.component';

describe('PollutionModalComponent', () => {
  let component: PollutionModalComponent;
  let fixture: ComponentFixture<PollutionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PollutionModalComponent]
    });
    fixture = TestBed.createComponent(PollutionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
