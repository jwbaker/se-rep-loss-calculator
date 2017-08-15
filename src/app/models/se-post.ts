import { SeShallowUser, SeShallowUserResponse } from "./se-shallow-user";

export enum SePostType {
    question,
    answer
}

export class SePostResponse {
    owner?:SeShallowUserResponse;
    post_type:string;
    post_id:number;
}

export class SePost {
    owner?:SeShallowUser;
    postType:SePostType;
    postId:number;

    constructor(obj:SePostResponse){
        this.owner = new SeShallowUser(obj.owner);
        this.postType = SePostType[<string>obj.post_type];
        this.postId = obj.post_id;
    }
}
