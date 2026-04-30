import { Routes } from '@angular/router';
import { Login } from './login/login';
import { BookRide } from './Customer/book-ride/book-ride';

export const routes: Routes = [
    {path:"", component:Login},
    {path:"login", loadComponent:()=>import('./login/login').then(r=>r.Login)},
    {path:"register", loadComponent:()=>import('./register/register').then(r=>r.Register)},
    {path:"cDashboard", loadComponent:()=>import('./Customer/customer-dashboard/customer-dashboard').then(r=>r.CustomerDashboard),
        children:[
            {path:"", redirectTo:'bookRide', pathMatch:'full'},
            {path:"bookRide", loadComponent:()=>import('./Customer/book-ride/book-ride').then(r=>r.BookRide)},
            {path:"payment", loadComponent:()=>import('./Customer/payment/payment').then(r=>r.Payment)},
            {path:"rideHistory", loadComponent:()=>import('./Customer/ride-history/ride-history').then(r=>r.RideHistory)},
            {path:"rideStatus", loadComponent:()=>import('./Customer/ride-status/ride-status').then(r=>r.RideStatus)},
            {path:"profile", loadComponent:()=>import('./Customer/profile/profile').then(r=>r.Profile)},
            {path:"feedback", loadComponent:()=>import('./feedback/feedback').then(r=>r.Feedback)},
        ]
    },
    {path:"dDashboard", loadComponent:()=>import('./Driver/driver-dashboard/driver-dashboard').then(r=>r.DriverDashboard),
        children:[
            
            {path:"rideHandling", loadComponent:()=>import('./Driver/ride-handling/ride-handling').then(r=>r.RideHandling)},
        ]
    },
    {path:"feedback", loadComponent:()=>import('./feedback/feedback').then(r=>r.Feedback)},
    {path:"**", redirectTo:'login'}
];
