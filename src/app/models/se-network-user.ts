export class SeNetworkUser {
    accountId: Number;
    userId: Number;
    siteName: String;
    siteUrl: String;

    constructor(obj) {
        this.accountId = obj.account_id;
        this.userId = obj.user_id;
        this.siteName = obj.site_name;
        this.siteUrl = obj.site_url;
    }
}
