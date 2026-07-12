export default class Comment {
    id: string;
    username: string;
    text: string;
    likes: number;

    constructor(data: Comment) {
        this.id = data.id;
        this.username = data.username;
        this.text = data.text;
        this.likes = data.likes;
    }
}