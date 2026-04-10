import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RegistrationService } from '../../../../../core/services/registration.service';
import { DeleteConfirmComponent } from '../../../../../shared/modal/delete-confirm/delete-confirm.component';
import { RcModalComponent } from '../../../../../shared/modal/rc-modal/rc-modal.component';
import { VehicleRegistration } from '../../../../../shared/models/vehicle-registration.model';
import { LoaderService } from '../../../../../shared/services/loader.service';

@Component({
  selector: 'app-rc',
  templateUrl: './rc.component.html',
  styleUrls: ['./rc.component.css']
})
export class RcComponent implements OnInit {

registration: VehicleRegistration|null = null;
 vehicleId!: number;
deleteMdodal: any;
  constructor(
    private modalService: NgbModal,
    private registrationService: RegistrationService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private loaderService: LoaderService
  ) {}
ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.vehicleId = Number(idParam);
    this.loadRegistrationService();
  }
  loadRegistrationService() {
    this.loaderService.show();
  this.registrationService.getByVehicleId(this.vehicleId).subscribe({
    next: (res) => {
      // Check if res.data is an array or a single object
      if (res.success && res.data) {
        if (Array.isArray(res.data)) {
          this.registration = res.data.length > 0 ? res.data[0] : null;
        } else {
          this.registration = res.data;
        }
        console.log('Final assigned registration object:', this.registration);
      } else {
        this.registration = null;
      }
      this.loaderService.hide();
    },
    error: (err) => {
      console.error('Failed to load:', err);
      this.loaderService.hide();
    }
  });
  }

    openRegistrationModal(data: VehicleRegistration | null = null) {
      const modalRef = this.modalService.open(RcModalComponent, {
        size: 'xl',
        centered: true,
        backdrop: 'static',
        scrollable: true,
        windowClass: 'custom-modal-width'
      });
  
      modalRef.componentInstance.registrationData = data;
  
      modalRef.result.then((result) => {
        if (result && result.data) {
          this.saveRegistrationService(result.data, result.file);
        }
      }).catch(() => {});
    }
  saveRegistrationService(data: VehicleRegistration, file: any) {
     this.loaderService.show();
   
       const payload: VehicleRegistration = {
         ...data,
         vehicleId: this.vehicleId
       };
   
       const request$ = this.registration
         ? this.registrationService.updateVehicleRegistration(this.registration.id!, payload)
         : this.registrationService.createVehicleRegistration(payload);
   
       request$.subscribe({
   
         next: (res) => {
   
           if (res.success) {
   
             const insuranceId = res.data.id;
             console.log('Registration saved with ID:', insuranceId);
     console.log('File present for upload:', file);
   
             if (file) {
   
               this.registrationService.uploadDocument(insuranceId, file).subscribe({
                 next: () => {
                   this.toastr.success('Registration details saved and document uploaded');
                   this.loadRegistrationService();
                   this.loaderService.hide();
                 },
                 error: () => {
                   this.toastr.error('Registration saved but document upload failed');
                   this.loaderService.hide();
                 }
               });
   
             } else {
               this.toastr.success('Registration saved successfully');
               this.loadRegistrationService();
               this.loaderService.hide();
             }
   
           } else {
             this.toastr.error('Failed to save registration service');
             this.loaderService.hide();
           }
         },
   
         error: (err) => {
           console.error('Error saving registration service', err);
           this.toastr.error('Error saving registration service');
           this.loaderService.hide();
         }
       });
  }

  openDeleteModal() {
    if (!this.registration) return;
  
    // Open the common delete modal
    const modalRef = this.modalService.open(DeleteConfirmComponent, {
      centered: true,
      backdrop: 'static',
      size: 'sm' // Delete modals are usually small
    });
  
    // Pass a custom message to the @Input() in DeleteConfirmComponent
    modalRef.componentInstance.message = 'Are you sure you want to delete this vehicle registration? This action cannot be undone.';
  
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

  this.registrationService.deleteVehicleRegistration(this.registration!.id).subscribe({
    next: (res) => {
      if (res) {
        this.toastr.success('Registration deleted successfully');
        this.registration = null; // Clear the UI
      } else {
        this.toastr.error('Failed to delete registration');
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
  viewRCDocument(registration: VehicleRegistration) {

    this.registrationService.downloadDocument(registration.id!).subscribe(blob => {

      const url = window.URL.createObjectURL(blob);
      window.open(url);

    });
  }

}
