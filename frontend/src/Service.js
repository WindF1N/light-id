import axios from 'axios';
const API_URL = 'https://backend.litee.ru:8000';

export default class Service{

	getUser(headers) {
		const url = `${API_URL}/api/user`;
		return axios.get(url, {
			headers: headers
		})
		.then(response => response)
		.catch(error => error.response);
	}

	getUserByPhone(phone, headers) {
		const url = `${API_URL}/api/user?phone=${phone}`;
		return axios.get(url, {
			headers: headers
		})
		.then(response => response)
		.catch(error => error.response);
	}

	getUserByUsername(username) {
		const url = `${API_URL}/api/user/${username}`;
		return axios.get(url, {
			username: username
		})
		.then(response => response)
		.catch(error => error.response);
	}

	getProfiles(link, headers) {
		const url = `${API_URL}${link}`;
		return axios.get(url, {
			headers: headers
		})
		.then(response => response)
		.catch(error => error.response);
	}

	login(data) {
		const url = `${API_URL}/api/token/obtain`;
		return axios.post(url, data)
		.then(response => response)
		.catch(error => error.response);
	}

	refreshTokens(refreshToken) {
		const url = `${API_URL}/api/token/refresh`;
		return axios.post(url, {
			refresh: refreshToken
		})
		.then(response => response)
		.catch(error => error.response);
	}

	getPosts(headers){
		const url = `${API_URL}/api/posts/`;
		return axios.get(url, {
	    headers: headers
	  })
		.then(response => response)
		.catch(error => error.response);
	}

	getPost(id, headers){
		const url = `${API_URL}/api/posts/${id}`;
		return axios.get(url, {
	    headers: headers
	  })
		.then(response => response)
		.catch(error => error.response);
	}

	deletePost(id, headers){
		const url = `${API_URL}/api/posts/${id}`;
		return axios.delete(url, {
	    headers: headers
	  })
		.then(response => response)
		.catch(error => error.response);
	}

	editPost(id, title, description, headers){
		const url = `${API_URL}/api/posts/${id}`;
		return axios.put(url, {
			title: title,
			description: description
		}, {
	    headers: headers
	  })
		.then(response => response)
		.catch(error => error.response);
	}

	getPostsByURL(link) {
		const url = `${API_URL}${link}`;
		return axios.get(url)
		.then(response => response)
		.catch(error => error.response);
	}

	getSubscribes(link, headers) {
		const url = `${API_URL}${link}`;
		return axios.get(url, {
	    headers: headers
	  })
		.then(response => response)
		.catch(error => error.response);
	}

	getPostsUser(username, headers){
		const url = `${API_URL}/api/posts/${username}`;
		return axios.get(url, {
			username: username,
	    headers: headers
	  })
		.then(response => response)
		.catch(error => error.response);
	}

	likePost(id, headers){
		const url = `${API_URL}/api/posts/${id}/likes`;
		return axios.post(url, {}, {
	    headers: headers
	  })
		.catch(error => error.response);
	}

	savePost(id, headers){
		const url = `${API_URL}/api/savedposts`;
		return axios.post(url, {post_id: id}, {
	    headers: headers
	  })
		.catch(error => error.response);
	}

	likeComment(id, headers){
		const url = `${API_URL}/api/comments/${id}/likes`;
		return axios.post(url, {}, {
	    headers: headers
	  })
		.catch(error => error.response);
	}

	getPostComments(link){
		const url = `${API_URL}${link}`;
		return axios.get(url)
		.then(response => response)
		.catch(error => error.response);
	}

	addComment(id, text, headers){
		const url = `${API_URL}/api/posts/${id}/comments`;
		return axios.post(url, {text: text}, {
	    headers: headers
	  })
		.then(response => response)
		.catch(error => error.response);
	}

	subscribe(user, headers){
		const url = `${API_URL}/api/profiles/${user}/subscribers`;
		return axios.post(url, {}, {
	    headers: headers
	  })
		.then(response => response)
		.catch(error => error.response);
	}

	search(q, headers){
		const url = `${API_URL}/api/search?search=${q}`;
		return axios.get(url, {
	    headers: headers,
	  })
		.then(response => response)
		.catch(error => error.response);
	}

	getChats(link, headers) {
		const url = `${API_URL}${link}`;
		return axios.get(url, {
	    headers: headers
	  })
		.then(response => response)
		.catch(error => error.response);
	}

	goChat(username, headers) {
		const url = `${API_URL}/api/lobbies/`;
		return axios.post(url, {username: username}, {
	    headers: headers
	  })
		.then(response => response)
		.catch(error => error.response);
	}

	getMessages(link, headers) {
		const url = `${API_URL}${link}`;
		return axios.get(url, {
	    headers: headers
	  })
		.then(response => response)
		.catch(error => error.response);
	}

	addMessage(id, text, headers){
		const url = `${API_URL}/api/lobbies/${id}`;
		return axios.post(url, {text: text}, {
	    headers: headers
	  })
		.then(response => response)
		.catch(error => error.response);
	}

	readMessage(id, headers){
		const url = `${API_URL}/api/lobbies/msg/${id}/read`;
		return axios.post(url, {}, {
	    headers: headers
	  })
		.then(response => response)
		.catch(error => error.response);
	}

	updateMessages(id, headers){
		const url = `${API_URL}/api/lobbies/${id}/unread`;
		return axios.get(url, {
	    headers: headers
	  })
		.then(response => response)
		.catch(error => error.response);
	}

	getActivity(link, headers) {
		const url = `${API_URL}${link}`;
		return axios.get(url, {
	    headers: headers
	  })
		.then(response => response)
		.catch(error => error.response);
	}

	publicationUpload(title, description, images, headers){
    const url = `${API_URL}/api/posts/`;
    const formData = new FormData();
		formData.append('title',title);
		formData.append('description',description);
		for (let i = 0; i < images.length; i++){
			formData.append('files', images[i].blob);
    }
    const config = {
        headers: headers,
    }
    return axios.post(url, formData, config)
		.then(response => response)
		.catch(error => error.response);
  }

	changeAcc(data, headers){
		const url = `${API_URL}/api/user`;
		return axios.post(url, data, {
	    headers: headers
	  })
		.then(response => response)
		.catch(error => error.response);
	}
}
