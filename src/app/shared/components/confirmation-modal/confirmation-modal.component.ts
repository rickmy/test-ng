import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [],
  template: ` <div class="modal-background" id="modalBackground">
    <div class="modal">
      <div class="modal-body">
        <p>Estas seguro de eliminar el producto {{ title }}</p>
      </div>
      <div class="modal-footer">
        <button (click)="closeAction()" class="btn-secondary">Cerrar</button>
        <button (click)="confirmAction()" class="btn-add">Confirmar</button>
      </div>
    </div>
  </div>`,
  styleUrl: './confirmation-modal.component.css',
})
export class ConfirmationModalComponent {
  @Input() title!: string;

  @Output() confirm = new EventEmitter<boolean>();
  @Output() cancel = new EventEmitter<boolean>();

  closeAction() {
    this.cancel.emit(true);
  }

  confirmAction() {
    this.confirm.emit(true);
  }
}
