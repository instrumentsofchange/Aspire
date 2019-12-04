const httpMethods = Object.freeze({
    get: 'GET',
    post: 'POST',
    put: 'PUT',
    delete: 'DELETE'
});

const getUserToken = () => JSON.parse(localStorage.user_token);

const parseJson = (response) => {
    return new Promise(resolve => response.json()
        .then(json => resolve({
            status: response.status,
            ok: response.ok,
            body: json
        }))
    );
}

function get(url, success, failure) {
    const jwt = getUserToken();

    fetch(url, {
        method: httpMethods.get,
        headers: {
            'Content-Type': 'application/json',
            'username': jwt.username,
            'expirationDate': jwt.expiration
        }
    })
    .then(parseJson)
    .then(response => {
        if(response.ok) {
            success(response.body);
        } else {
            failure(response.body);
        }
    });
}

function post(url, body, success, failure) {
    fetch(url, {
        method: httpMethods.post,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getUserToken()
        }
    })
    .then(parseJson)
    .then(response => {
        if(response.ok) {
            success(response.body);
        } else {
            failure(response.body);
        }
    });
}

function put(url, body, success, failure) {
    fetch(url, {
        method: httpMethods.put,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getUserToken()
        }
    })
    .then(parseJson)
    .then(response => {
        if(response.ok) {
            success(response.body);
        } else {
            failure(response.body);
        }
    });
}

function del(url, success, failure) {
    fetch(url, {
        method: httpMethods.delete,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getUserToken()
        }
    })
    .then(parseJson)
    .then(response => {
        if(response.ok) {
            success(response.body);
        } else {
            failure(response.body);
        }
    });
}

export default Object.freeze({
    get: get,
    post: post,
    put: put,
    delete: del
});