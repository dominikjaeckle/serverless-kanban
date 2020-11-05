import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BoardService } from '../_services/board/board.service';
import { KanBanBoard } from '../_services/board/kanban-board';
import { KanBanItem } from '../_services/board/kanban-item';
import { KanbanItemRequest } from '../_services/board/kanbanItem-request';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BoardComponent implements OnInit, OnDestroy {

  refreshService;
  selectedBoard: KanBanBoard;

  todo = [];
  doing = [];
  done = [];
  ignore = [];


  constructor(private router: Router,
              public dialog: MatDialog,
              private boardService: BoardService,
              private changeRef: ChangeDetectorRef) { }

  async ngOnInit(): Promise<void> {
    this.refreshService = this.boardService.getSelectedBoard().subscribe(async (board: KanBanBoard) => {
      if (!board) return;
      if (board === null) return;

      this.selectedBoard = board;

      const items: KanBanItem[] = await this.boardService.getKanbanBoardItems(board.boardId);
      for (const item of items) {
        switch (item.category) {
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

  async createItem(): Promise<void> {
    const itemData: KanbanItemRequest = {
      category: 'todo',
      description: '',
      title: ''
    };
    const dialogRef = this.dialog.open(CreateItemDialogComponent, {
      width: '400px',
      data: itemData
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result && result.title !== '') {
      const newTodo = await this.boardService.createKanbanBoardItem(this.selectedBoard.boardId, itemData);
      this.todo.push(newTodo);
    }
  }

  async drop(event: CdkDragDrop<object[]>): Promise<void> {

    const droppedElement: KanBanItem = event.previousContainer.data[event.previousIndex] as KanBanItem;
    const newList = event.container.id.split('-')[0].trim();
    // console.log(newList, droppedElement);
    if (droppedElement.category !== newList) {
      droppedElement.category = newList;
      await this.boardService.updateKanbanBoardItem(droppedElement.boardId, droppedElement.itemId, {
        category: droppedElement.category,
        description: droppedElement.description,
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

  async onEdit(item: KanBanItem): Promise<void> {
    const dialogRef = this.dialog.open(CreateItemDialogComponent, {
      width: '400px',
      data: item
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result && result.title !== '') {
      // delete form array because of edit
      const index = this[item.category].indexOf(item);
      this[item.category].splice(index, 1);
      
      const updateItem: KanbanItemRequest = {
        category: result.category,
        description: result.description,
        title: result.title
      };
      const updatedItem = await this.boardService.updateKanbanBoardItem(this.selectedBoard.boardId, item.itemId, item);

      this.changeRef.detectChanges();
      
      // add again to array
      this[item.category].splice(index, 0, item);
    }
  }

  async onDelete(item: KanBanItem): Promise<void> {
    await this.boardService.deleteKanbanBoardItem(this.selectedBoard.boardId, item.itemId);
    const index = this[item.category].indexOf(item);
    if (index !== -1) {
      this[item.category].splice(index, 1);
    }
  }
}


@Component({
  selector: 'app-create-item',
  templateUrl: 'create-board-item.html',
  encapsulation: ViewEncapsulation.None
})
export class CreateItemDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CreateItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: KanBanItem,
    private boardService: BoardService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onFileChanged(event): Promise<void> {
    const file = event.target.files[0];
    const uploadURL = await this.boardService.getUploadUrl(this.data.itemId);
    console.log("Upload url: ", uploadURL);
    await this.boardService.uploadFile(uploadURL, file);
  }
}
