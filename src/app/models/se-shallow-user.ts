export class SeShallowUserResponse {
    user_id?:number;
}


export class SeShallowUser {
    userId?:number;
    
    constructor(obj:SeShallowUserResponse){
        this.userId = obj.user_id;
    }
}
