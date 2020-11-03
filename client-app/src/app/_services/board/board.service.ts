import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Board } from 'src/app/board/board';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  selectedBoard = new BehaviorSubject<Board>(new Board());

  constructor() { }

  getSelectedBoard(): Observable<Board> {
    return this.selectedBoard;
  }

  setSelectedBoard(board: Board): void {
    this.selectedBoard.next(board);
  }
}
