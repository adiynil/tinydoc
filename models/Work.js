class Work {
    constructor() {

    }
    WorkId: number;
    WorkTitle: string;
    Identity: string;
    // 属于哪个项目
    BelongsTo: number;
    // 发布者
    OwnerId: number;
    OwnerName: string;
    Markdown: string;
    Html: string;
    CreateAt: string;
    LastModifiedTime: string;
    LastModifiedBy: number;
    LastModifiedName: string;
    // 是否包含附件：0没有 / 1有
    isHaveAttachment: number;
    // 是否开启留言：0关闭 / 1开启
    isOpenToComment: number;

}