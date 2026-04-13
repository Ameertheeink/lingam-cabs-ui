import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import * as bootstrap from 'bootstrap';
import { Vehicle } from '../../../../shared/models/vehicle.model';
import { VehicleService } from '../../../../core/services/vehicle.service';
import { LoaderService } from '../../../../shared/services/loader.service';
import { DeleteConfirmComponent } from '../../../../shared/modal/delete-confirm/delete-confirm.component';
import { ReminderService } from '../../../../core/services/reminder.service';



// declare var bootstrap: any;

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css'],
})
export class VehicleDetailsComponent implements OnInit {
deleteOil(arg0: number|undefined) {
throw new Error('Method not implemented.');
}
clearForm() {
throw new Error('Method not implemented.');
}
  @ViewChild('fileInput') fileInput!: ElementRef;

  vehicle: Vehicle | null = null;
  vehicleId!: number;
  isCollapsed = true;

  images: string[] = [];
  selectedImageFile: File | null = null;

  loadingImages = false;
  deleteModal: any;
  showFileInput = true;
  reminders: { label: string; color: string }[] = [];


  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private location: Location,
    private toastr: ToastrService,
    private loaderService: LoaderService,
   private reminderService: ReminderService,
 
     private modalService: NgbModal

  ) {}

  // ===============================
  // 🔹 INITIAL LOAD
  // ===============================
  ngOnInit(): void {
    this.vehicleId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadVehicle();
    this.loadImages();
    this.loadReminders();  
    
     
  }

  loadReminders(): void {
  this.reminders = [];

  // Oil
  this.reminderService.getOilReminderByVehicle(this.vehicleId).subscribe({
    next: (res) => {
      if (res.success && res.data) {
        this.reminders.push({ label: '⚠ Oil Change Required', color: 'info' });
      }
    }
  });

  // Insurance
  this.reminderService.getInsuranceReminderByVehicle(this.vehicleId).subscribe({
    next: (res) => {
      if (res.success && res.data) {
        this.reminders.push({ label: '⚠ Insurance Renewal', color: 'warning' });
      }
    }
  });

  // Tyre
  this.reminderService.getTyreReminderByVehicle(this.vehicleId).subscribe({
    next: (res) => {
      if (res.success && res.data) {
        this.reminders.push({ label: '⚠ Tyre Check Required', color: 'secondary' });
      }
    }
  });

  // Fitness / FC
  this.reminderService.getFitnessReminderByVehicle(this.vehicleId).subscribe({
    next: (res) => {
      if (res.success && res.data) {
        this.reminders.push({ label: '⚠ FC Renewal Due', color: 'danger' });
      }
    }
  });

  // Pollution
  this.reminderService.getPollutionReminderByVehicle(this.vehicleId).subscribe({
    next: (res) => {
      if (res.success && res.data) {
        this.reminders.push({ label: '⚠ Pollution Certificate Due', color: 'success' });
      }
    }
  });
}

  // ===============================
  // 🔹 Load Vehicle Details
  // ===============================
  loadVehicle(): void {
    this.loaderService.show();
    this.vehicleService.getVehicleById(this.vehicleId).subscribe({
      next: (res) => {
        this.loaderService.hide();
        if (res.success) {
          this.vehicle = res.data;
        } else {
          this.toastr.warning(res.message);
        }
      },
      error: (err) => {
        this.loaderService.hide();
        console.error(err);
        this.toastr.error('Failed to load vehicle details');
      },
    });
  }

  // ===============================
  // 🔹 Load Vehicle Images
  // ===============================
  loadImages(): void {
    this.loaderService.show();
    this.loadingImages = true;

    this.vehicleService.getVehicleImages(this.vehicleId).subscribe({
      next: (res) => {
        this.loaderService.hide();
        if (res.success) {
          this.images = res.data || [];
        } else {
          this.toastr.warning(res.message);
        }
        this.loadingImages = false;
      },
      error: (err) => {
        this.loaderService.hide();
        console.error(err);
        this.toastr.error('Failed to load images');
        this.loadingImages = false;
      },
    });
  }


  // ===============================
  // 🔹 Image File Selection
  // ===============================
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.toastr.error('Only image files allowed');
      return;
    }

    this.selectedImageFile = file;
  }

  // ===============================
  // 🔹 Upload Vehicle Image
  // ===============================
  uploadImage(): void {
    this.loaderService.show();
    if (!this.selectedImageFile) {
      this.loaderService.hide();
      this.toastr.warning('Please select an image');
      return;
    }

    this.vehicleService
      .uploadVehicleImage(this.vehicleId, this.selectedImageFile)
      .subscribe({
        next: (res) => {
          this.loaderService.hide();
          if (res.success) {
            this.toastr.success(res.message);

            // Reset file input
            this.selectedImageFile = null;
            // this.fileInput.nativeElement.value = '';

            this.showFileInput = false;
            setTimeout(() => {
              this.showFileInput = true;
            }, 0);

            // Reload images
            this.loadImages();

            setTimeout(() => {
  const carousel = document.getElementById('carouselExample');
  if (carousel) {
    const bsCarousel = bootstrap.Carousel.getInstance(carousel)
      || new bootstrap.Carousel(carousel);

    bsCarousel.to(0); // Go to upload slide
  }
}, 300);
          } else {
            this.toastr.warning(res.message);
          }
        },
        error: (err) => {
          this.loaderService.hide();
          console.error(err);
          this.toastr.error('Upload failed');
        },
      });
  }

  // ===============================
  // 🔹 Open Delete Confirmation Modal
  // ===============================
  // openDeleteModal(): void {
  //   const modalElement = document.getElementById('deleteModal');
  //   this.deleteModal = new bootstrap.Modal(modalElement);
  //   this.deleteModal.show();
  // }

  // ===============================
  // 🔹 Confirm Delete All Images
  // ===============================
  confirmDelete(): void {
    this.loaderService.show();
    this.vehicleService.deleteAllVehicleImages(this.vehicleId).subscribe({
      next: (res) => {
        this.loaderService.hide();
        if (res.success) {
          this.toastr.success(res.message);
          this.images = [];
          
        } else {
          this.toastr.warning(res.message);
        }
      },
      error: (err) => {
        this.loaderService.hide();
        console.error(err);
        this.toastr.error('Delete failed');
      },
    });
  }

  // ===============================
  // 🔹 Close Delete Modal
  // ===============================

openDeleteModal(): void {
   const modalRef = this.modalService.open(DeleteConfirmComponent, {
    centered: true,
    backdrop: 'static'
  });

  modalRef.componentInstance.message =
    'Are you sure you want to delete all images?';

  modalRef.result.then((result) => {
    if (result === 'yes') {
      this.confirmDelete(); // ✅ call your existing method
    }
  });
}
  // ===============================
  // 🔹 Download Document
  // ===============================
 downloadDoc(): void {
  if (!this.vehicle) {
    this.toastr.warning('Vehicle data not loaded');
    return;
  }

  this.vehicleService
    .downloadDocument(this.vehicle.vehicleNumber)
    .subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vehicle-document.pdf';
      a.click();
    });
}

  // ===============================
  // 🔹 Back Navigation
  // ===============================
  goBack(): void {
    this.location.back();
  }

  viewImage(img: string) {
    window.open('http://localhost:8080/uploads/' + img, '_blank');
  }



}