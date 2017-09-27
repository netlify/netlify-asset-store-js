# Netlify Asset Store JS Client

This is a JS library Netlify Asset's Store.

It allows you to create public and private assets, upload them to the store and fetch them.

## Usage

```js
import NetlifyAssetStore from 'netlify-asset-store'

const url = "https://api.netlify.com/api/v1/sites/site_id/assets";
const token = "access-token";
const store = new NetlifyAssetStore(url, token);

store.create(file).then(
	(response) => console.log(response.asset.url),
	(error) => console.log("Error uploading a new asset: %o", error)
);

store.list().then(
	(response) => {
		for (const asset of response) {
			console.log("Asset %s, stored in %s", asset.id, asset.url);
		}
	},
	(error) => console.log("Error fetching the assets list: %o", error)
);

store.get("asset-id").then(
	(response) => console.log("Asset %s, stored in %s", response.id, response.url),
	(error) => console.log("Error fetching asset: %o", error)
);
```
