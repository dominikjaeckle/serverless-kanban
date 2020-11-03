import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../_services/board/board.service';
import { Board } from './board';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

  refreshService;
  selectedBoard: Board;

  todo = [
    { title: 'Get to work' },
    { title: 'Pick up groceries' },
    { title: 'Go home' },
    { title: 'Fall asleep' }
  ];
  doing = [];
  done = [];
  ignore = [];


  constructor(private router: Router,
              private boardService: BoardService) { }

  ngOnInit(): void {
    this.refreshService = this.boardService.getSelectedBoard().subscribe((board => {
      this.selectedBoard = board;
    }));
  }

  ngOnDestroy(): void {
    this.refreshService.unsubscribe();
  }

  returnToBoards(): void {
    this.router.navigate(['./', { outlets: { boardSelection: 'boards' } }]);
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    console.log("todo", this.todo);
    console.log("doing", this.doing);
    console.log("done", this.done);
    console.log("ignore", this.ignore);
  }
}
