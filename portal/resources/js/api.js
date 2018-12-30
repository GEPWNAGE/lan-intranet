class Api {
  static handleResponse(response) {
    if (response.ok) {
      return response.json()
    }
    return response.json().then(json => {
      throw {json, status: response.status}
    })
  }
  post(url, body) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
        'X-Csrf-Token': window.laravelToken
      },
      body: JSON.stringify(body)
    }).then(Api.handleResponse)
  }
  get(url) {
    return fetch(url).then(Api.handleResponse);
  }
  status() {
    return this.get('/status');
  }
  authenticate(voucher) {
    return this.post('/authenticate', { voucher });
  }
}

export default new Api;