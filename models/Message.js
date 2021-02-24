class Message {
    constructor() { }
    MessageId: number;
    // 消息类别：message普通消息 / migration迁移项目
    MessageType: string;
    TargetId: number;
    Content: string;
    SendBy: number;
    Reciever: number;
    // 消息状态：0未处理 / 1已读
    Status: number;
    CreateAt: string;

}