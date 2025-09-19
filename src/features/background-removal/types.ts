export interface IBackgroundRemovalDataSource {
    removeBackground(imageUrl: string): Promise<string>;
}

export interface IBackgroundRemovalRepository {
    removeBackground(imageUrl: string): Promise<string>;
}
