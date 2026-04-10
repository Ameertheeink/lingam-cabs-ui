import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PollutionService } from '../../../../../core/services/pollution.service';
import { DeleteConfirmComponent } from '../../../../../shared/modal/delete-confirm/delete-confirm.component';
import { PollutionModalComponent } from '../../../../../shared/modal/pollution-modal/pollution-modal.component';
import { Pollution } from '../../../../../shared/models/pollution-service.model';
import { LoaderService } from '../../../../../shared/services/loader.service';

@Component({
  selector: 'app-pollution',
  templateUrl: './pollution.component.html',
  styleUrls: ['./pollution.component.css']
})
export class PollutionComponent implements OnInit {

  pollution:Pollution | null = null;
  vehicleId!: number;

  constructor(   private pollutionService: PollutionService,
      private route: ActivatedRoute,
      private toastr: ToastrService,
      private modalService: NgbModal,
      private loaderService: LoaderService) { }

ngOnInit(): void {
  const idParam = this.route.snapshot.paramMap.get('id');
  this.vehicleId = Number(idParam);

  this.loadPollutionService(); // ✅ load data
}

  loadPollutionService() {
      this.loaderService.show();
    this.pollutionService.getByVehicleIdLatest(this.vehicleId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          if (Array.isArray(res.data)) {
          this.pollution = res.data.length > 0 ? res.data[0] : null; // Assuming API returns an array
        }else{
          this.pollution = res.data; // If API returns a single object
        }
        console.log('Loaded pollution service:', this.pollution);
      } else {
        this.pollution = null;
        this.toastr.info('No pollution service records found');
      }
        this.loaderService.hide();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to load pollution service details');
        this.loaderService.hide();
      }
    });
  }

  openPollutionModal(data: Pollution | null = null) {
    const modalRef = this.modalService.open(PollutionModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    // Pass data to the modal
    modalRef.componentInstance.pollutionData = data;

    modalRef.result.then((result) => {
      if (result && result.data) {
        this.savePollutionService(result.data, result.file,data);
      }
    }).catch(() => {
      // Modal dismissed/cancelled
    });
  }
savePollutionService(formData: any, file: File | null, existingData: Pollution | null) {
  this.loaderService.show();

  const payload: Pollution = {
    ...formData,
    vehicleId: this.vehicleId
  };

  // ✅ Use the correct service method based on ID presence
  const request$ = existingData?.id
    ? this.pollutionService.updatePollutionService(existingData.id, payload) 
    : this.pollutionService.createPollutionService(payload);

  request$.subscribe({
    next: (res) => {
      if (res.success) {
        // ✅ Ensure your Backend sends the ID back in res.data.id
        const recordId = existingData?.id || res.data.id;

        if (file && recordId) {
          this.handleFileUpload(recordId, file);
        } else {
          this.onSaveSuccess('Pollution information saved successfully!');
        }
      }
    },
    error: (err) => {
      console.error(err);
      this.toastr.error('Error saving pollution service');
      this.loaderService.hide();
    }
  });
}

private handleFileUpload(id: number, file: File) {
  // ✅ Don't create FormData here; the service does it!
  this.pollutionService.uploadDocument(id, file).subscribe({
    next: () => this.onSaveSuccess('Information and Certificate uploaded successfully!'),
    error: (err) => {
      console.error(err);
      this.toastr.warning('Record saved, but file upload failed.');
      this.onSaveSuccess();
    }
  });
}
  private onSaveSuccess(message?: string) {
    if (message) this.toastr.success(message);
    this.loadPollutionService(); // Refresh display
    this.loaderService.hide();
  }

 openDeleteModal() {
   if (!this.pollution) return;
 
   // Open the common delete modal
   const modalRef = this.modalService.open(DeleteConfirmComponent, {
     centered: true,
     backdrop: 'static',
     size: 'sm' // Delete modals are usually small
   });
 
   // Pass a custom message to the @Input() in DeleteConfirmComponent
   modalRef.componentInstance.message = 'Are you sure you want to delete this tyre record? This action cannot be undone.';
 
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

  this.pollutionService.deletePollutionService(this.pollution!.id!).subscribe({
    next: (res) => {
      if (res.success) {
        this.toastr.success('Pollution record deleted successfully');
        this.pollution = null; // Clear the UI
      } else {
        this.toastr.error('Failed to delete pollution record');
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
viewDocument(pollution: Pollution) {
  if (!pollution.id) return;
  
  // ✅ Use the API endpoint you built in the controller
  this.pollutionService.downloadDocument(pollution.id).subscribe({
    next: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    },
    error: () => this.toastr.error('Could not retrieve document.')
  });
}
}
