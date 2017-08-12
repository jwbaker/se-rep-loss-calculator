import { SeNetworkUser } from "./se-network-user";

export class SeLoggedInData {
    accessToken: string;
    expirationDate: Date;
    networkUsers: SeNetworkUser[];

    constructor(obj){
        this.accessToken = obj.accessToken;
        this.expirationDate = obj.expirationDate;
        this.networkUsers = [];
        if ("networkUsers" in obj) {
            this.networkUsers = obj.networkUsers.map(e => new SeNetworkUser(e));
        }
    }
}
