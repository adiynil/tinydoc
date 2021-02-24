class TeamRelationship {
    constructor() { }
    RelationshipId: number;
    TeamId: number;
    MemberId: number;
    ProjectId: number;
    CreateAt: string;
    // 0-creater / 1-manager / 2-editor
    Role: number;
    // 关系状态：0解除 / 1正常
    Status: number;

}