import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../config/app.config';
import { InsuranceService } from '../../../core/services/insurance.service';

@Component({
  selector: 'app-insurance-modal',
  templateUrl: './insurance-modal.component.html',
  styleUrls: ['./insurance-modal.component.css']
})
export class InsuranceModalComponent implements OnInit {
  @Input() insuranceData: any; 
  
  insuranceForm!: FormGroup;
  selectedFile: File | null = null;
  isProcessing = false; 
  apiKey = AppConfig.apiKey;

  constructor(
    public activeInsuranceModal: NgbActiveModal,
    private fb: FormBuilder,
    private http: HttpClient,
    private insuranceService: InsuranceService
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.insuranceData) {
      this.insuranceForm.patchValue(this.insuranceData);
    }
  }

  initForm() {
    this.insuranceForm = this.fb.group({
      policyNumber: ['', Validators.required],
      provider: ['', Validators.required],
      startDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
      premiumAmount: ['', [Validators.required, Validators.min(0)]],
      idv: ['', Validators.min(0)],
      coverageType: ['Comprehensive', Validators.required],
      name: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });
  }

async onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (!file) return;
  this.selectedFile = file;
  this.isProcessing = true;

  try {
    const genAI = new GoogleGenerativeAI(this.apiKey);

    // FIX: Use one of the names exactly as they appear in your list
    const model = genAI.getGenerativeModel(
      { model: "gemini-3.1-flash-lite-preview" }, // Use the latest from your list
      { apiVersion: 'v1beta' }
    );

    const base64Data = await this.fileToGenerativePart(file);

    const prompt = `Act as an OCR specialist. Extract data from this insurance document and return ONLY a JSON object:
    {
      "policyNumber": "string",
      "provider": "string",
      "startDate": "YYYY-MM-DD",
      "expiryDate": "YYYY-MM-DD",
      "premiumAmount": number,
      "idv": number,
      "coverageType": "Comprehensive",
      "name": "string",
      "mobileNumber": "string"
    }`;

    const result = await model.generateContent([prompt, base64Data]);
    const text = result.response.text();

    // Clean and Parse
    const cleanJson = JSON.parse(text.replace(/```json|```/g, '').trim());
    
    // Fill the Form
    this.insuranceForm.patchValue(cleanJson);
    console.log("Success! Data extracted:", cleanJson);

  } catch (error) {
    console.error("Extraction failed:", error);
    alert("Could not read document. Please ensure the image is clear.");
  } finally {
    this.isProcessing = false;
  }
}
// Essential helper to process the image/PDF for the AI
async fileToGenerativePart(file: File): Promise<any> {
  const base64Promise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64Promise, mimeType: file.type }
  };
}

  // Helper to convert File to Gemini format


  save() {
    if (this.insuranceForm.valid) {
      this.activeInsuranceModal.close({data:this.insuranceForm.value,
        file:this.selectedFile
    });
    } else {
      this.insuranceForm.markAllAsTouched();
    }
  }

  viewExisting() {
  if (this.insuranceData && this.insuranceData.id) {
    this.isProcessing = true; // Show spinner while downloading
    
    this.insuranceService.downloadDocument(this.insuranceData.id).subscribe({
      next: (blob: Blob) => {
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
        this.isProcessing = false;
      },
      error: (err) => {
        console.error('Could not open document', err);
        this.isProcessing = false;
        alert("Could not load the existing document.");
      }
    });
  }
}
}