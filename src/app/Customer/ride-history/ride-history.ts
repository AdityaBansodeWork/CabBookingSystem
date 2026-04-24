import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-ride-history',
  imports: [CommonModule],
  templateUrl: './ride-history.html',
  styleUrl: './ride-history.css',
})
export class RideHistory {

  trips = [
    { date: '24 Apr', time: '10:30 AM', type: 'SUV', pickup: 'Kothrud', drop: 'Hinjewadi', price: 450, status: 'Completed' }
  ];
}
