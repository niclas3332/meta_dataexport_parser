// dataGenerator.js
import { faker } from '@faker-js/faker';
import JSZip from 'jszip';
import { folderConfigs } from './folderConfigs';

export const generateExampleData = async (onSuccess, onError) => {
    try {
        const zip = new JSZip();
        const rootFolder = zip.folder("download_data_logs");
        const contentFolder = rootFolder.folder("content");

        const FOLDERS = {};
        const numFolders = faker.number.int({ min: 3, max: 10 });
        const selectedFolders = faker.helpers.shuffle(Object.keys(folderConfigs))
            .filter(name => name !== 'baseLabels')
            .slice(0, numFolders);

        selectedFolders.forEach((folderName) => {
            const randomId = faker.number.int({ min: 0, max: 20 });
            FOLDERS[randomId] = folderName;
        });

        const fakeData = {};

        for (const [folderId, folderName] of Object.entries(FOLDERS)) {
            const folder = contentFolder.folder(folderId);
            const folderLabels = [...folderConfigs.baseLabels, ...folderConfigs[folderName]];
            const numPages = faker.number.int({ min: 2, max: 10 });
            const allPages = [];

            for (let pageNum = 0; pageNum < numPages; pageNum++) {
                const pageEntries = generatePageEntries(folderLabels);

                folder.file(`page_${pageNum + 1}.json`, JSON.stringify({
                    name: folderName,
                    description: `Detailed information about ${folderName.toLowerCase()}`,
                    pages: [pageEntries]
                }, null, 2));

                allPages.push(pageEntries);
            }

            fakeData[parseInt(folderId)] = {
                id: parseInt(folderId),
                name: folderName,
                description: `Detailed information about ${folderName.toLowerCase()}`,
                pages: allPages
            };
        }

        onSuccess(fakeData);
        return fakeData;

    } catch (error) {
        onError(error);
        throw error;
    }
};

const generatePageEntries = (folderLabels) => {
    const numEntries = faker.number.int({ min: 75, max: 200 });
    const entries = [];

    for (let i = 0; i < numEntries; i++) {
        const timestamp = Math.floor(faker.date.past().getTime() / 1000);
        entries.push({
            timestamp,
            label_values: folderLabels.map(labelDef => ({
                label: labelDef.label,
                value: labelDef.getValue(),
                description: labelDef.description
            }))
        });
    }

    return entries;
};