import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-oil-service-modal',
  templateUrl: './oil-service-modal.component.html',
  styleUrls: ['./oil-service-modal.component.css']
})
export class OilServiceModalComponent {
 
  @Input() vehicleId!: number;
  @Input() oilData: any;

  @Output() saved = new EventEmitter<any>();
selectedFile: File | null = null;
  oilForm!: FormGroup;
  oilId: number | null = null;
  engineOilData: any;
  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private http: HttpClient
  ) {
    this.initForm();
  }

 initForm() {
  this.oilForm = this.fb.group({
    lastServiceKm: [
      '',
      [Validators.required, Validators.min(0), Validators.max(1000000)]
    ],

    serviceIntervalKm: [
      '',
      [Validators.required, Validators.min(500), Validators.max(50000)]
    ],

    lastServiceDate: [
      '',
      [Validators.required]
    ],

    oilBrand: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(50)]
    ],

    oilQuantityLitres: [
      '',
      [Validators.required, Validators.min(0.5), Validators.max(40)]
    ],

    serviceVendor: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)]
    ],

    brand: [''] // optional
  });
}
  ngOnInit() {
    this.loadEngineData();
    if (this.oilData) {
      this.oilId = this.oilData.id;
      this.oilForm.patchValue(this.oilData);
    }
  }

save() {
  if (this.oilForm.invalid) return;

  this.activeModal.close({
    id: this.oilId,
    data: {
      vehicleId: this.vehicleId,
      ...this.oilForm.value
    }, file: this.selectedFile  
  });
}

  close() {
    this.activeModal.dismiss();
  }

    loadEngineData(): void {
    this.http.get<any>('assets/data/engine-oil-data.json')
      .subscribe(data => {
         this.engineOilData = data.engine_oil_brands; 
      });
  }

  onBrandSelect() {
  const brand = this.oilForm.get('brand')?.value;
  this.oilForm.patchValue({ oilBrand: brand });
}
onFileSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  this.selectedFile = file;
}
}
