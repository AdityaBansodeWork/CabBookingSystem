// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })


// export class DriverService {

//   rideSubject = new BehaviorSubject<any>({
//     pickUp: '',
//     drop: ''
//   });
//   ride$ = this.rideSubject;

//   setRide(pickUp: string, drop: string) {
//     this.rideSubject.next({ pickUp, drop });
//   }

//   loadingSubject = new BehaviorSubject<boolean>(false);
//   loading$ = this.loadingSubject;
  
//   setLoading(val: boolean) {
//     this.loadingSubject.next(val);
//   }

//   rideDetailsSubject = new BehaviorSubject<any>({
//     Distance: '',
//     Time: ''
//   })

//   msgSubject = new BehaviorSubject<String>('')

//   msg$=this.msgSubject;

//   rideDetails$ = this.rideDetailsSubject;

//   setMsg(msg:string){
//     this.msgSubject.next(msg);
//   }

//   setRideDetails(distance:string, time:string) {
//     console.log("here.........")
//     console.log(distance, time);
//     if(Number(distance)>60){
//       this.msgSubject.next(
//       "We can't process rides beyond 60 km from pickup"
//     );
//       return;
//     }

//     this.msgSubject.next('');
//     this.rideDetailsSubject.next({distance, time});
//   }


// }


import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private http = inject(HttpClient);
  private apiKey = 'pk.2291756e6d48580b693a0848389717a5';

  rideSubject = new BehaviorSubject<any>({ pickUp: '', drop: '' });
  ride$ = this.rideSubject.asObservable();

  setRide(pickUp: string, drop: string) {
    this.rideSubject.next({ pickUp, drop });
  }

  loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  setLoading(val: boolean) {
    this.loadingSubject.next(val);
  }

  // FIXED: Standardized to lowercase keys to match template access
  rideDetailsSubject = new BehaviorSubject<any>({ distance: '', time: '' });
  rideDetails$ = this.rideDetailsSubject.asObservable();

  msgSubject = new BehaviorSubject<string>('');
  msg$ = this.msgSubject.asObservable();

  setMsg(msg: string) {
    this.msgSubject.next(msg);
  }

  setRideDetails(distance: string, time: string) {
    if (Number(distance) > 60) {
      this.msgSubject.next("We can't process rides beyond 60 km from pickup");
      return;
    }
    this.msgSubject.next('');
    // Updates the subject which the UI is listening to via (rideDetails$ | async)
    this.rideDetailsSubject.next({ distance, time });
  }

  searchLocation(query: string) {
    return this.http.get<any[]>(
      'https://api.locationiq.com/v1/autocomplete',
      {
        params: {
          key: this.apiKey,
          q: query,
          countrycodes: 'IN',
          limit: 5,
          dedupe: 1,
          addressdetails: 1
        }
      }
    );
  }
}