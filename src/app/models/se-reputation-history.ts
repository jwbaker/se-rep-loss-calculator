export enum SeReputationHistoryType {
    asker_accepts_answer,
    asker_unaccept_answer,
    answer_accepted,
    answer_unaccepted,
    voter_downvotes,
    voter_undownvotes,
    post_downvoted,
    post_undownvoted,
    post_upvoted,
    post_unupvoted,
    suggested_edit_approval_received,
    post_flagged_as_spam,
    post_flagged_as_offensive,
    bounty_given,
    bounty_earned,
    bounty_cancelled,
    post_deleted,
    post_undeleted,
    association_bonus,
    arbitrary_reputation_change,
    vote_fraud_reversal,
    post_migrated,
    user_deleted,
    example_upvoted,
    example_unupvoted,
    proposed_change_approved,
    doc_link_upvoted,
    doc_link_unupvoted,
    doc_source_removed,
    suggested_edit_approval_overridden
}

export interface SeReputationHistoryResponse {
    creation_date:Date;
    reputation_change:number;
    reputation_history_type:string;
    post_id?:number;
}

export class SeReputationHistory {
    creationDate: Date;
    postId?: number;
    reputationChange: number;
    reputationHistoryType:SeReputationHistoryType;

    constructor(obj:SeReputationHistoryResponse) {
        this.creationDate = obj.creation_date;
        this.reputationChange = obj.reputation_change;
        this.reputationHistoryType = SeReputationHistoryType[<string>obj.reputation_history_type];
        this.postId = obj.post_id;
    }
}
