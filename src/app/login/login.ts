import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule,RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  router = inject(Router);

  onLogin(form: NgForm) {
    if (form !==null) {

      console.log('Logging in with:', form.value);
      this.router.navigate(['cDashboard']);
    }
  }
}
