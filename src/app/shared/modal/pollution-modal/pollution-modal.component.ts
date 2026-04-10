import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConfig } from '../../../config/app.config';
import { PollutionService } from '../../../core/services/pollution.service';


@Component({
  selector: 'app-pollution-modal',
  templateUrl: './pollution-modal.component.html',
  styleUrls: ['./pollution-modal.component.css'],
})
export class PollutionModalComponent implements OnInit {
  @Input() pollutionData: any;

  pollutionForm!: FormGroup;
  selectedFile: File | null = null;
  isProcessing = false;
  apiKey = AppConfig.apiKey;

  constructor(
    public activePollutionModal: NgbActiveModal,
    private fb: FormBuilder,
    private http: HttpClient,
    private pollutionService: PollutionService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.pollutionData) {
      this.pollutionForm.patchValue(this.pollutionData);
    }
  }

initForm() {
  this.pollutionForm = this.fb.group({

    certificateNumber: [
      '',
      [Validators.required, Validators.pattern('^[A-Z0-9]{10,20}$')]
    ],

    issueDate: ['', Validators.required],

    expiryDate: ['', Validators.required],

    vendor: ['', Validators.required],
  });
}

    save() {
    if (this.pollutionForm.valid) {
      // Send back the form values + the file
      this.activePollutionModal.close({
        data: this.pollutionForm.value,
        file: this.selectedFile
      });
    } else {
      this.pollutionForm.markAllAsTouched();
    }
  }

    onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
}
