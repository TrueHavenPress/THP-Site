/* Generates a Word doc capturing every question on the Submit Manuscript form,
   grouped by the same sections shown on the page. Run with:
     node _scratch/build-submit-questions-doc.js
   Output: _scratch/submit-manuscript-questions.docx
*/
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun,
  HeadingLevel, AlignmentType, LevelFormat,
  PageOrientation,
} = require('docx');

const ARIAL = 'Arial';

function H1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true, font: ARIAL, size: 32 })],
    spacing: { before: 240, after: 240 },
  });
}
function H2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, font: ARIAL, size: 26 })],
    spacing: { before: 280, after: 120 },
  });
}
function P(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after != null ? opts.after : 100 },
    children: [new TextRun({ text, font: ARIAL, size: 22, italics: !!opts.italic })],
  });
}
function Q(label, opts = {}) {
  const runs = [];
  runs.push(new TextRun({ text: label, bold: true, font: ARIAL, size: 22 }));
  if (opts.required) runs.push(new TextRun({ text: '  (required)', font: ARIAL, size: 20, color: '7A2B2B' }));
  else                runs.push(new TextRun({ text: '  (optional)', font: ARIAL, size: 20, color: '666666' }));
  return new Paragraph({
    spacing: { before: 180, after: 60 },
    children: runs,
  });
}
function META(label, value) {
  return new Paragraph({
    spacing: { after: 40 },
    indent: { left: 360 },
    children: [
      new TextRun({ text: label + ': ', bold: true, font: ARIAL, size: 20 }),
      new TextRun({ text: value, font: ARIAL, size: 20 }),
    ],
  });
}
function BULLET(text) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [new TextRun({ text, font: ARIAL, size: 20 })],
  });
}
function HINT(text) {
  return new Paragraph({
    spacing: { after: 120 },
    indent: { left: 360 },
    children: [new TextRun({ text: 'Helper text under the field: ', italics: true, font: ARIAL, size: 20, color: '666666' }),
               new TextRun({ text: '"' + text + '"', italics: true, font: ARIAL, size: 20, color: '666666' })],
  });
}

const children = [
  // Title
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text: 'Submit Manuscript — Form Questions', bold: true, font: ARIAL, size: 36 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 },
    children: [new TextRun({ text: 'True Haven Press · truehavenpress.com/submit-manuscript.html', font: ARIAL, size: 20, color: '666666' })],
  }),

  P('Every question a new lead is asked when they click the Submit Manuscript button, in the order they appear on the page. Sections match the fieldsets on the form. Required fields are marked.'),

  // ABOUT YOU
  H2('Section 1 — About You'),

  Q('Name', { required: true }),
  META('Field type', 'Single-line text'),

  Q('Email Address', { required: true }),
  META('Field type', 'Email'),

  Q('Phone Number', { required: false }),
  META('Field type', 'Phone (single-line text)'),

  // ABOUT YOUR BOOK
  H2('Section 2 — About Your Book'),

  Q('Book Title', { required: true }),
  META('Field type', 'Single-line text'),

  Q('Pen Name', { required: true }),
  META('Field type', 'Single-line text'),

  Q('Fiction or Nonfiction?', { required: false }),
  META('Field type', 'Dropdown'),
  META('Options', 'Fiction  ·  Nonfiction'),

  Q('Genre?', { required: false }),
  META('Field type', 'Single-line text'),
  HINT('e.g. Thriller, Memoir, Self-help'),

  Q('Document type you’ll be submitting?', { required: false }),
  META('Field type', 'Dropdown'),
  META('Options', 'Word doc  ·  PDF'),
  HINT('Word is preferred. PDFs require additional document preparation.'),

  // EDITING & PROCESS
  H2('Section 3 — Editing & Process'),

  Q('Editing Types Needed?', { required: false }),
  META('Field type', 'Checkboxes (multi-select)'),
  META('Options', ''),
  BULLET('Developmental Editing'),
  BULLET('Line Editing'),
  BULLET('Proofreading'),
  BULLET('Uncertain'),

  Q('If you used AI, which one and to what extent?', { required: false }),
  META('Field type', 'Long-form text box (3 rows)'),
  HINT('e.g. ChatGPT for outline brainstorming only; manuscript itself is hand-written.'),

  // FILES
  H2('Section 4 — Files'),

  Q('Upload your manuscript here', { required: false }),
  META('Field type', 'File upload'),
  META('Accepted', '.doc, .docx, .pdf'),
  HINT('.doc, .docx, or .pdf — Word format strongly preferred.'),

  Q('Upload your proposal here', { required: false }),
  META('Field type', 'File upload'),
  META('Accepted', '.doc, .docx, .pdf'),
  HINT('Optional. Especially helpful for nonfiction.'),

  // ANYTHING ELSE
  H2('Section 5 — Anything Else?'),

  Q('Notes', { required: false }),
  META('Field type', 'Long-form text box (5 rows)'),
  HINT('Anything you’d like us to know.'),

  // FOOTNOTE
  new Paragraph({
    spacing: { before: 360, after: 40 },
    border: { top: { style: 'single', size: 4, color: 'CCCCCC', space: 6 } },
    children: [new TextRun({ text: 'Notes', bold: true, font: ARIAL, size: 20 })],
  }),
  P('The page also has a hidden anti-spam field (a "honeypot") that is never shown to real visitors and is not counted as a question. It catches automated spambots that fill in every field they see.', { italic: false }),
];

const doc = new Document({
  creator: 'True Haven Press',
  title: 'Submit Manuscript — Form Questions',
  styles: {
    default: { document: { run: { font: ARIAL, size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: ARIAL, color: '182470' },
        paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, font: ARIAL, color: '754633' },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets',
        levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 }, // US Letter
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch
      },
    },
    children,
  }],
});

const outPath = path.join(__dirname, 'submit-manuscript-questions.docx');
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log('Wrote:', outPath, '(' + buffer.length + ' bytes)');
});
