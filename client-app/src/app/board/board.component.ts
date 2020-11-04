import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BoardService } from '../_services/board/board.service';
import { KanBanBoard } from '../_services/board/kanban-board';
import { KanBanItem } from '../_services/board/kanban-item';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {

  refreshService;
  selectedBoard: KanBanBoard;

  todo = [];
  doing = [];
  done = [];
  ignore = [];


  constructor(private router: Router,
              private boardService: BoardService) { }

  async ngOnInit(): Promise<void> {
    this.refreshService = this.boardService.getSelectedBoard().subscribe(async (board: KanBanBoard) => {
      if (!board) return;
      if (board === null) return;

      this.selectedBoard = board;

      const items: KanBanItem[] = await this.boardService.getKanbanBoardItems(board.boardId);
      for (const item of items) {
        switch(item.category) {
          case 'todo':
            this.todo.push(item); break;
          case 'doing':
            this.doing.push(item); break;
          case 'done':
            this.done.push(item); break;
          case 'ignore':
            this.ignore.push(item); break;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.refreshService.unsubscribe();
  }

  returnToBoards(): void {
    this.router.navigate(['./', { outlets: { boardSelection: 'boards' } }]);
  }

  // drag(event: CdkDragDrop<string>): void {
  //   console.log(event);
  // }

  async drop(event: CdkDragDrop<object[]>): Promise<void> {

    const droppedElement: KanBanItem = event.previousContainer.data[event.previousIndex] as KanBanItem;
    const newList = event.container.id.split('-')[0].trim();
    console.log(newList, droppedElement);
    if (droppedElement.category !== newList) {
      droppedElement.category = newList;
      await this.boardService.updateKanbanBoardItem(droppedElement.boardId, droppedElement.itemId, {
        category: droppedElement.category,
        description: droppedElement.description,
        imageUrl: droppedElement.imageUrl,
        title: droppedElement.title
      });
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}
