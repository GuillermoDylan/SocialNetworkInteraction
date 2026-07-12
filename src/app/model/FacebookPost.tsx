import Comment from "./Comment";

type FacebookPostUser = {
    id: string;
    avatar_url: string | null;
    image_url: string;
    username: string;
};

export default class FacebookPost {
    id: string;
    type: string;
    image_url: string | null;
    caption: string;
    likes: number;
    comments: Comment[];
    user: FacebookPostUser;

    constructor(data: {
        id: string;
        type: string;
        image_url: string | null;
        caption: string;
        likes: number;
        comments?: Comment[];
        user: FacebookPostUser;
    }) {
        this.id = data.id;
        this.type = data.type;
        this.image_url = data.image_url ?? null;
        this.caption = data.caption;
        this.likes = data.likes;
        this.comments = data.comments ?? [];
        this.user = data.user;
    }
}
