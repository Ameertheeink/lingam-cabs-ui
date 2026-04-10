import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tyre-modal',
  templateUrl: './tyre-modal.component.html',
  styleUrls: ['./tyre-modal.component.css']
})
export class TyreModalComponent implements OnInit {
  @Input() tyreData: any; // Data passed when editing
  tyreForm!: FormGroup;
  selectedFile: File | null = null;
  tyreBrands: string[] = ['MRF', 'Michelin', 'Bridgestone', 'Apollo', 'CEAT', 'Goodyear'];

  constructor(
    private fb: FormBuilder,
    public activeTyreModal: NgbActiveModal,
    private http: HttpClient
  ) {
    this.initForm();
  }

  ngOnInit() {
    if (this.tyreData) {
      this.tyreForm.patchValue(this.tyreData);
    }
  }

  initForm() {
    this.tyreForm = this.fb.group({
      changeKm: ['', [Validators.required, Validators.min(0)]],
      changeDate: ['', [Validators.required]],
      serviceIntervalKm: ['', [Validators.required, Validators.min(500)]],
      tyreBrand: ['', [Validators.required]],
      tyreType: ['', [Validators.required]],
      cost: ['', [Validators.required, Validators.min(0)]],
      vendor: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  save() {
    if (this.tyreForm.valid) {
      // Send back the form values + the file
      this.activeTyreModal.close({
        data: this.tyreForm.value,
        file: this.selectedFile
      });
    } else {
      this.tyreForm.markAllAsTouched();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
}