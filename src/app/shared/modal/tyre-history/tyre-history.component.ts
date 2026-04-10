import { Component, Input, OnInit } from '@angular/core';
import { Tyre } from '../../models/tyre-service.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TyreService } from '../../../core/services/tyre.service';


@Component({
  selector: 'app-tyre-history',
  templateUrl: './tyre-history.component.html',
  styleUrls: ['./tyre-history.component.css']
})
export class TyreHistoryComponent implements OnInit {

   @Input() vehicleId!: number;
  
    tyreList: Tyre[] = [];
    isProcessing = false;
      currentPage = 1; // NgbPagination is 1-indexed
  pageSize = 5;    // You can set this to 2 as per your API example
  totalElements = 0;
  
    constructor(
      public activeModal: NgbActiveModal,
      private tyreService: TyreService
    ) {}
  
    ngOnInit(): void {
      this.loadTyreHistory(this.currentPage); // 🔥 call API here
    }
  
    // loadTyreHistory() {
    //   this.isProcessing = true;
  
    //   this.tyreService.getByVehicleId(this.vehicleId).subscribe({
    //     next: (res) => {
    //       if (res.success) {
    //         this.tyreList = res.data;
    //       }
    //       this.isProcessing = false;
    //     },
    //     error: (err) => {
    //       console.error('Failed to load tyre history', err);
    //       this.isProcessing = false;
    //     }
    //   });
    // }

     viewBill(tyre: any) {
  const fileUrl = 'http://localhost:8080/' + tyre.billPath; // Adjust based on your API response
  window.open(fileUrl, '_blank');
}

 loadTyreHistory(page: number) {
    this.isProcessing = true;
    this.currentPage = page;

    // API expects 0-indexed page, so we use page - 1
    this.tyreService.getByVehicleIdPaginated(this.vehicleId, this.currentPage - 1, this.pageSize)
      .subscribe({
        next: (res: any) => {
          // Based on your JSON structure:
          this.tyreList = res.content; 
          this.totalElements = res.totalElements;
          this.isProcessing = false;
        },
        error: (err) => {
          console.error('Failed to load history', err);
          this.isProcessing = false;
        }
      });
  }

}
