export interface KanBanBoardItem {
    boardId: string;
    itemId: string;
    createdAt: string;
    title: string;
    description: string;
    category: string;
    imageUrl?: string;
}