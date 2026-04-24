import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  formBuilder = inject(FormBuilder);

  regForm = this.formBuilder.group({
    name:[''],
    phNo:[''],
    email:[''],
    gender:[''],
    role:[''],
    drivingL:[''],
    password:['']
  });

  role=signal('');


  router = inject(Router);
  
  register(){
    
    if(this.regForm.value.role == 'customer'){

      this.router.navigate(['cDashboard'])
    }else{
      this.router.navigate(['dDashboard'])
    }
  }
}
