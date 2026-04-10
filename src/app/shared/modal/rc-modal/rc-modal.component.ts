import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConfig } from '../../../config/app.config';
import { RegistrationService } from '../../../core/services/registration.service';


@Component({
  selector: 'app-rc-modal',
  templateUrl: './rc-modal.component.html',
  styleUrls: ['./rc-modal.component.css']
})
export class RcModalComponent implements OnInit {
@Input() registrationData: any; 

  registrationForm!: FormGroup;
  selectedFile: File | null = null;
  isProcessing = false; 
  apiKey = AppConfig.apiKey;

  constructor(
    public activeRegistrationModal: NgbActiveModal,
    private fb: FormBuilder,
    private http: HttpClient,
    private registrationService: RegistrationService
  
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.registrationData) {
      this.registrationForm.patchValue(this.registrationData);
    }
  }
initForm() {
  this.registrationForm = this.fb.group({

    // Basic Registration
    registrationNumber: ['', Validators.required],
    registrationDate: ['', Validators.required],
    chassisNumber: ['', Validators.required],
    engineNumber: ['', Validators.required],
    registrationAuthority: ['', Validators.required],

    // Vehicle Details
    makersName: ['', Validators.required],
    modelName: ['', Validators.required],
    vehicleClass: ['', Validators.required],
    bodyType: [''],
    colour: ['', Validators.required],
    fuelType: ['', Validators.required],
    emissionNorms: [''],
    manufacturingMonthYear: [''],

    cubicCapacity: [null, [Validators.min(0)]],
    seatingCapacity: [null, [Validators.min(1)]],

    // Owner Details
    ownerName: ['', Validators.required],
    fatherOrHusbandName: [''],
    address: ['', Validators.required],
    pinCode: ['', [Validators.pattern('^[0-9]{6}$')]]

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

 // Inside onFileSelected(event: any)
const prompt = `Act as an OCR specialist. Extract data from this Vehicle Registration Certificate (RC) and return ONLY a JSON object. 
Ensure dates are in YYYY-MM-DD format. Mapping:
{
  "registrationNumber": "string",
  "registrationDate": "YYYY-MM-DD",
  "chassisNumber": "string",
  "engineNumber": "string",
  "registrationAuthority": "string",
  "makersName": "string",
  "modelName": "string",
  "vehicleClass": "string",
  "bodyType": "string",
  "colour": "string",
  "fuelType": "string",
  "emissionNorms": "string",
  "manufacturingMonthYear": "MM-YYYY",
  "cubicCapacity": number,
  "seatingCapacity": number,
  "ownerName": "string",
  "fatherOrHusbandName": "string",
  "address": "string",
  "pinCode": "string",
  
}`;

    const result = await model.generateContent([prompt, base64Data]);
    const text = result.response.text();

    // Clean and Parse
    const cleanJson = JSON.parse(text.replace(/```json|```/g, '').trim());
    
    // Fill the Form
    this.registrationForm.patchValue(cleanJson);
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
    if (this.registrationForm.valid) {
      this.activeRegistrationModal.close({data:this.registrationForm.value,
        file:this.selectedFile
    });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

  viewExisting() {
  if (this.registrationData && this.registrationData.id) {
    this.isProcessing = true; // Show spinner while downloading
    
    this.registrationService.downloadDocument(this.registrationData.id).subscribe({
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