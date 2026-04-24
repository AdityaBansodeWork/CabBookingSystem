import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-book-ride',
  standalone: true,
  imports: [],
  templateUrl: './book-ride.html',
  styleUrl: './book-ride.css',
})
export class BookRide {
  // private map!: L.Map;
  // private API_KEY = 'pk.2291756e6d48580b693a0848389717a5';

  // ngAfterViewInit(): void {
  //   this.initMap();
  // }

  // private initMap(): void {
  //   // 1. Initialize map on the 'mapLoad' div
  //   this.map = L.map('mapLoad').setView([13.0559, 77.6325], 13);

  //   // 2. Load LocationIQ Tiles
  //   L.tileLayer(`https://{s}-tiles.locationiq.com/v3/streets/r/{z}/{x}/{y}.png?key=${this.API_KEY}`, {
  //     attribution: '&copy; LocationIQ'
  //   }).addTo(this.map);

  //   // 3. IMPORTANT: Fix for "broken tiles" and boundary issues
  //   // This forces Leaflet to recalculate the width/height once the view is stable
  //   setTimeout(() => {
  //     this.map.invalidateSize();
  //   }, 200);

  //   // 4. Fix for missing marker icons (Default Leaflet bug in Angular)
  //   const iconDefault = L.icon({
  //     iconRetinaUrl: 'assets/marker-icon-2x.png',
  //     iconUrl: 'assets/marker-icon.png',
  //     shadowUrl: 'assets/marker-shadow.png',
  //     iconSize: [25, 41],
  //     iconAnchor: [12, 41],
  //     popupAnchor: [1, -34],
  //     shadowSize: [41, 41]
  //   });
  //   L.Marker.prototype.options.icon = iconDefault;
  // }

  onConfirm() {
    alert('Ride Booking Confirmed!');
  }
}