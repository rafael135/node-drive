import { pdfjs } from 'react-pdf';

// TODO

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.js',
	import.meta.url,
).toString();

export default pdfjs;