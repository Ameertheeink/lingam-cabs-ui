import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TyreService } from '../../../../../core/services/tyre.service';
import { DeleteConfirmComponent } from '../../../../../shared/modal/delete-confirm/delete-confirm.component';
import { TyreHistoryComponent } from '../../../../../shared/modal/tyre-history/tyre-history.component';
import { TyreModalComponent } from '../../../../../shared/modal/tyre-modal/tyre-modal.component';
import { Tyre } from '../../../../../shared/models/tyre-service.model';
import { LoaderService } from '../../../../../shared/services/loader.service';

@Component({
  selector: 'app-tyre',
  templateUrl: './tyre.component.html',
  styleUrls: ['./tyre.component.css']
})
export class TyreComponent implements OnInit {

  tyre: Tyre | null = null;
  vehicleId!: number;

  constructor(
    private tyreService: TyreService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.vehicleId = Number(idParam);
    this.loadTyreService();
  }


  loadTyreService() {
    this.loaderService.show();
    this.tyreService.getByVehicleIdLatest(this.vehicleId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          if (Array.isArray(res.data)) {
          this.tyre = res.data.length > 0 ? res.data[0] : null; // Assuming API returns an array
        }else{
          this.tyre = res.data; // If API returns a single object
        }
        console.log('Loaded tyre service:', this.tyre);
      } else {
        this.tyre = null;
        this.toastr.info('No tyre service records found');
      }
        this.loaderService.hide();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to load tyre service details');
        this.loaderService.hide();
      }
    });
  }

  /**
   * Unified method to handle both Add and Edit
   * @param data - existing tyre data if editing, null if adding new
   */
  openTyreModal(data: Tyre | null = null) {
    const modalRef = this.modalService.open(TyreModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    // Pass data to the modal
    modalRef.componentInstance.tyreData = data;

    modalRef.result.then((result) => {
      if (result && result.data) {
        this.saveTyreService(result.data, result.file,data);
      }
    }).catch(() => {
      // Modal dismissed/cancelled
    });
  }

saveTyreService(formData: any, file: File | null, existingData: Tyre | null) {
  this.loaderService.show();

  const payload: Tyre = {
    ...formData,
    vehicleId: this.vehicleId
  };

  const request$ = existingData?.id
    ? this.tyreService.updateTyreService(existingData.id, payload) // ✅ edit
    : this.tyreService.createTyreService(payload);                // ✅ create

  request$.subscribe({
    next: (res) => {
      if (res.success) {
        const newId = existingData?.id || res.data.id;

        if (file) {
          this.handleFileUpload(newId, file);
        } else {
          this.onSaveSuccess('Tyre information saved successfully!');
        }
      }
    },
    error: () => {
      this.toastr.error('Error saving tyre service');
      this.loaderService.hide();
    }
  });
}

  private handleFileUpload(id: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    this.tyreService.uploadBill(id, formData).subscribe({
      next: () => this.onSaveSuccess('Information and Bill uploaded successfully!'),
      error: () => {
        this.toastr.warning('Service saved, but bill upload failed.');
        this.onSaveSuccess(); // Still refresh data
      }
    });
  }

  private onSaveSuccess(message?: string) {
    if (message) this.toastr.success(message);
    this.loadTyreService(); // Refresh display
    this.loaderService.hide();
  }

 openDeleteModal() {
   if (!this.tyre) return;
 
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

  this.tyreService.deleteTyreService(this.tyre!.id!).subscribe({
    next: (res) => {
      if (res.success) {
        this.toastr.success('Tyre record deleted successfully');
        this.tyre = null; // Clear the UI
      } else {
        this.toastr.error('Failed to delete tyre record');
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
  viewBill(tyre: any) {
  const fileUrl = 'http://localhost:8080/' + tyre.billPath; // Adjust based on your API response
  window.open(fileUrl, '_blank');
}

  openTyreHistoryModal() {
  const modalRef = this.modalService.open(TyreHistoryComponent, {
    size: 'lg',
    centered: true,
    backdrop: 'static'
  });

  modalRef.componentInstance.vehicleId = this.vehicleId; // ✅ CORRECT


}
}