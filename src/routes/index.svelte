<script>
    /* The server-side files path */
    const filesPath = '/'; // in this example: static root

    /* The File object from the form */
    let fileToUpload = false;
    let fileName = ''

    /* The button status */
    let disabled;
    $: disabled = !fileToUpload || !fileName ? 'disabled' : '';

    /* Handles the input file change event */
    const handleFileChange = event => {
        if (event.target.files && event.target.files.length > 0) {
            fileToUpload = event.target.files[0];
        }
    };

    /* Handles the submit event */
    const handleSubmit = () => {
        /* Checks if all the data is set */
        if (fileToUpload && fileName) {
            /* Creates the form data */
            let formData = new FormData();
            /* Size must be the first part */
            formData.append('size', fileToUpload.size);
            /* Others parts */
            formData.append('file', fileToUpload);
            formData.append('name', fileName);
            formData.append('mimeType', fileToUpload.mimeType);
            formData.append('path', filesPath);
            /* Calls the process on the server */
            fetch('upload', {
                method: 'POST',
                body: formData,
                /* Don't set the Content-Type header.
                 See: https://muffinman.io/uploading-files-using-fetch-multipart-form-data/ */
            })
            /* Handles the response */
            .then(res => {
                if (!res.ok) {  // the response has a bad status (500..)
                    throw new Error('upload error status ' + res.status + ', status text: ' + res.statusText);
                } else {
                    alert('Done! See the uploaded file in the /static directory.');
                }
            })
            .catch(err => alert('Ooops: ' + err));
        }
    };

</script>

<div class="flex-col-center">
    <h1>SvelteKit File Upload example</h1>
    <div>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</div>
    <!-- The input file form -->
    <div class="top-2 flex-col-center">
        <div class="">
            <label for="input-file">Choose a file:</label>
            <input type="file"
                   id="input-file"
                   name="input-file"
                   on:change={handleFileChange}
            >
        </div>
        <div class="top-1">
            <label for="file-name">Give it a name + ext:</label>
            <input type="text"
                   id="file-name"
                   name="file-name"
                   bind:value={fileName}
            >
        </div>
        <div class="top-1">
            <button class="btn"
                    {disabled}
                    type="submit"
                    on:click={handleSubmit}
            >
                Start
            </button>
        </div>
    </div>
</div>

<style>
    .flex-col-center {
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .top-1 {
        margin-top: 1rem;
    }

    .top-2 {
        margin-top: 2rem;
    }
</style>
