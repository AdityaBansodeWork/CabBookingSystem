import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css'
})
export class Feedback {
  private router = inject(Router);

  // Signals for reactive state
  rating = signal<number>(0);
  isSubmitting = signal<boolean>(false);
  comment = '';

  // Options for quick tags
  tags = ['Professional', 'Clean Car', 'Safe Driving', 'Great Conversation'];
  selectedTags = signal<string[]>([]);

  toggleTag(tag: string) {
    const current = this.selectedTags();
    this.selectedTags.set(
      current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag]
    );
  }

  submitFeedback() {
    if (this.rating() === 0) {
      alert('Please select a star rating before submitting!');
      return;
    }

    this.isSubmitting.set(true);

    // Simulate an API call
    setTimeout(() => {
      this.isSubmitting.set(false);
      alert(`🌟 Success! Thank you for your ${this.rating()}-star feedback.`);
      this.router.navigate(['/cDashboard/rideHistory']);
    }, 1500);
  }
}