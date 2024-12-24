import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';

const FileUpload = ({ onFilesProcessed }) => {
    const processZip = async (zipFile) => {
        try {
            const zip = await JSZip.loadAsync(zipFile);
            const categorizedData = {};

            await Promise.all(
                Object.entries(zip.files).map(async ([path, zipEntry]) => {
                    if (zipEntry.dir) return;

                    const match = path.match(/download_data_logs\/content\/(\d+)\/page_(\d+)\.json$/);
                    if (!match) return;

                    const categoryId = parseInt(match[1]);
                    const content = await zipEntry.async('text');
                    const data = JSON.parse(content);

                    if (!categorizedData[categoryId]) {
                        categorizedData[categoryId] = {
                            id: categoryId,
                            name: data.name,
                            description: data.description,
                            pages: []
                        };
                    }
                    categorizedData[categoryId].pages.push(...data.pages);
                })
            );

            return categorizedData;
        } catch (error) {
            console.error('Error processing ZIP:', error);
            throw error;
        }
    };

    const processDirectory = async (files) => {
        try {
            const categorizedData = {};

            await Promise.all(
                files.map(async (file) => {
                    const path = file.path || file.webkitRelativePath || file.name;
                    const match = path.match(/content\/(\d+)\/page_(\d+)\.json$/);
                    if (!match) return;

                    const categoryId = parseInt(match[1]);
                    const content = await file.text();
                    const data = JSON.parse(content);

                    if (!categorizedData[categoryId]) {
                        categorizedData[categoryId] = {
                            id: categoryId,
                            name: data.name,
                            description: data.description,
                            pages: []
                        };
                    }
                    categorizedData[categoryId].pages.push(...data.pages);
                })
            );

            return categorizedData;
        } catch (error) {
            console.error('Error processing directory:', error);
            throw error;
        }
    };

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;

        try {
            const firstFile = acceptedFiles[0];
            let data;

            if (firstFile.type === 'application/zip' || firstFile.name.endsWith('.zip')) {
                data = await processZip(firstFile);
            } else {
                data = await processDirectory(acceptedFiles);
            }

            if (Object.keys(data).length > 0) {
                onFilesProcessed(data);
            } else {
                console.error('No valid data found in files');
            }
        } catch (error) {
            console.error('Error processing files:', error);
        }
    }, [onFilesProcessed]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        noClick: false,
        noKeyboard: false,
        multiple: true
    });

    return (
        <div>
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
                    isDragActive ? 'border-primary bg-primary/10' : 'border-muted'
                }`}
            >
                <input {...getInputProps()} />
                <p className="text-muted-foreground">
                    {isDragActive
                        ? 'Drop the files here...'
                        : 'Drag and drop the download_data_logs folder or ZIP file here, or click to select'}
                </p>
            </div>
            <div className="mt-4 text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                    Your files are processed entirely in your browser - nothing will be uploaded to any server.
                </p>
                <p className="text-sm text-muted-foreground">
                    You can download your data logs from the{' '}
                    <a
                        href="https://accountscenter.facebook.com/info_and_permissions/dyi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        Meta Accounts Center
                    </a>
                </p>
                <p className="text-sm text-muted-foreground">
                    View this project on{' '}
                    <a
                        href="https://github.com/niclas3332/meta_dataexport_parser"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        GitHub
                    </a>
                </p>
            </div>
        </div>
    );
};

export default FileUpload;