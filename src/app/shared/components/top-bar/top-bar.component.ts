import { Component } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [],
  template: `
    <header class="top-bar">
      <h3 class="title">Banco</h3>
    </header>
  `,
  styleUrl: './top-bar.component.css',
})
export class TopBarComponent {}
