/* Generates a brand kit Word doc with the True Haven Press colour
   palette (with swatches), font usage, and links to Google Fonts.
   Run: node _scratch/build-brand-kit-doc.js
*/
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun,
  Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, LevelFormat,
  WidthType, ShadingType, BorderStyle, VerticalAlign,
  ExternalHyperlink,
} = require('docx');

const ARIAL = 'Arial';
const PRIMARY = '754633';
const SECONDARY = '182470';

const COLORS = [
  // [hex, name, role, where it's used]
  ['754633', 'Warm Brown',    'Primary / Accent',     'Buttons, hover, link colour, headline accents'],
  ['5A3527', 'Deep Brown',    'Primary Dark',         'Button hover state'],
  ['182470', 'Navy',          'Secondary',            'Headings, dark hero backgrounds, body text on light'],
  ['CBB299', 'Cream / Tan',   'Tertiary',             'Tan CTA panel background, soft accents, hover tints'],
  ['4B5236', 'Olive',         'Contrast',             'Footer band, dark surfaces, side borders'],
  ['FFFFFF', 'White',         'Background',           'Main page background'],
  ['F6F3EE', 'Light Cream',   'Background (alt)',     'Alternating section backgrounds, callout boxes'],
  ['1F2647', 'Deep Navy',     'Body Text',            'Default body copy text colour'],
  ['666670', 'Cool Gray',     'Body Text (light)',    'Secondary text, captions, helper text'],
  ['E6DFD1', 'Warm Tan',      'Border',               'Hairline borders, card outlines, dividers'],
];

const BLACK_BORDER = { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' };
const CELL_BORDERS = { top: BLACK_BORDER, bottom: BLACK_BORDER, left: BLACK_BORDER, right: BLACK_BORDER };

function P(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after != null ? opts.after : 100 },
    alignment: opts.align || AlignmentType.LEFT,
    children: [new TextRun({
      text,
      font: opts.font || ARIAL,
      size: opts.size || 22,
      bold: !!opts.bold,
      italics: !!opts.italic,
      color: opts.color,
    })],
  });
}

function H1(text) {
  return new Paragraph({
    spacing: { before: 240, after: 240 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, font: ARIAL, size: 36, bold: true, color: SECONDARY })],
  });
}

function H2(text) {
  return new Paragraph({
    spacing: { before: 360, after: 160 },
    children: [new TextRun({ text, font: ARIAL, size: 28, bold: true, color: PRIMARY })],
  });
}

function H3(text) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, font: ARIAL, size: 22, bold: true, color: SECONDARY })],
  });
}

function swatchCell(hex) {
  return new TableCell({
    width: { size: 1200, type: WidthType.DXA },
    borders: CELL_BORDERS,
    shading: { fill: hex, type: ShadingType.CLEAR },
    margins: { top: 200, bottom: 200, left: 60, right: 60 },
    children: [new Paragraph({ children: [new TextRun({ text: ' ', font: ARIAL, size: 18 })] })],
  });
}

function textCell(text, opts = {}) {
  return new TableCell({
    width: { size: opts.width || 2200, type: WidthType.DXA },
    borders: CELL_BORDERS,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 80, bottom: 80, left: 140, right: 140 },
    children: [new Paragraph({
      children: [new TextRun({
        text,
        font: ARIAL,
        size: opts.size || 20,
        bold: !!opts.bold,
      })],
    })],
  });
}

function headerCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: CELL_BORDERS,
    shading: { fill: 'F6F3EE', type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    children: [new Paragraph({
      children: [new TextRun({ text, font: ARIAL, size: 20, bold: true, color: SECONDARY }),
      ],
    })],
  });
}

const TABLE_WIDTH_TOTAL = 9360; // US Letter content width
const COL_WIDTHS = [1200, 1800, 1800, 1400, 3160];
// Swatch, Name, Role, Hex, Use

const colorTable = new Table({
  width: { size: TABLE_WIDTH_TOTAL, type: WidthType.DXA },
  columnWidths: COL_WIDTHS,
  rows: [
    new TableRow({
      tableHeader: true,
      children: [
        headerCell('Swatch', COL_WIDTHS[0]),
        headerCell('Name', COL_WIDTHS[1]),
        headerCell('Role', COL_WIDTHS[2]),
        headerCell('Hex', COL_WIDTHS[3]),
        headerCell('Where it shows up', COL_WIDTHS[4]),
      ],
    }),
    ...COLORS.map(([hex, name, role, use]) => new TableRow({
      children: [
        swatchCell(hex),
        textCell(name, { width: COL_WIDTHS[1], bold: true }),
        textCell(role, { width: COL_WIDTHS[2] }),
        textCell('#' + hex, { width: COL_WIDTHS[3] }),
        textCell(use, { width: COL_WIDTHS[4] }),
      ],
    })),
  ],
});

const children = [
  H1('True Haven Press — Brand Kit'),
  P('truehavenpress.com', { align: AlignmentType.CENTER, color: '666670', size: 20, after: 280 }),

  P('A reference for matching anything else (social posts, slide decks, print, email signatures) to the look of the website. Drop these colour codes and fonts into any tool that asks for them.', { after: 280 }),

  H2('Colour palette'),
  colorTable,

  P(' ', { after: 100 }),
  P('Tip: when a tool only accepts RGB instead of hex, every hex code above splits into three pairs - e.g. #754633 = R 117, G 70, B 51. Most modern tools accept the hex code directly.', { italic: true, color: '666670', size: 20 }),

  H2('Fonts'),

  H3('Poppins — used for headlines, article titles, section headings'),
  P('Free on Google Fonts: https://fonts.google.com/specimen/Poppins'),
  P('Weights used on the website: 600 (Semi-Bold) for headings.', { color: '666670', size: 20 }),
  P('All weights available (100 Thin through 900 Black, in regular and italic). Pair with anything close in modern web tools: Montserrat or Manrope are reasonable substitutes if Poppins is unavailable.', { color: '666670', size: 20, after: 200 }),

  H3('Plus Jakarta Sans — used for body text, navigation, buttons, forms'),
  P('Free on Google Fonts: https://fonts.google.com/specimen/Plus+Jakarta+Sans'),
  P('Weights used on the website: 400 (Regular) for body, 600-700 for buttons and emphasis.', { color: '666670', size: 20 }),
  P('Reasonable substitutes if unavailable: Inter, Source Sans 3, or system sans.', { color: '666670', size: 20, after: 200 }),

  H2('Quick-start combinations'),

  P('The patterns the site repeats most often, in case you need to recreate them:', { after: 100 }),
  P('•  Warm brown buttons (#754633) with white text — primary call-to-action everywhere.', { color: '666670' }),
  P('•  Navy headlines (#182470) on white or cream backgrounds — most body pages.', { color: '666670' }),
  P('•  Cream / tan panels (#CBB299) with navy pill buttons — the bottom CTA strip on article pages.', { color: '666670' }),
  P('•  Olive green band (#4B5236) with white text — the footer, with brand info and contact links.', { color: '666670' }),
  P('•  Light cream (#F6F3EE) for alternating section backgrounds — keeps long pages from feeling flat.', { color: '666670' }),

  P(' ', { after: 200 }),

  P('Generated from styles.css on truehavenpress.com — if the site palette changes, regenerate this doc to keep it in sync.', { italic: true, color: '666670', size: 18 }),
];

const doc = new Document({
  creator: 'True Haven Press',
  title: 'True Haven Press — Brand Kit',
  styles: {
    default: { document: { run: { font: ARIAL, size: 22 } } },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children,
  }],
});

const outPath = path.join(__dirname, 'brand-kit.docx');
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log('Wrote:', outPath, '(' + buffer.length + ' bytes)');
});
