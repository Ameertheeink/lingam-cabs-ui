import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Vehicle } from '../../../../shared/models/vehicle.model';
import { VehicleService } from '../../../../core/services/vehicle.service';
import { LoaderService } from '../../../../shared/services/loader.service';


declare var bootstrap: any;

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css'],
})
export class VehicleListComponent implements OnInit {


  vehicles: Vehicle[] = [];
  vehicleForm!: FormGroup;

  savedVehicleNumber!: string;
  selectedFile?: File;
  fileError: string = '';

  carBrands: any[] = [];
  models: string[] = [];

  editMode: boolean = false;
  editingVehicleId!: number;

  deleteVehicleId!: number;
  deleteModal: any;


  page = 0;
size = 5;
totalPages = 0;
keyword = '';
totalElements = 0;

  constructor(
    private vehicleService: VehicleService,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private loaderService: LoaderService
  ) {}

  /**
   * Component Initialization
   * Initializes form and loads vehicles + brand data
   */
  ngOnInit(): void {
    this.initializeForm();
    this.loadVehicles();
    this.loadCarData();
  }

  /**
   * Initialize Reactive Form with validations
   */
  initializeForm(): void {
    this.vehicleForm = this.fb.group({
      vehicleNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$'),
          Validators.maxLength(10)
        ],
      ],
      ownerName: ['', Validators.required],
      mobileNumber: [
  '',
  [
    Validators.required,
    Validators.pattern('^[6-9][0-9]{9}$'),
    Validators.minLength(10),
    Validators.maxLength(10)
  ]
],

      
      currentKm: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.min(0),
        ],
      ],
    });
  }

  /**
   * Loads vehicles from backend
   */
loadVehicles(): void {

  this.loaderService.show();

  const trimmedKeyword = this.keyword?.trim();

  const request = trimmedKeyword
    ? this.vehicleService.searchVehicles(trimmedKeyword, this.page, this.size)
    : this.vehicleService.getVehiclesPaginated(this.page, this.size);

  request.subscribe({
    next: (res) => {
      this.loaderService.hide();

      if (res.success) {
        this.vehicles = res.data.content;
        this.totalPages = res.data.totalPages;
             
        this.totalElements = res.data.totalElements;
      } else {
        this.toastr.error(res.message);
      }
    },
    error: (err) => {
      this.loaderService.hide();
      console.error(err);
      this.toastr.error('Failed to load vehicles');
    }
  });
}

  /**
   * Loads car brand JSON data for dropdown
   */
  loadCarData(): void {
    this.http.get<any>('assets/data/car-data.json')
      .subscribe(data => {
        this.carBrands = data.carBrands;
      });
  }

  /**
   * Converts vehicle number input to uppercase
   */
  onVehicleNumberInput(): void {
    const value = this.vehicleForm.get('vehicleNumber')?.value;
    if (value) {
      this.vehicleForm.patchValue(
        { vehicleNumber: value.toUpperCase() },
        { emitEvent: false }
      );
    }
  }

  onOwnerNameInput(): void {
    const value = this.vehicleForm.get('ownerName')?.value;
    if (value) {
      this.vehicleForm.patchValue(
        { ownerName: value.toUpperCase() },
        { emitEvent: false }
      );
    }
  }


  allowOnlyNumbers(event: any) {
  const input = event.target.value;
  event.target.value = input.replace(/[^0-9]/g, '');
}

  /**
   * Updates models dropdown when brand changes
   */
  onBrandChange(): void {
    const selectedBrand = this.vehicleForm.get('brand')?.value;
    const brandObj = this.carBrands.find(b => b.brand === selectedBrand);

    this.models = brandObj ? brandObj.models : [];
    this.vehicleForm.patchValue({ model: '' });
  }

  /**
   * Add or Update vehicle
   */
  saveVehicle(): void {
    if (this.vehicleForm.invalid) return;

    if (this.editMode) {
      this.updateVehicle();
    } else {
      this.addVehicle();
    }
  }

  /**
   * Calls API to add new vehicle
   */
  addVehicle(): void {
    this.loaderService.show(); 
    this.vehicleService.addVehicle(this.vehicleForm.value)
      .subscribe({
        next: (res: any) => {
          this.loaderService.hide(); 
          if (res.success) {
            this.savedVehicleNumber = res.data.vehicleNumber;
            this.toastr.success('Vehicle added successfully');
            this.loadVehicles();
            this.closeModal();
            this.resetForm();
            window.location.reload();

               setTimeout(() => {
          const modalElement = document.getElementById('uploadModal');
          if (modalElement) {
            const uploadModal = new (window as any).bootstrap.Modal(modalElement);
            uploadModal.show();
          }
        }, 300);
          }
        },
        error: (err) => {
          this.loaderService.hide(); 
          console.error(err);
          this.toastr.error('Save failed');
        }
      });
  }

  /**
   * Calls API to update existing vehicle
   */
  updateVehicle(): void {
    this.loaderService.show; 
    this.vehicleService
      .updateVehicle(this.editingVehicleId, this.vehicleForm.value)
      .subscribe({
        next: (res) => {
          this.loaderService.hide(); 
          if (res.success) {
            this.toastr.success('Vehicle updated successfully');
            this.loadVehicles();
            this.closeModal();
            this.resetForm();
          }
        },
        error: (err) => {
            this.loaderService.hide(); 
          console.error(err);
          this.toastr.error('Update failed');
        }
      });
  }

  /**
   * Handles file selection with validation
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (!file) {
      this.fileError = 'Please select a file';
      return;
    }

    if (file.type !== 'application/pdf') {
      this.fileError = 'Only PDF allowed';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.fileError = 'File size must be below 10MB';
      return;
    }

    this.selectedFile = file;
    this.fileError = '';
  }

  /**
   * Uploads vehicle document
   */
  uploadDocument(): void {
    this.loaderService.show(); 
    if (!this.selectedFile) {
      this.fileError = 'Please select a valid file';
      return;
    }

    this.vehicleService
      .uploadDocument(this.savedVehicleNumber, this.selectedFile)
      .subscribe({
        next: () => {
          this.loaderService.hide(); 
          this.toastr.success('Document uploaded successfully');
          this.selectedFile = undefined;
          this.fileError = '';
          this.closeUploadModal();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Upload failed');
        },
      });
  }

  /**
   * Opens Edit Modal and patches vehicle data
   */
 openEditModal(vehicle: Vehicle) {
  this.editMode = true;
  this.editingVehicleId = vehicle.id!;

  // Ensure carBrands loaded
  if (!this.carBrands || this.carBrands.length === 0) {
    this.loadCarDataAndOpenModal(vehicle);
    return;
  }

  this.populateFormAndOpenModal(vehicle);
}
loadCarDataAndOpenModal(vehicle: Vehicle) {
  this.http.get<any>('assets/data/car-data.json')
    .subscribe(data => {
      this.carBrands = data.carBrands;
      this.populateFormAndOpenModal(vehicle);
    });
}
onInputChange(event: any) {
  event.target.value = event.target.value.toUpperCase();
}
populateFormAndOpenModal(vehicle: Vehicle) {

  // Patch base fields
  this.vehicleForm.patchValue(vehicle);

  // Set models based on brand
  // const brandObj = this.carBrands.find(b => b.brand === vehicle.brand);
  // this.models = brandObj ? brandObj.models : [];

  // Patch model again
  // this.vehicleForm.patchValue({
  //   model: vehicle.model
  // });

  const modal = new bootstrap.Modal(
    document.getElementById('addVehicleModal')
  );
  modal.show();
}

  /**
   * Opens Delete Confirmation Modal
   */
  openDeleteModal(id: number): void {
    this.deleteVehicleId = id;

    const modalElement = document.getElementById('deleteModal');
    this.deleteModal = new bootstrap.Modal(modalElement);

    this.deleteModal.show();
  }

  /**
   * Calls API to delete vehicle
   */
  confirmDelete(): void {
    this.loaderService.show(); 
    this.vehicleService.deleteVehicle(this.deleteVehicleId)
      .subscribe({
        next: (res) => {
          this.loaderService.hide(); 
          if (res.success) {
            this.toastr.success('Vehicle deleted successfully');
            this.loadVehicles();
          } else {
            this.toastr.error(res.message);
          }
          this.closeDeleteModal();
        },
        error: (err) => {
          this.loaderService.hide(); 
          console.error(err);
          this.toastr.error('Delete failed');
          this.closeDeleteModal();
        }
      });
  }

  /**
   * Closes Add/Edit Modal
   */
  closeModal(): void {
    const modalEl = document.getElementById('addVehicleModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  }

  /**
   * Closes Delete Modal
   */
  closeDeleteModal(): void {
    this.deleteModal?.hide();
  }

 clearForm() {

  this.vehicleForm.reset({
    vehicleNumber: '',
    ownerName: '',
    mobileNumber: '',
  
    currentKm: ''
  });

  // Clear dependent dropdown
  this.models = [];

  // Reset edit mode if needed
  this.editMode = false;
}


  /**
   * Closes Upload Modal
   */
  closeUploadModal(): void {
    const modalElement = document.getElementById('uploadModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance?.hide();
  }

  /**
   * Resets form after save/update
   */
  resetForm(): void {
    this.vehicleForm.reset();
    this.editMode = false;
  }

  nextPage() {
  if (this.page < this.totalPages - 1) {
    this.page++;
    this.loadVehicles();
  }
}

previousPage() {
  if (this.page > 0) {
    this.page--;
    this.loadVehicles();
  }
}
searchVehicle() {
  console.log('Searching for:', this.keyword);
  this.page = 0;
  this.loadVehicles();
}
}
