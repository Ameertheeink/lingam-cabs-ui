import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
logout() {
throw new Error('Method not implemented.');
}
  @Output() toggleEvent = new EventEmitter<void>();

  onToggle() {
    this.toggleEvent.emit();
  }
  
}
