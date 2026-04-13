import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Vehicle } from '../../../../shared/models/vehicle.model';
import { VehicleService } from '../../../../core/services/vehicle.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { DeleteConfirmComponent } from '../../../../shared/modal/delete-confirm/delete-confirm.component';

// ✅ Remove: declare var bootstrap: any;

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

  page = 0;
  size = 5;
  totalPages = 0;
  keyword = '';
  totalElements = 0;

  // ✅ NgbModal references
  private addVehicleModalRef: any;
  private uploadModalRef: any;

  constructor(
    private vehicleService: VehicleService,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private modalService: NgbModal  // ✅ inject NgbModal
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadVehicles();
    this.loadCarData();
  }

  initializeForm(): void {
    this.vehicleForm = this.fb.group({
      vehicleNumber: ['', [Validators.required, Validators.pattern('^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$'), Validators.maxLength(10)]],
      ownerName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
      currentKm: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(0)]],
    });
  }

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
        this.toastr.error('Failed to load vehicles');
      }
    });
  }

  loadCarData(): void {
    this.http.get<any>('assets/data/car-data.json').subscribe(data => {
      this.carBrands = data.carBrands;
    });
  }

  onVehicleNumberInput(): void {
    const value = this.vehicleForm.get('vehicleNumber')?.value;
    if (value) this.vehicleForm.patchValue({ vehicleNumber: value.toUpperCase() }, { emitEvent: false });
  }

  onOwnerNameInput(): void {
    const value = this.vehicleForm.get('ownerName')?.value;
    if (value) this.vehicleForm.patchValue({ ownerName: value.toUpperCase() }, { emitEvent: false });
  }

  allowOnlyNumbers(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  onBrandChange(): void {
    const selectedBrand = this.vehicleForm.get('brand')?.value;
    const brandObj = this.carBrands.find(b => b.brand === selectedBrand);
    this.models = brandObj ? brandObj.models : [];
    this.vehicleForm.patchValue({ model: '' });
  }

  saveVehicle(): void {
    if (this.vehicleForm.invalid) return;
    this.editMode ? this.updateVehicle() : this.addVehicle();
  }

  addVehicle(): void {
    this.loaderService.show();
    this.vehicleService.addVehicle(this.vehicleForm.value).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        if (res.success) {
          this.savedVehicleNumber = res.data.vehicleNumber;
          this.toastr.success('Vehicle added successfully');
          this.loadVehicles();
          this.closeAddModal();   // ✅
          this.resetForm();
        }
      },
      error: (err) => {
        this.loaderService.hide();
        this.toastr.error('Save failed');
      }
    });
  }

  updateVehicle(): void {
    this.loaderService.show();
    this.vehicleService.updateVehicle(this.editingVehicleId, this.vehicleForm.value).subscribe({
      next: (res) => {
        this.loaderService.hide();
        if (res.success) {
          this.toastr.success('Vehicle updated successfully');
          this.loadVehicles();
          this.closeAddModal();   // ✅
          this.resetForm();
        }
      },
      error: (err) => {
        this.loaderService.hide();
        this.toastr.error('Update failed');
      }
    });
  }

  // ✅ Open Add/Edit Modal using NgbModal
  openAddModal(content: any): void {
    this.editMode = false;
    this.resetForm();
    this.addVehicleModalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static',centered:true });
  }

  // ✅ Open Edit Modal using NgbModal
  openEditModal(vehicle: Vehicle, content: any): void {
    this.editMode = true;
    this.editingVehicleId = vehicle.id!;
    this.vehicleForm.patchValue(vehicle);
    this.addVehicleModalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static' ,centered:true});
  }

  closeAddModal(): void {
    this.addVehicleModalRef?.close();
  }

  // ✅ Open Delete Modal using DeleteConfirmComponent
  openDeleteModal(id: number): void {
    this.deleteVehicleId = id;

    const modalRef = this.modalService.open(DeleteConfirmComponent, {
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.message = 'Are you sure you want to delete this vehicle?';

    modalRef.result.then((result) => {
      if (result === 'yes') {
        this.confirmDelete();
      }
    }).catch(() => {});
  }

  confirmDelete(): void {
    this.loaderService.show();
    this.vehicleService.deleteVehicle(this.deleteVehicleId).subscribe({
      next: (res) => {
        this.loaderService.hide();
        if (res.success) {
          this.toastr.success('Vehicle deleted successfully');
          this.loadVehicles();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err) => {
        this.loaderService.hide();
        this.toastr.error('Delete failed');
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) { this.fileError = 'Please select a file'; return; }
    if (file.type !== 'application/pdf') { this.fileError = 'Only PDF allowed'; return; }
    if (file.size > 10 * 1024 * 1024) { this.fileError = 'File size must be below 10MB'; return; }
    this.selectedFile = file;
    this.fileError = '';
  }

  clearForm() {
    this.vehicleForm.reset({ vehicleNumber: '', ownerName: '', mobileNumber: '', currentKm: '' });
    this.models = [];
    this.editMode = false;
  }

  resetForm(): void {
    this.vehicleForm.reset();
    this.editMode = false;
  }

  nextPage() {
    if (this.page < this.totalPages - 1) { this.page++; this.loadVehicles(); }
  }

  previousPage() {
    if (this.page > 0) { this.page--; this.loadVehicles(); }
  }

  searchVehicle() {
    this.page = 0;
    this.loadVehicles();
  }
}