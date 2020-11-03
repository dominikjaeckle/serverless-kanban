import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import * as d3 from 'd3';
import { Board } from '../board/board';
import { BoardService } from '../_services/board/board.service';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BoardsComponent implements OnInit {

  boards: Board[] = [];

  constructor(public dialog: MatDialog,
              private router: Router,
              private boardService: BoardService) { }

  ngOnInit(): void {

    // TODO: retrieve all boards from the backend.

    for (let i = 0; i < 10; ++i) {
      this.boards.push({
        created: new Date().toISOString(),
        id: String(i),
        name: 'Random'
      });
    }

    this.openBoard(this.boards[0]); // TODO: REMOVE ONLY FOR TESTING
  }

  createBoard(): void {
    const dialogRef = this.dialog.open(CreateBoardDialogComponent, {
      width: '400px',
      data: { boardName: 'test' }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);

      if (result) {
        const parent = d3.select('#kanban-boards');
        parent.append('div')
        .attr('class', 'board-box')
        .html(result);

        // TODO: store in dynamo db database
      }
    });
  }

  editBoard(board: Board): void {
    const dialogRef = this.dialog.open(CreateBoardDialogComponent, {
      width: '400px',
      data: { boardName: board.name }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);

      if (result) {
        board.name = result;

        // TODO: update in dynamo db database
      }
    });
  }

  deleteBoard(board: Board): void {
    // TODO: delete board and all included tasks
  }

  openBoard(board: Board): void {
    this.boardService.setSelectedBoard(board);
    this.router.navigate(['./', { outlets: { boardSelection: 'board' } }]);
  }
}

export interface BoardData {
  boardName: string;
}

@Component({
  selector: 'create-board',
  templateUrl: 'create-board.html',
})
export class CreateBoardDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CreateBoardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BoardData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
