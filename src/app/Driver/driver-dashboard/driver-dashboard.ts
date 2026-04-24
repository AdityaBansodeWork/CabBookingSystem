import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-driver-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './driver-dashboard.html',
  styleUrl: './driver-dashboard.css',
})
export class DriverDashboard {

  isOnline: boolean = false;

  // Fixes "Property 'toggleStatus' does not exist"
  toggleStatus(event: any) {
    this.isOnline = event.target.checked;
    
    if (this.isOnline) {
      console.log("Driver is now looking for rides...");
      // Add logic here to update your MongoDB via a Service
    } else {
      console.log("Driver went offline.");
    }
  }


forceOnline() {
  this.isOnline = true;
  
  // Also update the physical switch in the UI
  const switchElement = document.getElementById('statusSwitch') as HTMLInputElement;
  if (switchElement) {
    switchElement.checked = true;
  }

  console.log("Driver forced online via overlay button.");
}
}
