import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcModalComponent } from './fc-modal.component';

describe('FcModalComponent', () => {
  let component: FcModalComponent;
  let fixture: ComponentFixture<FcModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FcModalComponent]
    });
    fixture = TestBed.createComponent(FcModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
