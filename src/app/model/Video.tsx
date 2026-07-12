import Comment from "./Comment";
import PostUser from "./PostUser";

export default class Video {
    id: string;
    video_url: string;
    caption: string;
    user?: PostUser;
    likes?: number;
    comments?: Array<Comment>;

    constructor(data: Video) {
        this.id = data.id;
        this.video_url = data.video_url;
        this.caption = data.caption;
        if (data.user != null)
            this.user = new PostUser(data.user);
    }
}

