import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { InsuranceService } from '../../../../../core/services/insurance.service';
import { DeleteConfirmComponent } from '../../../../../shared/modal/delete-confirm/delete-confirm.component';
import { Insurance } from '../../../../../shared/models/insurance-service.model';
import { LoaderService } from '../../../../../shared/services/loader.service';
import { InsuranceModalComponent } from '../../../../../shared/modal/insurance-modal/insurance-modal.component';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css']
})
export class InsuranceComponent implements OnInit {


  insurance: Insurance | null = null;
  vehicleId!: number;
   deleteModal: any;

  constructor(
    private modalService: NgbModal,
    private insuranceService: InsuranceService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.vehicleId = Number(idParam);
    this.loadInsuranceService();
  }

loadInsuranceService() {
  this.loaderService.show();
  this.insuranceService.getByVehicleId(this.vehicleId).subscribe({
    next: (res) => {
      // Check if res.data is an array or a single object
      if (res.success && res.data) {
        if (Array.isArray(res.data)) {
          this.insurance = res.data.length > 0 ? res.data[0] : null;
        } else {
          this.insurance = res.data;
        }
        console.log('Final assigned insurance object:', this.insurance);
      } else {
        this.insurance = null;
      }
      this.loaderService.hide();
    },
    error: (err) => {
      console.error('Failed to load:', err);
      this.loaderService.hide();
    }
  });
}

  openInsuranceModal(data: Insurance | null = null) {
    const modalRef = this.modalService.open(InsuranceModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.insuranceData = data;

    modalRef.result.then((result) => {
      if (result && result.data) {
        this.saveInsuranceService(result.data, result.file);
      }
    }).catch(() => {});
  }

  saveInsuranceService(formData: any, file: File | null) {

    this.loaderService.show();

    const payload: Insurance = {
      ...formData,
      vehicleId: this.vehicleId
    };

    const request$ = this.insurance
      ? this.insuranceService.updateInsuranceService(this.insurance.id!, payload)
      : this.insuranceService.createInsuranceService(payload);

    request$.subscribe({

      next: (res) => {

        if (res.success) {

          const insuranceId = res.data.id;
          console.log('Insurance saved with ID:', insuranceId);
  console.log('File present for upload:', file);

          if (file) {

            this.insuranceService.uploadDocument(insuranceId, file).subscribe({
              next: () => {
                this.toastr.success('Insurance saved and document uploaded');
                this.loadInsuranceService();
                this.loaderService.hide();
              },
              error: () => {
                this.toastr.error('Insurance saved but document upload failed');
                this.loaderService.hide();
              }
            });

          } else {
            this.toastr.success('Insurance saved successfully');
            this.loadInsuranceService();
            this.loaderService.hide();
          }

        } else {
          this.toastr.error('Failed to save insurance service');
          this.loaderService.hide();
        }
      },

      error: (err) => {
        console.error('Error saving insurance service', err);
        this.toastr.error('Error saving insurance service');
        this.loaderService.hide();
      }
    });
  }

  viewPolicyDocument(insurance: Insurance) {

    this.insuranceService.downloadDocument(insurance.id!).subscribe(blob => {

      const url = window.URL.createObjectURL(blob);
      window.open(url);

    });
  }
  
  deleteInsurance() {
throw new Error('Method not implemented.');
}

openDeleteModal() {
  if (!this.insurance) return;

  // Open the common delete modal
  const modalRef = this.modalService.open(DeleteConfirmComponent, {
    centered: true,
    backdrop: 'static',
    size: 'sm' // Delete modals are usually small
  });

  // Pass a custom message to the @Input() in DeleteConfirmComponent
  modalRef.componentInstance.message = 'Are you sure you want to delete this insurance policy? This action cannot be undone.';

  // Handle the result when user clicks "Yes, Delete"
  modalRef.result.then((result) => {
    if (result === 'yes') {
      this.executeDelete();
    }
  }).catch(() => {
    // Modal dismissed (Cancel/Click outside) - do nothing
  });
}

private executeDelete() {
  this.loaderService.show();

  this.insuranceService.deleteInsuranceService(this.insurance!.id!).subscribe({
    next: (res) => {
      if (res.success) {
        this.toastr.success('Insurance deleted successfully');
        this.insurance = null; // Clear the UI
      } else {
        this.toastr.error('Failed to delete insurance');
      }
      this.loaderService.hide();
    },
    error: (err) => {
      console.error('Delete Error:', err);
      this.toastr.error('Error occurred while deleting');
      this.loaderService.hide();
    }
  });
}
}