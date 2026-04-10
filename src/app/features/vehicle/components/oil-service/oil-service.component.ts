import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OilServiceService } from '../../../../core/services/oil-service.service';
import { DeleteConfirmComponent } from '../../../../shared/modal/delete-confirm/delete-confirm.component';
import { OilHistoryComponent } from '../../../../shared/modal/oil-history/oil-history.component';
import { OilServiceModalComponent } from '../../../../shared/modal/oil-service-modal/oil-service-modal.component';
import { Oil } from '../../../../shared/models/oil-service.model';
import { LoaderService } from '../../../../shared/services/loader.service';

@Component({
  selector: 'app-oil-service',
  templateUrl: './oil-service.component.html',
  styleUrls: ['./oil-service.component.css']
})
export class OilServiceComponent implements OnInit {
 @Input() vehicleId!: number;

  oilForm!: FormGroup;

  selectedFile: File | null = null;
   oil: Oil | null = null;
 
  oilModal: any;
 selectedOilId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private oilService: OilServiceService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
     this.vehicleId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.loadOilServices();
  }

  initializeForm() {
    this.oilForm = this.fb.group({
      lastServiceKm: ['', Validators.required],
      serviceIntervalKm: ['', Validators.required],
      lastServiceDate: ['', Validators.required],
      oilBrand: ['', Validators.required],
      oilQuantityLitres: ['', Validators.required],
      serviceVendor: ['', Validators.required]
    });
  }

  createOilService() {
    if (this.oilForm.invalid) return;

    const payload = {
      vehicleId: this.vehicleId,
      ...this.oilForm.value
    };

    this.oilService.createOilService(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success(res.message);
          this.oilForm.reset();
          this.loadOilServices();
        }
      },
      error: () => this.toastr.error('Failed to create oil service')
    });
  }

  loadOilServices() {
    this.loaderService.show();
    this.oilService.getByVehicleIdLatest(this.vehicleId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          if (Array.isArray(res.data)) {
          this.oil = res.data.length > 0 ? res.data[0] : null; // Assuming API returns an array
        }else{
          this.oil = res.data; // If API returns a single object
        }
        console.log('Loaded oil service:', this.oil);
      } else {
        this.oil = null;
        this.toastr.info('No oil service records found');
      }
        this.loaderService.hide();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to load oil service details');
        this.loaderService.hide();
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

uploadBill(serviceId: number, file: File) {
  // ✅ Use the file passed from the modal, not 'this.selectedFile'
  const formData = new FormData();
  formData.append('file', file); 

  this.oilService.uploadBill(serviceId, formData).subscribe({
    next: () => {
      this.toastr.success('Service saved and Bill uploaded');
      this.loadOilServices(); // Refresh data to show the new bill path
      this.loaderService.hide(); // ✅ Hide loader ONLY after upload finishes
    },
    error: (err) => {
      console.error(err);
      this.toastr.error('Data saved, but Bill upload failed');
      this.loaderService.hide();
      this.loadOilServices();
    }
  });
}

  downloadBill(serviceId: number) {
    this.oilService.downloadBill(serviceId)
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'oil-service-bill';
        a.click();
      });
  }

  openAddOilModal() {
  const modalRef = this.modalService.open(OilServiceModalComponent, {
    size: 'lg',
    centered: true,
    backdrop: 'static'
  });

  modalRef.componentInstance.vehicleId = this.vehicleId; // ✅ CORRECT

  modalRef.result.then((result) => {
    if (result) {
      this.handleSave(result);
    }
  });
}

loadOilService(): void {
  this.loaderService.show();
  this.oilService.getByVehicleId(this.vehicleId).subscribe({
    next: (res) => {
      this.loaderService.hide();
      if (res.success && res.data && res.data.length > 0) {
        // Grab the first record from the array
        this.oil = res.data[0]; 
      } else {
        this.oil = null;
        this.toastr.info('No oil service records found');
      }
    },
    error: (err) => {
      this.loaderService.hide();
      console.error(err);
      this.toastr.error('Failed to load oil service details');
    },
  });
}

openEditOilModal(oil: any, event?: Event) {

  // ✅ remove focus (fix warning)
  (event?.target as HTMLElement)?.blur();

  const modalRef = this.modalService.open(OilServiceModalComponent, {
    size: 'lg',
    centered: true,
    backdrop: 'static'
  });

  modalRef.componentInstance.vehicleId = this.vehicleId; // ✅ fixed
  modalRef.componentInstance.oilData = oil;

  modalRef.result.then((result) => {
    if (result) {
      this.handleSave(result);
    }
  });
}
handleSave(event: any) {
  this.loaderService.show();
  
  // payload for create includes vehicleId
  const payload = event.id ? event.data : { ...event.data, vehicleId: this.vehicleId };

  const request$ = event.id 
    ? this.oilService.updateOilService(event.id, payload)
    : this.oilService.createOilService(payload);

  request$.subscribe({
    next: (res) => {
      const serviceId = event.id || res.data.id;
      
      if (event.file && serviceId) {
        // ✅ Pass the file from the event, and don't hide loader yet
        this.uploadBill(serviceId, event.file);
      } else {
        this.toastr.success(`Oil service ${event.id ? 'updated' : 'created'} successfully`);
        this.loadOilServices(); // Use your latest-fetching method
        this.loaderService.hide();
      }
    },
    error: (err) => {
      this.loaderService.hide();
      this.toastr.error('Action failed');
    }
  });
}
  viewOilBill(oil: any) {
  const fileUrl = 'http://localhost:8080/' + oil.serviceBillPath;
  window.open(fileUrl, '_blank');
}


openDeleteModal() {
  if (!this.oil) return;

  const modalRef = this.modalService.open(DeleteConfirmComponent, {
    centered: true,
    backdrop: 'static',
    size: 'sm'
  });

  modalRef.componentInstance.message = 'Are you sure you want to delete this oil service record?';

  modalRef.result.then((result) => {
    if (result === 'yes') {
      this.executeDelete();
    }
  }).catch(() => {
    // Dismissed - do nothing
  });
}

private executeDelete() {
  this.loaderService.show();
  
  // Assuming your service method is named deleteOilService
  this.oilService.deleteOilService(this.oil!.id).subscribe({
    next: (res) => {
      this.loaderService.hide();
      if (res.success) {
        this.toastr.success('Oil service record deleted');
        this.oil = null; // Clear the UI so "No records found" shows
      } else {
        this.toastr.error('Failed to delete record');
      }
    },
    error: (err) => {
      this.loaderService.hide();
      console.error(err);
      this.toastr.error('Error occurred while deleting');
    }
  });
}


  openOilHistoryModal() {
  const modalRef = this.modalService.open(OilHistoryComponent, {
    size: 'lg',
    centered: true,
    backdrop: 'static'
  });

  modalRef.componentInstance.vehicleId = this.vehicleId; // ✅ CORRECT


}
}