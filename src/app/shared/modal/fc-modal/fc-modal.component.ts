import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-fc-modal',
  templateUrl: './fc-modal.component.html',
  styleUrls: ['./fc-modal.component.css']
})
export class FcModalComponent implements OnInit {

  @Input() fitnessData: any;

  fitnessForm!: FormGroup;
  selectedFile: File | null = null;
  isProcessing = false;

  constructor(
    public activeFitnessModal: NgbActiveModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();

    console.log('Incoming fitnessData:', this.fitnessData); // 🔍 debug

    if (this.fitnessData) {
      this.patchForm(this.fitnessData);
    }
  }

  // ✅ Initialize form
  initForm() {
    this.fitnessForm = this.fb.group({
      issueDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
      certificateNumber: [''],
      issuedBy: [''],
      vehicleId: ['']
    });
  }

  // ✅ Patch form safely (handles edit mode)
  patchForm(data: any) {
    this.fitnessForm.patchValue({
      issueDate: this.formatDate(data.issueDate),
      expiryDate: this.formatDate(data.expiryDate),
      certificateNumber: data.certificateNumber,
      issuedBy: data.issuedBy,
      vehicleId: data.vehicleId
    });
  }

  // ✅ Ensure date works with input[type="date"]
  formatDate(date: string): string {
    if (!date) return '';
    return date.includes('T') ? date.split('T')[0] : date;
  }

  // ✅ Save handler
  save() {
    if (this.fitnessForm.invalid) {
      this.fitnessForm.markAllAsTouched();
      return;
    }

    this.isProcessing = true;

    const formValue = this.fitnessForm.value;

    this.activeFitnessModal.close({
      data: formValue,
      file: this.selectedFile
    });
  }

  // ✅ File selection
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // ✅ Close modal
  cancel() {
    this.activeFitnessModal.dismiss();
  }
}