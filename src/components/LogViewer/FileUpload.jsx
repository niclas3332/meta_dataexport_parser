import {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import JSZip from 'jszip';
import {useToast} from '@/hooks/use-toast';
import {Button} from "@/components/ui/button.jsx";
import {generateExampleData} from "@/lib/dataGenerator.js";

const FileUpload = ({onFilesProcessed}) => {
    const {toast} = useToast();


    const loadExampleData = async () => {
        await generateExampleData(
            (data) => {
                onFilesProcessed(data);
                toast({
                    title: "Success",
                    description: "Example data loaded successfully"
                });
            },
            (error) => {
                console.error('Error generating example data:', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load example data"
                });
            }
        );
    };


    const processZip = async (zipFile) => {
        try {
            const zip = await JSZip.loadAsync(zipFile);
            const categorizedData = {};
            let foundValidFiles = false;

            await Promise.all(
                Object.entries(zip.files).map(async ([path, zipEntry]) => {
                    if (zipEntry.dir) return;

                    const match = path.match(/download_data_logs\/content\/(\d+)\/page_(\d+)\.json$/);
                    if (!match) return;

                    foundValidFiles = true;
                    const categoryId = parseInt(match[1]);

                    try {
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
                    } catch (err) {
                        throw new Error(`Failed to process file ${path}: ${err.message}`);
                    }
                })
            );

            if (!foundValidFiles) {
                throw new Error('No valid JSON files found in the expected directory structure');
            }

            return categorizedData;
        } catch (error) {
            throw new Error(`ZIP processing failed: ${error.message}`);
        }
    };

    const processDirectory = async (files) => {
        try {
            const categorizedData = {};
            let foundValidFiles = false;

            await Promise.all(
                files.map(async (file) => {
                    const path = file.path || file.webkitRelativePath || file.name;
                    const match = path.match(/content\/(\d+)\/page_(\d+)\.json$/);
                    if (!match) return;

                    foundValidFiles = true;
                    const categoryId = parseInt(match[1]);

                    try {
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
                    } catch (err) {
                        throw new Error(`Failed to process file ${path}: ${err.message}`);
                    }
                })
            );

            if (!foundValidFiles) {
                throw new Error('No valid JSON files found in the selected files');
            }

            return categorizedData;
        } catch (error) {
            throw new Error(`Directory processing failed: ${error.message}`);
        }
    };

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No files were selected"
            });
            return;
        }

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
                toast({
                    title: "Success",
                    description: "Files processed successfully"
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No valid data found in the selected files"
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message
            });
        }
    }, [onFilesProcessed, toast]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        noClick: false,
        noKeyboard: false,
        multiple: true
    });
    return (
        <div className="space-y-4">
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
            <div className="flex justify-center">
                <Button
                    variant="outline"
                    onClick={loadExampleData}
                >
                    View Example Data
                </Button>
            </div>
            <div className="text-center space-y-2">
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