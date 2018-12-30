class Api {
  post(url, body) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(body)
    })
  }
  status() {
    return fetch('/status')
      .then(response => response.json());
  }
  authenticate(voucher) {
    return this.post('/voucher', { voucher });
  }
}

export default new Api;