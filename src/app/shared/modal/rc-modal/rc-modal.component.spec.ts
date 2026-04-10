import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcModalComponent } from './rc-modal.component';

describe('RcModalComponent', () => {
  let component: RcModalComponent;
  let fixture: ComponentFixture<RcModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RcModalComponent]
    });
    fixture = TestBed.createComponent(RcModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
