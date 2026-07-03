export class PostUser {
	id: string;
	avatar_url: string;
	image_url: string;
	username: string;

	constructor(data: PostUser) {
		this.id = data.id;
		this.avatar_url = data.avatar_url;
		this.image_url = data.image_url;
		this.username = data.username;
	}
}

export class Post {
	id: string;
    type: string;
	image: string;
	image_url: string;
	caption: string;
	user: PostUser;

	constructor(data: Post) {
		this.id = data.id;
        this.type = data.type;
		this.image = data.image;
		this.image_url = data.image_url;
		this.caption = data.caption;
		this.user = new PostUser(data.user);
	}
}

