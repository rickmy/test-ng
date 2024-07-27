import { Injectable, signal } from '@angular/core';
import { Toast } from '@models/toast/toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  display = signal<boolean>(false);
  toast = signal<Toast>({ severity: 'success', detail: '' });

  constructor() {}

  openToast(toast: Toast) {
    this.display.set(true);
    this.toast.set(toast);
  }

  closeToast() {
    this.display.set(false);
  }
}
