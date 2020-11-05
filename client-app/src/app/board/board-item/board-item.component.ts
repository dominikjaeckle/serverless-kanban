import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import Axios from 'axios';
import { KanBanItem } from 'src/app/_services/board/kanban-item';

@Component({
  selector: 'app-board-item',
  templateUrl: './board-item.component.html',
  styleUrls: ['./board-item.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BoardItemComponent implements OnInit {

  @Input() data: KanBanItem;
  @Output() edit = new EventEmitter<KanBanItem>();
  @Output() delete = new EventEmitter<KanBanItem>();

  timeStamp = new Date().getTime();

  constructor() { }

  ngOnInit(): void { }

  editItem(): void {
    this.edit.emit(this.data);
  }

  deleteItem(): void {
    this.delete.emit(this.data);
  }

  getImgUrl(): string {
    return this.data.imageUrl + '?' + this.timeStamp;
  }

  async checkUrl(url): Promise<boolean> {
    try {
      await Axios.head(url);
      return true;
    } catch (error) {
      if (error.response.status >= 400) {
        return false;
      }
    }
  }
}
