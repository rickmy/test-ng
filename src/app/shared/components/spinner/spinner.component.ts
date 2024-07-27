import { Component, inject } from '@angular/core';
import { SpinnerService } from '@services/spinner/spinner.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  template: ` @if (isLoading()) {
    <div class="loader-container">
      <div class="loader"></div>
    </div>
  }`,
  styleUrl: './spinner.component.css',
})
export class SpinnerComponent {
  private spinnerService = inject(SpinnerService);
  isLoading = this.spinnerService.isLoading;
}
