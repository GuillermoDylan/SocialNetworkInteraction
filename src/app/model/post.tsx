import Comment from "./Comment";
import PostUser from "./PostUser";

export default class Post {
	id: string;
	type: string;
	image: string;
	image_url: string;
	caption: string;
	user?: PostUser;
	likes?: number;
	description?: String;
	comments?: Array<Comment>;

	constructor(data: Post) {
		this.id = data.id;
		this.type = data.type;
		this.image = data.image;
		this.image_url = data.image_url;
		this.caption = data.caption;
		if (data.user != null)
			this.user = new PostUser(data.user);
	}
}

