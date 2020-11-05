import { Injectable } from '@angular/core';
import Axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { KanBanBoard } from 'src/app/_services/board/kanban-board';
import { environment as env } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { KanBanItem } from './kanban-item';
import { KanbanBoardRequest } from './kanbanBoard-request';
import { KanbanItemRequest } from './kanbanItem-request';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  selectedBoard = new BehaviorSubject<KanBanBoard>(null);

  constructor(private authService: AuthService) { }

  getSelectedBoard(): Observable<KanBanBoard> {
    console.log("enter slesdfaasf");
    return this.selectedBoard;
  }

  setSelectedBoard(board: KanBanBoard): void {
    this.selectedBoard.next(board);
  }

  async getKanbanBoards(): Promise<KanBanBoard[]> {
    console.log('Fetching kanban boards');
    const result = await Axios.get(`${env.apiEndpoint}/boards`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getIdToken()}`
      }
    });
    console.log('Kanban Boards:', result.data);
    return result.data.items;
  }

  async createKanbanBoard(newBoard: KanbanBoardRequest): Promise<KanBanBoard> {
    console.log('Create new kanban board:', newBoard.title);
    const result = await Axios.post(`${env.apiEndpoint}/boards`, JSON.stringify(newBoard), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getIdToken()}`
      }
    });
    console.log('New board:', result.data);
    return result.data.item;
  }

  async updateKanbanBoard(boardId: string, updatedBoard: KanbanBoardRequest): Promise<KanBanBoard> {
    console.log('Update kanban board:', updatedBoard.title);
    const result = await Axios.patch(`${env.apiEndpoint}/boards/${boardId}`, JSON.stringify(updatedBoard), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getIdToken()}`
      }
    });
    console.log('Updated board:', result.data);
    return result.data.item;
  }

  async deleteKanbanBoard(boardId: string): Promise<void> {
    console.log('Delete kanban board:', boardId);
    await Axios.delete(`${env.apiEndpoint}/boards/${boardId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getIdToken()}`
      }
    });
    console.log('Deleted board:', boardId);
  }

  async getKanbanBoardItems(boardId: string): Promise<KanBanItem[]> {
    console.log('Fetching kanban boards');
    const result = await Axios.get(`${env.apiEndpoint}/boardItems/${boardId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getIdToken()}`
      }
    });
    console.log('Kanban Items:', result.data);
    return result.data.items;
  }

  async createKanbanBoardItem(boardId: string, newItem: KanbanItemRequest): Promise<KanBanItem> {
    console.log('Create kanban item on board', boardId);
    const result = await Axios.post(`${env.apiEndpoint}/boardItems/${boardId}`, JSON.stringify(newItem), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getIdToken()}`
      }
    });
    console.log('New item created:', result);
    return result.data.item;
  }

  async updateKanbanBoardItem(boardId: string, itemId, updatedItem: KanbanItemRequest): Promise<KanBanItem> {
    console.log('Update kanban item:', itemId);
    const result = await Axios.patch(`${env.apiEndpoint}/boardItems/${boardId}/${itemId}`, JSON.stringify(updatedItem), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getIdToken()}`
      }
    });
    console.log('Updated item:', result.data);
    return result.data.item;
  }

  async deleteKanbanBoardItem(boardId: string, itemId: string): Promise<void> {
    console.log('Delete kanban item:', itemId);
    await Axios.delete(`${env.apiEndpoint}/boardItems/${boardId}/${itemId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getIdToken()}`
      }
    });
    console.log('Deleted item:', itemId);
  }

  async getUploadUrl(itemId: string): Promise<string> {
    const result = await Axios.post(`${env.apiEndpoint}/boardItems/img/${itemId}`, '', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authService.getIdToken()}`
      }
    });
    return result.data.uploadUrl;
  }

  async uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
    await Axios.put(uploadUrl, file);
  }
}
