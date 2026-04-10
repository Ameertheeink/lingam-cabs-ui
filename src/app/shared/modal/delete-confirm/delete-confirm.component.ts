import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.css']
})
export class DeleteConfirmComponent {
 @Input() message: string = 'Are you sure?';

  constructor(public activeModal: NgbActiveModal) {}

  confirm() {
    this.activeModal.close('yes');
  }
}
