import superagent from 'superagent'
import { isNil } from 'lodash'

const httpMethods = Object.freeze({
	get: 'GET',
	post: 'POST',
	put: 'PUT',
	delete: 'DELETE'
});

const getUserToken = () => {
	const token = localStorage.user_token;

	return isNil(token) ? null : JSON.parse(token);
}

const parseJson = (response) => {
	return new Promise((resolve, reject) => 
		response.json()
			.then(json => resolve({
				status: response.status,
				ok: response.ok,
				body: json
			}))
	)
}

function get(url, success, failure) {
	const token = getUserToken()

	return superagent
		.get(url)
		.set('username', isNil(token) ? '' : token.username)
		.set('expirationDate', isNil(token) ? '' : token.expirationDate)
		.on('error', error => failure(error.response))
		.then(response => success(response.body))

	// return fetch(url, {
	// 	method: httpMethods.get,
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		// 'authorization': JSON.stringify(getUserToken())
	// 		'username': isNil(token) ? '' : token.username,
	// 		'expirationDate': isNil(token) ? '' : token.expirationDate
	// 	}
	// })
	// .then(parseJson)
	// .then(response => {
	// 	console.log(response)
	// 	return response.ok 
	// 		? success(response.body) 
	// 		: failure(response.body)
	// })
	// .catch(error => {
	// 	console.error(error)

	// })
}

function getFile(url, success, failure) {
	const token = getUserToken();

	return fetch(url, {
		method: httpMethods.get,
		headers: {
			'Content-Type': 'application/json',
			// 'authorization': JSON.stringify(getUserToken())
			'username': isNil(token) ? '' : token.username,
			'expirationDate': isNil(token) ? '' : token.expirationDate
		}
	})
		.then(response => {
			const ok = response.ok
			const headers = {}

			for (let pair of response.headers.entries()) {
				headers[`${pair[0]}`] = pair[1]
			}

			response.blob().then(blob => {
				if (ok) {
					success({
						blob,
						headers
					})
				} else {
					failure()
				}
			})
		})
}

function post(url, body, success, failure) {
	const token = getUserToken();

	return superagent
		.post(url)
		.set('username', isNil(token) ? '' : token.username)
		.set('expirationDate', isNil(token) ? '' : token.expirationDate)
		.set('Content-Type', 'application/json')
		.send(JSON.stringify(body))
		.on('error', error => failure(error.response))
		.then(response => success(response.body))
	// return fetch(url, {
	// 	method: httpMethods.post,
	// 	body: JSON.stringify(body),
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		'username': isNil(token) ? '' : token.username,
	// 		'expirationDate': isNil(token) ? '' : token.expirationDate
	// 	}
	// })
	// 	.then(response => {
	// 		if (response.ok) {
	// 			success()
	// 		} else if (!response.ok) {
	// 			failure()
	// 		}
	// 	})
}

function put(url, body, success, failure) {
	const token = getUserToken();

	return superagent
		.put(url)
		.set('Content-Type', 'application/json')
		.set('username', isNil(token) ? '' : token.username)
		.set('expirationDate', isNil(token) ? '' : token.expirationDate)
		.send(JSON.stringify(body))
		.on('error', error => failure(error.response))
		.then(response => success(response.body))

	// return fetch(url, {
	// 	method: httpMethods.put,
	// 	body: JSON.stringify(body),
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		'username': isNil(token) ? '' : token.username,
	// 		'expirationDate': isNil(token) ? '' : token.expirationDate
	// 	}
	// })
	// 	.then(response => {
	// 		if (response.ok) {
	// 			return success();
	// 		} else {
	// 			return failure();
	// 		}
	// 	});
}

function del(url, success, failure) {
	const token = getUserToken();

	return superagent
		.delete(url)
		.set('username', isNil(token) ? '' : token.username)
		.set('expirationDate', isNil(token) ? '' : token.expirationDate)
		.on('error', error => failure(error.response))
		.then(response => success(response.body))

	// return fetch(url, {
	// 	method: httpMethods.delete,
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		'username': isNil(token) ? '' : token.username,
	// 		'expirationDate': isNil(token) ? '' : token.expirationDate
	// 	}
	// })
	// .then(response => {
	// 	if(response.ok) {
	// 		return success()
	// 	} else if (!response.ok) {
	// 		return failure()
	// 	}
	// })
}

export default Object.freeze({
	get: get,
	getFile: getFile,
	post: post,
	put: put,
	delete: del
});