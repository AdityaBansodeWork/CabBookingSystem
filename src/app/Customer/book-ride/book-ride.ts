// import { Component, AfterViewInit,inject } from '@angular/core';
// import * as L from 'leaflet';
// import { HttpClient } from '@angular/common/http';
// import { DriverService } from '../../services/driver-service';
// import '@angular/compiler';
// @Component({
//   selector: 'app-book-ride',
//   standalone: true,
//   imports: [],
//   templateUrl: './book-ride.html',
//   styleUrl: './book-ride.css',
// })
// export class BookRide {

//   private rideService = inject(DriverService);
//   private http = inject(HttpClient);

//   map: any;

//   routeLine: any;
//   pickupMarker: any;
//   dropMarker: any;

//   pickup: string = '';
//   drop: string = '';

//   apiKey = 'pk.2291756e6d48580b693a0848389717a5';

//   ngOnInit() {
//     this.rideService.ride$.subscribe((data) => {
//       this.pickup = data.pickUp;
//       this.drop = data.drop;

//       if (this.pickup && this.drop && this.map) {
//         this.getRouteFromNames();
//       }
//     });
//   }

//   ngAfterViewInit() {
//     // Initialize the map
//     this.map = L.map('map').setView([13.0475, 77.6200], 10);

//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
//       .addTo(this.map);

//     // CRITICAL: Wait 100ms for the browser to finish rendering the div, 
//     // then force the map to fill the container.
//     setTimeout(() => {
//       this.map.invalidateSize();
//     }, 100);

//     if (this.pickup && this.drop) {
//       this.getRouteFromNames();
//     }
//   }

//   //Convert place → coordinates
//   getCoordinates(place: string) {
//     const url = `https://us1.locationiq.com/v1/search?key=${this.apiKey}&q=${place}&format=json`;
//     return this.http.get(url);
//   }

//   //Get route
//   getRoute(start: any, end: any) {
//     const url =
//       `https://router.project-osrm.org/route/v1/driving/` +
//       `${start.lng},${start.lat};${end.lng},${end.lat}` +
//       `?overview=full&geometries=geojson`;

//     this.http.get(url).subscribe({
//       next:(res: any) => {
//       const route = res.routes[0];

//       const distanceKm = (route.distance / 1000).toFixed(2);
//       const durationMin = (route.duration / 60).toFixed(0);

//       this.rideService.setRideDetails(distanceKm,durationMin);

//       console.log('Distance:', distanceKm, 'km');
//       console.log('Time:', durationMin, 'minutes');

//       const coords = route.geometry.coordinates;

//       // [lng, lat] → [lat, lng]
//       const latlngs = coords.map((c: any) => [c[1], c[0]]);

//       this.drawRoute(latlngs, start, end);
//     },
//     error: (err) => {
//       console.log("Route Api Failed", err);
//       this.rideService.setLoading(false);
//       this.rideService.setMsg("Router API Failed");
//     }
//     });
//   }

//   // Draw route
//   drawRoute(latlngs: any, start: any, end: any) {
//   // remove old route
//   if (this.routeLine) {
//     this.map.removeLayer(this.routeLine);
//   }

//   if (this.pickupMarker) {
//     this.map.removeLayer(this.pickupMarker);
//   }

//   if (this.dropMarker) {
//     this.map.removeLayer(this.dropMarker);
//   }

//   // save new route
//   this.routeLine = L.polyline(latlngs, {
//     color: 'blue',
//     weight: 4,
//   }).addTo(this.map);

//   const locationIcon = L.icon({
//     iconUrl: 'location-pin.png',
//     iconSize: [22, 22],
//     iconAnchor: [11, 22],
//     popupAnchor: [0, -22],
//   });

//   // save markers
//   this.pickupMarker = L.marker(
//     [start.lat, start.lng],
//     { icon: locationIcon }
//   )
//     .addTo(this.map)
//     .bindPopup('Pickup');

//   this.dropMarker = L.marker(
//     [end.lat, end.lng],
//     { icon: locationIcon }
//   )
//     .addTo(this.map)
//     .bindPopup('Drop');

//   this.map.fitBounds(this.routeLine.getBounds());

//   this.rideService.setLoading(false);
// }

//   //Convert names → route
//   getRouteFromNames() {

//     this.rideService.setLoading(true);

//     this.getCoordinates(this.pickup).subscribe((startRes: any) => {

//       const start = {
//         lat: parseFloat(startRes[0].lat),
//         lng: parseFloat(startRes[0].lon)
//       };

//       this.getCoordinates(this.drop).subscribe((endRes: any) => {

//         const end = {
//           lat: parseFloat(endRes[0].lat),
//           lng: parseFloat(endRes[0].lon)
//         };

//         this.getRoute(start, end);
//       });
//     });
//   }
// }


import { Component, AfterViewInit, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { Subject, of, take, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

// Service
import { DriverService } from '../../services/driver-service';

@Component({
  selector: 'app-book-ride',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-ride.html',
  styleUrl: './book-ride.css',
})
export class BookRide implements OnInit, AfterViewInit {
  // Use DriverService for everything
  public driverService = inject(DriverService);
  private http = inject(HttpClient);
  private route = inject(Router);

  // Map properties
  map: any;
  routeLine: any;
  pickupMarker: any;
  dropMarker: any;
  apiKey = 'pk.2291756e6d48580b693a0848389717a5';

  // Component State
  pickup: string = '';
  drop: string = '';
  selectedValue: string = '';
  rideCheckoutDetails: any = null;
  msgTimeout: any;

  // Search Logic
  pickupSuggestions: any[] = [];
  dropSuggestions: any[] = [];
  pickupSubject = new Subject<string>();
  dropSubject = new Subject<string>();

  // Observables for template
  loading$ = this.driverService.loading$;
  rideDetails$ = this.driverService.rideDetails$;
  msg$ = this.driverService.msg$;

  ngOnInit() {
    // 1. Sync Map with State updates
    this.driverService.ride$.subscribe((data) => {
      this.pickup = data.pickUp;
      this.drop = data.drop;
      if (this.pickup && this.drop && this.map) {
        this.getRouteFromNames();
      }
    });

    // 2. Pickup Autocomplete (calling driverService directly)
    this.pickupSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value || value.trim().length < 3) {
          this.pickupSuggestions = [];
          return of([]);
        }
        return this.driverService.searchLocation(value);
      })
    ).subscribe((res: any) => this.pickupSuggestions = res || []);

    // 3. Drop Autocomplete (calling driverService directly)
    this.dropSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value || value.trim().length < 3) {
          this.dropSuggestions = [];
          return of([]);
        }
        return this.driverService.searchLocation(value);
      })
    ).subscribe((res: any) => this.dropSuggestions = res || []);
  }

  ngAfterViewInit() {
    this.map = L.map('map').setView([13.0475, 77.6200], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    setTimeout(() => { this.map.invalidateSize(); }, 100);

    if (this.pickup && this.drop) {
      this.getRouteFromNames();
    }
  }

  // --- Search UI Methods ---

  onPickupChange(value: string) {
    if (!value || value.trim().length < 3) this.pickupSuggestions = [];
    this.pickupSubject.next(value);
  }

  onDropChange(value: string) {
    if (!value || value.trim().length < 3) this.dropSuggestions = [];
    this.dropSubject.next(value);
  }

  selectPickup(place: any) {
    this.pickup = place.display_name;
    this.pickupSuggestions = [];
  }

  selectDrop(place: any) {
    this.drop = place.display_name;
    this.dropSuggestions = [];
  }

  // --- Core Map Logic ---

  rideRequest() {
    if (!this.pickup.trim() || !this.drop.trim()) {
      this.driverService.setMsg('Please enter pickup and drop location');
      return;
    }
    this.getRouteFromNames();
  }
  // rideRequest() {
  //   const loginData = localStorage.getItem("user");
  //   let isLoggedIn = false;

  //   if (loginData) {
  //     try {
  //       isLoggedIn = !!JSON.parse(loginData).isLoggedIn;
  //     } catch (e) { console.error(e); }
  //   }

  //   if (!isLoggedIn) {
  //     this.route.navigate(["login"]);
  //     return;
  //   }

  //   if (!this.pickup.trim() || !this.drop.trim()) {
  //     this.driverService.setMsg('Please enter pickup and drop location');
  //     clearTimeout(this.msgTimeout);
  //     this.msgTimeout = setTimeout(() => this.driverService.setMsg(''), 3000);
  //     return;
  //   }

  //   this.driverService.setMsg('');
  //   this.getRouteFromNames();
  // }

  getCoordinates(place: string) {
    return this.http.get(`https://us1.locationiq.com/v1/search?key=${this.apiKey}&q=${place}&format=json`);
  }

  getRouteFromNames() {
    this.driverService.setLoading(true);
    this.getCoordinates(this.pickup).subscribe((startRes: any) => {
      const start = { lat: parseFloat(startRes[0].lat), lng: parseFloat(startRes[0].lon) };
      this.getCoordinates(this.drop).subscribe((endRes: any) => {
        const end = { lat: parseFloat(endRes[0].lat), lng: parseFloat(endRes[0].lon) };
        this.getRoute(start, end);
      });
    });
  }

  getRoute(start: any, end: any) {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;

    this.http.get(url).subscribe({
      next: (res: any) => {
        const route = res.routes[0];
        const distanceKm = (route.distance / 1000).toFixed(2);
        const durationMin = (route.duration / 60).toFixed(0);

        this.driverService.setRideDetails(distanceKm, durationMin);
        this.drawRoute(route.geometry.coordinates.map((c: any) => [c[1], c[0]]), start, end);
      },
      error: () => {
        this.driverService.setLoading(false);
        this.driverService.setMsg("Router API Failed");
      }
    });
  }

  drawRoute(latlngs: any, start: any, end: any) {
    if (this.routeLine) this.map.removeLayer(this.routeLine);
    if (this.pickupMarker) this.map.removeLayer(this.pickupMarker);
    if (this.dropMarker) this.map.removeLayer(this.dropMarker);

    this.routeLine = L.polyline(latlngs, { color: 'blue', weight: 4 }).addTo(this.map);
    const locationIcon = L.icon({ 
        iconUrl: '/location-pin.png', 
        iconSize: [22, 22], 
        iconAnchor: [11, 22] 
    });

    this.pickupMarker = L.marker([start.lat, start.lng], { icon: locationIcon }).addTo(this.map);
    this.dropMarker = L.marker([end.lat, end.lng], { icon: locationIcon }).addTo(this.map);

    this.map.fitBounds(this.routeLine.getBounds());
    this.driverService.setLoading(false);
  }

  // --- Final Booking Logic ---

  checkoutDetails() {
    if (!this.selectedValue) return;

    this.driverService.rideDetails$.pipe(take(1)).subscribe(details => {
      if (!details || !details.distance) return;
      const distance = Number(details.distance);
      let fare = 0;

      switch (this.selectedValue) {
        case 'mini': fare = 50 + distance * 10; break;
        case 'sedan': fare = 70 + distance * 14; break;
        case 'suv': fare = 100 + distance * 18; break;
        case 'premium': fare = 150 + distance * 25; break;
        default: return;
      }

      this.rideCheckoutDetails = {
        pickup: this.pickup,
        drop: this.drop,
        distance: details.distance,
        vehicle: this.selectedValue,
        fare: Number(fare.toFixed(2)),
        gst: Number((fare * 0.18).toFixed(2))
      };
    });
  }

  bookRide() {
    this.route.navigate(['ride-booked']);
  }
}