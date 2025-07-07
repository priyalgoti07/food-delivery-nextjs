// import React, { useEffect } from 'react';
// import Uppy from '@uppy/core';
// import { DashboardModal } from '@uppy/react';
// // import XHRUpload from '@uppy/xhr-upload';
// import Tus from '@uppy/tus';

// import '@uppy/core/dist/style.min.css';
// import '@uppy/dashboard/dist/style.min.css';

// export default function ImageUpload({ onUploadSuccess, onClose }) {
//     const uppy = new Uppy({
//         debug: true,
//         autoProceed: false,
//         restrictions: {
//             maxFileSize: 10 * 1024 * 1024,
//             allowedFileTypes: ['image/*'],
//             maxNumberOfFiles: 1
//         }
//     });

//     uppy.use(Tus, {
//         endpoint: 'http://localhost:1530/files',
//         chunkSize: 5 * 1024 * 1024, // optional
//         retryDelays: [0, 1000, 3000, 5000],
//         metadata: (file) => ({
//             filename: file.name,
//             filetype: file.type
//         })
//     });

//     uppy.on('complete', async (result) => {
//         if (result.successful.length > 0) {
//             const uploadedFile = result.successful[0];
//             const fileUrl = uploadedFile.uploadURL;

//             // Send to /complete to move to MinIO
//             const response = await fetch('http://localhost:1530/complete', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     filename: uploadedFile.name,
//                     filepath: uploadedFile.uploadURL.replace('http://localhost:1530/files/', '')
//                 })
//             });

//             const data = await response.json();
//             if (onUploadSuccess) onUploadSuccess(data.url);
//         }
//     });

//     useEffect(() => {
//         return () => uppy.clear();
//     }, []);

//     return (
//         <DashboardModal
//             uppy={uppy}
//             open={open}

//             onRequestClose={() => {
//                 uppy.cancelAll();
//                 if (onClose) onClose();
//             }}
//             proudlyDisplayPoweredByUppy={false}
//             note="Images only, up to 10MB"
//         />
//     );
// }



// import React from 'react';
// import Uppy from '@uppy/core';
// import { DashboardModal } from '@uppy/react';
// import Tus from '@uppy/tus';
// import '@uppy/core/dist/style.min.css';
// import '@uppy/dashboard/dist/style.min.css';

// export default function ImageUpload({ onUploadSuccess, onClose }) {
//     const uppy = new Uppy({
//         debug: true,
//         autoProceed: true,
//         restrictions: {
//             maxFileSize: 10 * 1024 * 1024,
//             allowedFileTypes: ['image/*'],
//             maxNumberOfFiles: 1
//         }
//     });

//     uppy.use(Tus, {
//         endpoint: 'http://localhost:1530/files',
//         chunkSize: 5 * 1024 * 1024 // 5MB chunks
//     });

//     uppy.on('upload-success', (file, response) => {
//         // Call your completion endpoint
//         fetch('http://localhost:1530/complete', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 filename: file.name
//             })
//         })
//             .then(res => res.json())
//             .then(data => {
//                 if (data.success && onUploadSuccess) {
//                     onUploadSuccess(data.url);
//                 }
//             });
//     });

//     return (
//         <DashboardModal
//             uppy={uppy}
//             open={true}
//             onRequestClose={() => {
//                 uppy.cancelAll();
//                 if (onClose) onClose();
//             }}
//             proudlyDisplayPoweredByUppy={false}
//             note="Images only, up to 10MB"
//         />
//     );
// }

import React from 'react';
import Uppy from '@uppy/core';
import { DashboardModal } from '@uppy/react';
import Tus from '@uppy/tus';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

export default function ImageUpload({ onUploadSuccess, onClose }) {
    const uppy = new Uppy({
        debug: true,
        autoProceed: true,
        restrictions: {
            maxFileSize: 10 * 1024 * 1024,
            allowedFileTypes: ['image/*'],
            maxNumberOfFiles: 1
        }
    });

    uppy.use(Tus, {
        endpoint: 'http://localhost:1530/files',
        chunkSize: 5 * 1024 * 1024, // 5MB chunks
        headers: {
            'Tus-Resumable': '1.0.0'
        },
        onBeforeRequest: (req, file) => {
            req.setHeader(
                'Upload-Metadata',
                `filename ${btoa(file.name)},type ${btoa(file.type)}`
            );
            return req;
        }
    });

    uppy.on('upload-success', (file, response) => {
        const url = `http://localhost:9000/uploads/${file.name}`;
        if (onUploadSuccess) onUploadSuccess(url);
    });

    return (
        <DashboardModal
            uppy={uppy}
            open={true}
            onRequestClose={() => {
                uppy.cancelAll();
                if (onClose) onClose();
            }}
            proudlyDisplayPoweredByUppy={false}
            note="Images only, up to 10MB"
        />
    );
}