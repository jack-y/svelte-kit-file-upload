import preprocess from 'svelte-preprocess';
import nodeAdapter from '@sveltejs/adapter-node';
import { uploadPlugin } from './src/lib/uploadPlugin.mjs';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
        // By default, `pnpm run build` will create a standard Node app.
        // You can create optimized builds for different platforms by
        // specifying a different adapter
        adapter: nodeAdapter(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
        // vite options
        vite: {
            // The File Upload plugin
            plugins: [uploadPlugin],
        },
	}
};

export default config;
