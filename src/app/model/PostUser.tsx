export default class PostUser {
    id: string;
    avatar_url: string;
    image_url: string;
    username: string;

    // Optional fields
    description?: string;
    followers?: number;
    following?: number;
    posts? : Array;

    constructor(data: PostUser) {
        this.id = data.id;
        this.avatar_url = data.avatar_url;
        this.image_url = data.image_url;
        this.username = data.username;
    }
}