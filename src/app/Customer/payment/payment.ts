import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class Payment {
  // Toggle this based on your backend logic
  hasPendingPayment = signal<boolean>(true); 
  
  selectedMethod = signal<string>('wallet');
  isProcessing = signal<boolean>(false);
  
  // Data
  pendingRide = {
    id: '#TRX-9920',
    fare: 455.00,
    date: 'Today, 10:45 AM',
    route: 'Kothrud to Hinjewadi'
  };

  history = [
    { id: '#TRX-9850', date: '21 Apr', amount: 320, status: 'Success', method: 'Wallet' },
    { id: '#TRX-9812', date: '18 Apr', amount: 550, status: 'Success', method: 'UPI' },
    { id: '#TRX-9701', date: '15 Apr', amount: 120, status: 'Success', method: 'Wallet' }
  ];

  processPayment() {
    this.isProcessing.set(true);
    setTimeout(() => {
      this.isProcessing.set(false);
      this.hasPendingPayment.set(false); // Switch to history view after payment
      alert('💳 Payment Successful!');
    }, 2000);
  }
}