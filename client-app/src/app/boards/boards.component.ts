import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import * as d3 from 'd3';
import { KanBanBoard } from '../_services/board/kanban-board';
import { BoardService } from '../_services/board/board.service';
import { KanbanBoardRequest } from '../_services/board/kanbanBoard-request';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BoardsComponent implements OnInit {

  boards: KanBanBoard[] = [];

  constructor(public dialog: MatDialog,
              private router: Router,
              private boardService: BoardService) { }

  async ngOnInit(): Promise<void> {

    // retrieve kan ban boards from the backend
    this.boards = await this.boardService.getKanbanBoards();

    // this.openBoard(this.boards[1]); // TODO: REMOVE ONLY FOR TESTING
  }

  async createBoard(): Promise<void> {
    const dialogRef = this.dialog.open(CreateBoardDialogComponent, {
      width: '400px',
      data: { boardName: '' }
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      const parent = d3.select('#kanban-boards');
      const newBoard: KanBanBoard = await this.boardService.createKanbanBoard({
        title: result
      });
      this.boards.push(newBoard);
    }
  }

  async editBoard(board: KanBanBoard): Promise<void> {
    const dialogRef = this.dialog.open(CreateBoardDialogComponent, {
      width: '400px',
      data: { boardName: board.title }
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      const updatedBoard: KanBanBoard = await this.boardService.updateKanbanBoard(board.boardId, {
        title: result
      });
      board.title = updatedBoard.title;
    }
  }

  async deleteBoard(board: KanBanBoard): Promise<void> {
    await this.boardService.deleteKanbanBoard(board.boardId);
    const index = this.boards.indexOf(board);
    if (index !== -1) {
      this.boards.splice(index, 1);
    }
  }

  openBoard(board: KanBanBoard): void {
    this.boardService.setSelectedBoard(board);
    this.router.navigate(['./', { outlets: { boardSelection: 'board' } }]);
  }
}

@Component({
  selector: 'app-create-board',
  templateUrl: 'create-board.html',
})
export class CreateBoardDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CreateBoardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: KanbanBoardRequest) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
