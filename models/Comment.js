class Comment {
    constructor() { }
    CommentId: number;
    Content: string;
    // 发表在哪个文档下
    WorkId: number;
    Reciever: number;
    // 留言者
    Author: string;
    AuthorId: number;
    PublishDate: string;
    IPAddress: string;
    UserAgent: string;
    // 留言状态：0已删除 / 1已发表 / 2审核中
    Status: number;
    // 点赞数
    AgreeCount: number;
    // 反对数
    AgainstCount: number;
}