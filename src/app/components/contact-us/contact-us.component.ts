import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone:true,
  selector: 'app-contact-us',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
  ],
  providers: [MessageService],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent implements OnInit{

  private http = inject(HttpClient);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  private readonly emailURL ='https://script.google.com/macros/s/AKfycbxoXox65DZhUmFO3zPlUDGB5N88__TvqU26BabKz2bgU8Fe4I3F9y4nsAr75uczKQUQ/exec';

  contactForm!: FormGroup;

 ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      student: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.http.post(this.emailURL, JSON.stringify(this.contactForm.value), {
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    }).subscribe({
      next: (success)=>{
        console.log("success");
      },
      error: (err)=> {
        console.log("error");
      },
    });

    // Process submission (e.g., call backend API)
    console.log('Form Submitted:', this.contactForm.value);

  }
}
