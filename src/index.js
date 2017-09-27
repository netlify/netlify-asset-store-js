import API from "micro-api-client";

export default class NetlifyAssetsStore {
  constructor(url, token) {
    this.api = new API(url);
    this.token = token;
  }
  
  _request(path, options = {}) {
    options.headers = options.headers || {};
    if (this.token) {
      options.headers["Authoriztion"] = `Bearer ${ this.token }`;
    }

    return this.api.request(path, options);
  }

  create(file, privateAsset = false) {
    const data = {
      name: file.name,
      size: file.size
    };

    if (file.type) {
      data.content_type = file.type;
    }
    if (privateAsset) {
      data.visibility = "private";
    }

    const options = {
      method: "POST",
      body: JSON.stringify(data)
    };

    return this._request("/", options)
      .then((response) => uploadAsset(file, response.form, response.asset));
  }

  list() {
    const options = {
      method: "GET"
    };

    return this._request("/", options);
  }

  get(assetID) {
    const options = {
      method: "GET"
    };

    return this._request(`/${ assetID }`, options);
  }

  // PRIVATE
  // uploadAsset take the signed form and uploads the asset to the store.
  uploadAsset(file, form, asset) {
    const formData = new FormData();
    for (const [key, value] in form.fields) {
      formData.append(key, value);
    }

    formData.append("file", file, file.name);

    const options = {
      method: "POST",
      body: formData
    }

    return fetch(form.url, options)
      .then(confirmUload(asset.id))
      .then({asset});
  }

  // PRIVATE
  // confirmUpload tells the API that the signed upload completed successfully.
  confirmUpload(assetID) {
    const options = {
      method: "PUT",
      body: JSON.stringify({state: "uploaded"})
    };

    return this._request(`/${ assetID }`, options);
  }

}
