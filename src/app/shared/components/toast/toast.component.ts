import { Component, inject, AfterViewInit } from '@angular/core';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent implements AfterViewInit {
  private _toastService = inject(ToastService);
  toast = this._toastService.toast;
  display = this._toastService.display;

  ngAfterViewInit() {
    this.automaticClose();
  }

  automaticClose() {
    setTimeout(() => {
      this._toastService.closeToast();
    }, 3000);
  }
}
