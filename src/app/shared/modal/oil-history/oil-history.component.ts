import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Input, OnInit } from '@angular/core';
import { Oil } from '../../models/oil-service.model';
import { OilServiceService } from '../../../core/services/oil-service.service';

@Component({
  selector: 'app-oil-history',
  templateUrl: './oil-history.component.html',
  styleUrls: ['./oil-history.component.css']
})
export class OilHistoryComponent implements OnInit {

  @Input() vehicleId!: number;

  oilList: Oil[] = [];
  isProcessing = false;
  // Pagination Properties
  currentPage = 1; // NgbPagination is 1-indexed
  pageSize = 5;    // You can set this to 2 as per your API example
  totalElements = 0;

  constructor(
    public activeModal: NgbActiveModal,
    private oilService: OilServiceService
  ) {}

  ngOnInit(): void {
    this.loadOilHistory(this.currentPage);// 🔥 call API here
  }

 loadOilHistory(page: number) {
    this.isProcessing = true;
    this.currentPage = page;

    // API expects 0-indexed page, so we use page - 1
    this.oilService.getByVehicleIdPaginated(this.vehicleId, this.currentPage - 1, this.pageSize)
      .subscribe({
        next: (res: any) => {
          // Based on your JSON structure:
          this.oilList = res.content; 
          this.totalElements = res.totalElements;
          this.isProcessing = false;
        },
        error: (err) => {
          console.error('Failed to load history', err);
          this.isProcessing = false;
        }
      });
  }
   viewOilBill(oil: any) {
  const fileUrl = 'http://localhost:8080/' + oil.serviceBillPath;
  window.open(fileUrl, '_blank');
}
 }