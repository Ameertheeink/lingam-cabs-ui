import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FitnessService } from '../../../../../core/services/fitness.service';
import { DeleteConfirmComponent } from '../../../../../shared/modal/delete-confirm/delete-confirm.component';
import { FcModalComponent } from '../../../../../shared/modal/fc-modal/fc-modal.component';
import { Fitness } from '../../../../../shared/models/fitness-service.model';
import { LoaderService } from '../../../../../shared/services/loader.service';

@Component({
  selector: 'app-fc',
  templateUrl: './fc.component.html',
  styleUrls: ['./fc.component.css']
})
export class FcComponent implements OnInit {

  fitness: Fitness | null = null;
  vehicleId!: number;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private fitnessService: FitnessService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.vehicleId = Number(idParam);
    this.loadFitnessService();
  }

  // ✅ LOAD FITNESS
  loadFitnessService() {
    this.loaderService.show();

    this.fitnessService.getByVehicleId(this.vehicleId).subscribe({
      next: (res) => {

        if (res.success && res.data) {
          this.fitness = res.data;
        } else {
          this.fitness = null;
        }

        this.loaderService.hide();
      },
      error: () => {
        this.loaderService.hide();
        this.fitness = null;
        this.toastr.error('Failed to load Fitness Certificate');
      }
    });
  }

  // ✅ OPEN MODAL
  openFitnessModal(data: Fitness | null = null) {
    const modalRef = this.modalService.open(FcModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.fitnessData = data;

    modalRef.result.then((result) => {
      if (result && result.data) {
        this.saveFitnessService(result.data, result.file);
      }
    }).catch(() => {});
  }

  // ✅ SAVE (CREATE / UPDATE)
  saveFitnessService(formData: any, file: File | null) {

    this.loaderService.show();

    const payload: Fitness = {
      ...formData,
      vehicleId: this.vehicleId
    };

    const request$ = this.fitness
      ? this.fitnessService.updateFitness(this.fitness.id!, payload)
      : this.fitnessService.createFitness(payload);

    request$.subscribe({
      next: (res) => {

        if (res.success) {

          const recordId = res.data.id;

          if (file) {
            this.handleFileUpload(recordId, file);
          } else {
            this.onSaveSuccess('Fitness saved successfully');
          }
        } else {
          this.toastr.error(res.message || 'Save failed');
          this.loaderService.hide();
        }
      },
      error: () => {
        this.toastr.error('Error saving fitness');
        this.loaderService.hide();
      }
    });
  }

  // ✅ FILE UPLOAD
  private handleFileUpload(id: number, file: File) {

    this.fitnessService.uploadDocument(id, file).subscribe({

      next: (res) => {
        if (res.success) {
          this.onSaveSuccess('Saved & document uploaded');
        } else {
          this.toastr.warning(res.message || 'Upload failed');
          this.onSaveSuccess();
        }
      },

      error: () => {
        this.toastr.warning('Saved but upload failed');
        this.onSaveSuccess();
      }
    });
  }

  // ✅ VIEW DOCUMENT
  viewFCDocument(fitness: Fitness) {

    if (!fitness?.id) return;

    this.loaderService.show();

    this.fitnessService.downloadDocument(fitness.id).subscribe({

      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        this.loaderService.hide();
      },

      error: () => {
        this.loaderService.hide();
        this.toastr.error('Failed to open document');
      }

    });
  }

  // ✅ DELETE MODAL
  openDeleteModal() {

    if (!this.fitness) return;

    const modalRef = this.modalService.open(DeleteConfirmComponent, {
      centered: true,
      backdrop: 'static',
      size: 'sm'
    });

    modalRef.componentInstance.message =
      'Are you sure you want to delete this fitness record?';

    modalRef.result.then((result) => {
      if (result === 'yes') {
        this.executeDelete();
      }
    }).catch(() => {});
  }

  // ✅ DELETE
  private executeDelete() {

    this.loaderService.show();

    this.fitnessService.deleteFitness(this.fitness!.id!).subscribe({
      next: (res) => {

        if (res.success) {
          this.toastr.success('Fitness deleted successfully');
          this.fitness = null;
        } else {
          this.toastr.error(res.message || 'Delete failed');
        }

        this.loaderService.hide();
      },
      error: () => {
        this.toastr.error('Error occurred while deleting');
        this.loaderService.hide();
      }
    });
  }

  // ✅ SUCCESS HANDLER
  private onSaveSuccess(message?: string) {

    if (message) {
      this.toastr.success(message);
    }

    this.loadFitnessService();
    this.loaderService.hide();
  }
}