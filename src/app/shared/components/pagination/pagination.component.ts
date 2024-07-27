import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent implements OnInit {
  @Input() total = 0;
  @Input() page = 1;
  @Input() row = 5;
  @Output() changePage = new EventEmitter<number>();
  @Output() changeRow = new EventEmitter<number>();

  optionsRow = [5, 10, 20];
  listPages: number[] = [];
  totalPage = 0;

  ngOnInit() {
    this.calculateTotalPages();
  }

  calculateTotalPages() {
    this.totalPage = Math.ceil(this.total / this.row);
    this.listPages = Array.from({ length: this.totalPage }, (_, i) => i + 1);
  }

  changePageCurrent(pageSelected: number) {
    this.page = pageSelected;
    this.changePage.emit(this.page);
  }

  changeCountedRow() {
    this.calculateTotalPages();
    this.changeRow.emit(this.row);
  }
}
