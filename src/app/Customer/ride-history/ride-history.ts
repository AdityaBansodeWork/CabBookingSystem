import { Component, signal } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ride-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ride-history.html',
  styleUrl: './ride-history.css',
})
export class RideHistory {
  // Use 'isDownloading' consistently
  isDownloading = signal<string | null>(null); 

  // Restored the data array so the loop works
  trips = [
    { 
      date: '24 Apr', 
      time: '10:30 AM', 
      type: 'SUV', 
      pickup: 'Kothrud, Pune', 
      drop: 'Hinjewadi Phase 3', 
      price: 450, 
      status: 'Completed' 
    },
    { 
      date: '22 Apr', 
      time: '08:15 PM', 
      type: 'Sedan', 
      pickup: 'Pune Station', 
      drop: 'Airport Terminal 2', 
      price: 0, 
      status: 'Cancelled' 
    }
  ];

  async downloadReceipt(trip: any) {
    this.isDownloading.set(trip.date); 

    const element = document.createElement('div');
    element.style.padding = '50px';
    element.style.width = '600px';
    element.style.background = '#ffffff';
    element.innerHTML = `
      <div style="border: 2px solid #6366f1; padding: 30px; border-radius: 15px; font-family: sans-serif;">
        <h1 style="color: #6366f1; margin-bottom: 5px;">CogRide Official Receipt</h1>
        <p style="color: #64748b;">Ride Date: ${trip.date} | ${trip.time}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <div style="margin-bottom: 20px;">
          <p><strong>Pickup:</strong> ${trip.pickup}</p>
          <p><strong>Drop-off:</strong> ${trip.drop}</p>
          <p><strong>Vehicle Type:</strong> ${trip.type}</p>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: right; border-radius: 10px;">
          <h2 style="margin: 0; color: #1e293b;">Total: ₹${trip.price}.00</h2>
          <small style="color: #10b981;">● Payment Successful</small>
        </div>
        <p style="text-align: center; margin-top: 40px; color: #94a3b8; font-size: 12px;">
          Thank you for choosing CogRide! This is a computer-generated receipt.
        </p>
      </div>
    `;

    element.style.position = 'fixed';
    element.style.top = '-10000px';
    document.body.appendChild(element);

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`CogRide_Receipt_${trip.date.replace(' ', '_')}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error', err);
    } finally {
      document.body.removeChild(element);
      this.isDownloading.set(null);
    }
  }
}