# svelte-kit-file-upload

Full example with a simple form, the script client-side, and the upload server-side.

The project uses these packages:    
[adapter-node](https://www.npmjs.com/package/@sveltejs/adapter-node), [busboy](https://www.npmjs.com/package/busboy) and [fs-extra](https://www.npmjs.com/package/fs-extra).

See also the [Yanick repo](https://github.com/yanick/svelte-kit-file-upload) using [multer](https://www.npmjs.com/package/multer) and [uppy](https://www.npmjs.com/package/@uppy/core). 

There isn't a lot of CSS and form design here. Not very fun but it works!

## Run the server in preview / production mode.

In preview or production mode, a [polka](https://www.npmjs.com/package/polka) server is used. See the `src/server.mjs` file.    
For more information on the middleware, see [the adapter doc](https://github.com/sveltejs/kit/tree/master/packages/adapter-node#middleware).

With npm: `npm run preview`    
With node: `node ./src/server.mjs`    

