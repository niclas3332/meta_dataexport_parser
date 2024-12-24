# Meta Data Logs Viewer

Client-side viewer for Meta's Data Logs from the "Download Your Information" tool.

[Live Demo](https://data-parser.niclas.xyz)

![Log Viewer Demo](https://raw.githubusercontent.com/niclas3332/meta_dataexport_parser/master/demo.png)

## 🔥 Features

- 📁 Local processing - no server uploads
- 📊 Sort, filter and group data
- 🔍 Multi-column search
- 📑 Pagination for large datasets
- 📱 Responsive design
- 🌓 Light/Dark mode

## Usage

1. Download Data Logs from [Meta's Download Your Information](https://accountscenter.facebook.com/info_and_permissions/dyi/?entry_point=notification)
2. Upload either:
   - Unzipped `download_data_logs` folder
   - ZIP file directly

## Development

```bash
git clone https://github.com/niclas3332/meta_dataexport_parser.git
cd meta_dataexport_parser
npm install
npm run dev
```

## Stack

- React + Vite
- Tailwind CSS
- shadcn/ui
- JSZip
- Lodash
