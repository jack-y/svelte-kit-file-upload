/* The upload plugin and its functions.
 * busboy is used: multiple files can be uploaded at the same time */

import busboy from 'busboy';
import fs from 'fs-extra';
import path from 'path';

/* Reads a file in the multipart FormData */
const readFile = (uploadData, file, filename) => {
    /* Sets the new file object */
    let newFile = {
        buffers: [],
        name: filename,
        size: 0,
    };
    uploadData.files.push(newFile);
    /* Reads the file data */
    file.on('data', (data) => {
        /* Handles the data into mem buffers */
        uploadData.files[uploadData.filesIndex].buffers.push(data);
        uploadData.files[uploadData.filesIndex].size += data.length;
    });
};

/* Uploads the files server-side */
const uploadFiles = req => {
    return new Promise((resolve, reject) => {
        /* Gets the static path on disk */
        let staticPath = path.resolve('./static');
        /* Initializes */
        let uploadData = {
            files: [],
            filesIndex: -1,
            mimeTypes: [],
            mimeTypesIndex: -1,
            names: [],
            namesIndex: -1,
            paths: [],
            pathsIndex: -1,
            sizes: [],
            sizesIndex: -1,
        };
        /* Sets the Busboy parser */
        let parser = new busboy({headers: req.headers});
        /* Process the data */
        parser.on('file', (_fieldname, file, filename, _encoding, _mimetype) => {
            uploadData.filesIndex += 1;
            readFile(uploadData, file, filename, req);
        });
        parser.on('field', (fieldname, val, _fieldnameTruncated, _valTruncated, _encoding, _mimetype) => {
            if (fieldname === 'mimeType') {
                uploadData.mimeTypesIndex += 1;
                uploadData.mimeTypes.push(val);
            }
            if (fieldname === 'name') {
                uploadData.namesIndex += 1;
                uploadData.names.push(val);
            }
            if (fieldname === 'path') {
                uploadData.pathsIndex += 1;
                uploadData.paths.push(val);
            }
            if (fieldname === 'size') {
                uploadData.sizesIndex += 1;
                uploadData.sizes.push(val);
            }
        });
        parser.on('finish', () => {
            /* Sets the write promises */
            let promises = [];
            for (let i = 0; i < uploadData.files.length; i++) {
                promises.push(writeFile(uploadData, staticPath, i));
            }
            /* Writes the files on disk */
            Promise.all(promises)
            .then(() => resolve({success: true}))
            .catch(err => reject(err));
        });
        /* Manages the parser error */
        parser.on('error', err => reject(err));
        /* Starts the parser */
        req.pipe(parser);

    });
};

/* The upload plugin. See the svelte.config.js file */
const uploadPlugin = {
    name: 'upload-middleware',
    configureServer (server) {
        server.middlewares.use(((req, res, next) => {
            if (req.url.startsWith('/upload')) {
                /* Uploads the files */
                uploadFiles(req)
                .then(() => {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain',
                    });
                    return res.end('ok');
                })
                .catch(err => {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain',
                    });
                    return res.end('upload plugin error: ' + err);
                });
            } else {
                next();
            }
        }));
    },
};

/* Writes a file to disk */
const writeFile = (uploadData, staticPath, index) => {
    return new Promise((resolve, reject) => {
        /* Sets the file name and path */
        let fileToWrite = uploadData.paths[index] + '/' + uploadData.names[index];
        /* Computes the buffer total length */
        let totalLength = 0;
        uploadData.files[index].buffers.forEach(item => totalLength += item.length);
        /* Sets the data buffer */
        let buffer;
        try {
            buffer = Buffer.concat(uploadData.files[index].buffers, totalLength);
        } catch (err) {
            return reject(err);
        }
        /* Sets the write process */
        const fullPath = staticPath + '/' + (fileToWrite.startsWith('/') ? fileToWrite.substring(1) : fileToWrite);
        const filePath = staticPath + '/' + (uploadData.paths[index].startsWith('/')
            ? uploadData.paths[index].substring(1)
            : uploadData.paths[index]);
        /* Be sure that the directory exists, otherwise creates it */
        fs.ensureDir(filePath)
        .then(() => {
            let writeStream = fs.createWriteStream(fullPath);
            writeStream.on('finish', () => {
                /* Et voila! */
                return resolve();
            });
            writeStream.on('error', err => {
                return reject(err);
            });
            /* Starts the write process */
            writeStream.write(buffer);
            writeStream.end();
        })
        .catch(err => reject(err));
    });
};

export {uploadPlugin};
