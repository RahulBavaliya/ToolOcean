import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    data: {
      title: 'Tool Ocean - Free Online Tools',
      description:
        'Access 15+ free online tools for developers and professionals. JSON validators, text converters, calculators, and more.',
      canonical: 'https://tool-ocean.vercel.app/'
    }
  },
  {
    path: 'tech',
    children: [
      {
        path: 'json-validator',
        loadComponent: () =>
          import('./features/tech-tools/json-validator/json-validator.component').then(
            (m) => m.JsonValidatorComponent
          ),
        data: {
          title: 'JSON Validator - Validate & Format JSON Online | Tool Ocean',
          description:
            'Free online JSON validator and formatter. Validate JSON syntax, format JSON code, and fix JSON errors instantly.',
          canonical: 'https://tool-ocean.vercel.app/tech/json-validator'
        }
      },
      {
        path: 'xml-validator',
        loadComponent: () =>
          import('./features/tech-tools/xml-validator/xml-validator.component').then(
            (m) => m.XmlValidatorComponent
          ),
        data: {
          title: 'XML Validator - Validate XML Online | Tool Ocean',
          description:
            'Free online XML validator. Check XML syntax, validate against schemas, and format XML documents.',
          canonical: 'https://tool-ocean.vercel.app/tech/xml-validator'
        }
      },
      {
        path: 'beautifier',
        loadComponent: () =>
          import('./features/tech-tools/beautifier/beautifier.component').then(
            (m) => m.BeautifierComponent
          ),
        data: {
          title: 'Code Beautifier & Formatter - HTML, CSS, JS | Tool Ocean',
          description:
            'Free online code beautifier and formatter for HTML, CSS, JavaScript, and more. Make your code readable and well-formatted.',
          canonical: 'https://tool-ocean.vercel.app/tech/beautifier'
        }
      },
      {
        path: 'regex-tester',
        loadComponent: () =>
          import('./features/tech-tools/regex-tester/regex-tester.component').then(
            (m) => m.RegexTesterComponent
          ),
        data: {
          title: 'Regular Expression Tester - Test Regex Online | Tool Ocean',
          description:
            'Free online regex tester and debugger. Test regular expressions, find matches, and debug regex patterns.',
          canonical: 'https://tool-ocean.vercel.app/tech/regex-tester'
        }
      }
    ]
  },
  {
    path: 'text',
    children: [
      {
        path: 'character-counter',
        loadComponent: () =>
          import('./features/text-tools/character-counter/character-counter.component').then(
            (m) => m.CharacterCounterComponent
          ),
        data: {
          title: 'Character Counter - Count Characters Online | Tool Ocean',
          description:
            'Free online character counter tool. Count characters, words, sentences, and paragraphs in your text.',
          canonical: 'https://tool-ocean.vercel.app/text/character-counter'
        }
      },
      {
        path: 'word-counter',
        loadComponent: () =>
          import('./features/text-tools/word-counter/word-counter.component').then(
            (m) => m.WordCounterComponent
          ),
        data: {
          title: 'Word Counter - Count Words Online | Tool Ocean',
          description:
            'Free online word counter tool. Count words, characters, sentences, and analyze text statistics.',
          canonical: 'https://tool-ocean.vercel.app/text/word-counter'
        }
      },
      {
        path: 'case-converter',
        loadComponent: () =>
          import('./features/text-tools/case-converter/case-converter.component').then(
            (m) => m.CaseConverterComponent
          ),
        data: {
          title: 'Case Converter - Change Text Case Online | Tool Ocean',
          description:
            'Free online case converter. Convert text to uppercase, lowercase, title case, sentence case, and more.',
          canonical: 'https://tool-ocean.vercel.app/text/case-converter'
        }
      }
    ]
  },
  {
    path: 'document',
    children: [
      {
        path: 'pdf-to-word',
        loadComponent: () =>
          import('./features/document-tools/pdf-to-word/pdf-to-word.component').then(
            (m) => m.PdfToWordComponent
          ),
        data: {
          title: 'PDF to Word Converter - Convert PDF to DOC Online | Tool Ocean',
          description:
            'Free online PDF to Word converter. Convert PDF files to editable Word documents quickly and securely.',
          canonical: 'https://tool-ocean.vercel.app/document/pdf-to-word'
        }
      },
      {
        path: 'word-to-pdf',
        loadComponent: () =>
          import('./features/document-tools/word-to-pdf/word-to-pdf.component').then(
            (m) => m.WordToPdfComponent
          ),
        data: {
          title: 'Word to PDF Converter - Convert DOC to PDF Online | Tool Ocean',
          description:
            'Free online Word to PDF converter. Convert Word documents to PDF files with perfect formatting.',
          canonical: 'https://tool-ocean.vercel.app/document/word-to-pdf'
        }
      }
    ]
  },
  {
    path: 'calculator',
    children: [
      {
        path: 'percentage-calculator',
        loadComponent: () =>
          import('./features/calculator-tools/percentage-calculator/percentage-calculator.component').then(
            (m) => m.PercentageCalculatorComponent
          ),
        data: {
          title: 'Percentage Calculator - Calculate Percentages Online | Tool Ocean',
          description:
            'Free online percentage calculator. Calculate percentages, percentage increase/decrease, and percentage of a number.',
          canonical: 'https://tool-ocean.vercel.app/calculator/percentage-calculator'
        }
      },
      {
        path: 'measurement-converter',
        loadComponent: () =>
          import('./features/calculator-tools/measurement-converter/measurement-converter.component').then(
            (m) => m.MeasurementConverterComponent
          ),
        data: {
          title: 'Unit Converter - Convert Measurements Online | Tool Ocean',
          description:
            'Free online unit converter. Convert length, weight, temperature, volume, and more between different units.',
          canonical: 'https://tool-ocean.vercel.app/calculator/measurement-converter'
        }
      }
    ]
  },
  {
    path: 'misc',
    children: [
      {
        path: 'qr-generator',
        loadComponent: () =>
          import('./features/misc-tools/qr-generator/qr-generator.component').then(
            (m) => m.QrGeneratorComponent
          ),
        data: {
          title: 'QR Code Generator - Create QR Codes Online | Tool Ocean',
          description:
            'Free online QR code generator. Create QR codes for URLs, text, contact info, and more. Download as PNG or SVG.',
          canonical: 'https://tool-ocean.vercel.app/misc/qr-generator'
        }
      },
      {
        path: 'qr-reader',
        loadComponent: () =>
          import('./features/misc-tools/qr-reader/qr-reader.component').then(
            (m) => m.QrReaderComponent
          ),
        data: {
          title: 'QR Code Reader - Scan QR Codes Online | Tool Ocean',
          description:
            'Free online QR code reader. Upload or scan QR codes to decode text, URLs, and other data.',
          canonical: 'https://tool-ocean.vercel.app/misc/qr-reader'
        }
      },
      {
        path: 'barcode-generator',
        loadComponent: () =>
          import('./features/misc-tools/barcode-generator/barcode-generator.component').then(
            (m) => m.BarcodeGeneratorComponent
          ),
        data: {
          title: 'Barcode Generator - Create Barcodes Online | Tool Ocean',
          description:
            'Free online barcode generator. Create Code 128, EAN-13, UPC, and other barcode formats.',
          canonical: 'https://tool-ocean.vercel.app/misc/barcode-generator'
        }
      },
      {
        path: 'barcode-reader',
        loadComponent: () =>
          import('./features/misc-tools/barcode-reader/barcode-reader.component').then(
            (m) => m.BarcodeReaderComponent
          ),
        data: {
          title: 'Barcode Reader - Scan Barcodes Online | Tool Ocean',
          description:
            'Free online barcode reader. Upload images to decode barcodes and extract data.',
          canonical: 'https://tool-ocean.vercel.app/misc/barcode-reader'
        }
      },
      {
        path: 'url-shortener',
        loadComponent: () =>
          import('./features/misc-tools/url-shortener/url-shortener.component').then(
            (m) => m.UrlShortenerComponent
          ),
        data: {
          title: 'URL Shortener - Shorten Links Online | Tool Ocean',
          description:
            'Free online URL shortener. Create short links, track clicks, and manage your shortened URLs.',
          canonical: 'https://tool-ocean.vercel.app/misc/url-shortener'
        }
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
