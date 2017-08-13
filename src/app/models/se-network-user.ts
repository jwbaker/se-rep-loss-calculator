export class SeNetworkUser {
    accountId: Number;
    userId: Number;
    siteName: String;
    siteUrl: String;
    creationDate: Date;

    constructor(obj) {
        this.accountId = obj.account_id;
        this.userId = obj.user_id;
        this.siteName = obj.site_name;
        this.siteUrl = obj.site_url;
        this.creationDate = new Date(0);
        this.creationDate.setUTCSeconds(obj.creation_date);
    }
}
