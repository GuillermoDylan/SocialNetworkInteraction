import PostUser from "./PostUser";


export default class StoryClass {
    id: string;
    type: string;
    image: string;
    image_url: string;
    user: PostUser;

    constructor(data: Post) {
        this.id = data.id;
        this.type = data.type;
        this.image = data.image;
        this.image_url = data.image_url;
        this.user = new PostUser(data.user);
    }
}

