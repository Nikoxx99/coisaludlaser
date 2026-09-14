import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
  type RGB,
} from "pdf-lib";

export type AppointmentReceiptData = {
  confirmation: string;
  serviceName: string;
  professionalName: string;
  date: string;
  time: string;
  patientName: string;
  phone: string;
  email?: string;
  siteHost: string;
};

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 46;

const colors = {
  ivory: rgb(245 / 255, 242 / 255, 236 / 255),
  white: rgb(1, 1, 1),
  mist: rgb(233 / 255, 247 / 255, 251 / 255),
  sky: rgb(217 / 255, 247 / 255, 253 / 255),
  cyan: rgb(3 / 255, 210 / 255, 246 / 255),
  blue: rgb(3 / 255, 80 / 255, 225 / 255),
  navy: rgb(4 / 255, 21 / 255, 67 / 255),
  ink: rgb(14 / 255, 18 / 255, 32 / 255),
  muted: rgb(89 / 255, 96 / 255, 113 / 255),
  line: rgb(190 / 255, 219 / 255, 239 / 255),
};

function fitFontSize(
  text: string,
  font: PDFFont,
  maxWidth: number,
  preferredSize: number,
  minimumSize: number
) {
  let size = preferredSize;
  while (size > minimumSize && font.widthOfTextAtSize(text, size) > maxWidth) {
    size -= 0.5;
  }
  return size;
}

function truncateToWidth(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
) {
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text;
  let shortened = text;
  while (
    shortened.length > 1 &&
    font.widthOfTextAtSize(`${shortened.trimEnd()}...`, size) > maxWidth
  ) {
    shortened = shortened.slice(0, -1);
  }
  return `${shortened.trimEnd()}...`;
}

function drawLabel(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  color: RGB = colors.blue
) {
  page.drawText(text.toUpperCase(), {
    x,
    y,
    size: 8,
    font,
    color,
  });
}

function drawValue(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  font: PDFFont,
  preferredSize = 15,
  color: RGB = colors.navy
) {
  const size = fitFontSize(text, font, maxWidth, preferredSize, 9);
  page.drawText(truncateToWidth(text, font, size, maxWidth), {
    x,
    y,
    size,
    font,
    color,
  });
}

function formatReceiptDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function receiptFilename(confirmation: string) {
  const suffix = confirmation.replace(/[^a-z0-9]/gi, "").slice(-10) || "confirmada";
  return `comprobante-cita-${suffix.toLowerCase()}.pdf`;
}

export async function createAppointmentReceiptPdf(
  data: AppointmentReceiptData,
  logoPngBytes: Uint8Array
) {
  const document = await PDFDocument.create();
  document.setTitle(`Comprobante de cita ${data.confirmation}`);
  document.setAuthor("COISalud Láser");
  document.setSubject("Confirmación de cita");
  document.setCreator("coisaludlaser.com");
  document.setProducer("COISalud Láser");

  const page = document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const helvetica = await document.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await document.embedFont(StandardFonts.HelveticaBold);
  const times = await document.embedFont(StandardFonts.TimesRoman);
  const logo = await document.embedPng(logoPngBytes);
  const logoSize = logo.scaleToFit(58, 44);

  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: colors.ivory,
  });
  page.drawRectangle({
    x: PAGE_WIDTH - 168,
    y: PAGE_HEIGHT - 170,
    width: 168,
    height: 170,
    color: colors.sky,
    opacity: 0.58,
  });
  page.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 7,
    width: PAGE_WIDTH,
    height: 7,
    color: colors.blue,
  });
  page.drawRectangle({
    x: PAGE_WIDTH - 112,
    y: 0,
    width: 112,
    height: 118,
    color: colors.mist,
    opacity: 0.72,
  });

  page.drawImage(logo, {
    x: MARGIN,
    y: 751,
    width: logoSize.width,
    height: logoSize.height,
  });
  page.drawText("COISalud Láser", {
    x: MARGIN + 74,
    y: 777,
    size: 14,
    font: helveticaBold,
    color: colors.navy,
  });
  page.drawText("Dra. Angie Lezama", {
    x: MARGIN + 74,
    y: 759,
    size: 9,
    font: helvetica,
    color: colors.muted,
  });

  page.drawCircle({
    x: PAGE_WIDTH - MARGIN - 18,
    y: 774,
    size: 18,
    color: colors.blue,
  });
  page.drawLine({
    start: { x: PAGE_WIDTH - MARGIN - 25, y: 774 },
    end: { x: PAGE_WIDTH - MARGIN - 20, y: 768 },
    thickness: 2.1,
    color: colors.white,
  });
  page.drawLine({
    start: { x: PAGE_WIDTH - MARGIN - 20, y: 768 },
    end: { x: PAGE_WIDTH - MARGIN - 10, y: 780 },
    thickness: 2.1,
    color: colors.white,
  });

  drawLabel(page, "Cita confirmada", MARGIN, 710, helveticaBold);
  page.drawText("Tu horario quedó reservado.", {
    x: MARGIN,
    y: 670,
    size: 29,
    font: times,
    color: colors.navy,
  });
  page.drawText("Aquí tienes la información de tu cita.", {
    x: MARGIN,
    y: 645,
    size: 10.5,
    font: helvetica,
    color: colors.muted,
  });

  page.drawRectangle({
    x: MARGIN,
    y: 516,
    width: PAGE_WIDTH - MARGIN * 2,
    height: 100,
    color: colors.mist,
    borderColor: colors.line,
    borderWidth: 1,
  });
  drawLabel(page, "Fecha y hora", MARGIN + 20, 590, helveticaBold);
  drawValue(
    page,
    formatReceiptDate(data.date),
    MARGIN + 20,
    552,
    350,
    times,
    20
  );
  page.drawRectangle({
    x: PAGE_WIDTH - MARGIN - 98,
    y: 543,
    width: 78,
    height: 36,
    color: colors.blue,
  });
  const timeSize = fitFontSize(data.time, helveticaBold, 58, 15, 11);
  const timeWidth = helveticaBold.widthOfTextAtSize(data.time, timeSize);
  page.drawText(data.time, {
    x: PAGE_WIDTH - MARGIN - 59 - timeWidth / 2,
    y: 555,
    size: timeSize,
    font: helveticaBold,
    color: colors.white,
  });

  page.drawRectangle({
    x: MARGIN,
    y: 404,
    width: PAGE_WIDTH - MARGIN * 2,
    height: 88,
    color: colors.white,
    borderColor: colors.line,
    borderWidth: 1,
  });
  const columnWidth = (PAGE_WIDTH - MARGIN * 2 - 62) / 2;
  drawLabel(page, "Servicio", MARGIN + 20, 466, helveticaBold);
  drawValue(
    page,
    data.serviceName,
    MARGIN + 20,
    432,
    columnWidth,
    helveticaBold,
    14
  );
  page.drawLine({
    start: { x: PAGE_WIDTH / 2, y: 421 },
    end: { x: PAGE_WIDTH / 2, y: 475 },
    thickness: 0.8,
    color: colors.line,
  });
  drawLabel(page, "Profesional", PAGE_WIDTH / 2 + 20, 466, helveticaBold);
  drawValue(
    page,
    data.professionalName,
    PAGE_WIDTH / 2 + 20,
    432,
    columnWidth,
    helveticaBold,
    14
  );

  page.drawRectangle({
    x: MARGIN,
    y: 308,
    width: PAGE_WIDTH - MARGIN * 2,
    height: 72,
    color: colors.white,
    borderColor: colors.line,
    borderWidth: 1,
  });
  drawLabel(page, "A nombre de", MARGIN + 20, 356, helveticaBold);
  drawValue(
    page,
    data.patientName,
    MARGIN + 20,
    328,
    220,
    helveticaBold,
    13
  );
  const contact = [data.phone, data.email].filter(Boolean).join("  |  ");
  drawValue(page, contact, PAGE_WIDTH / 2, 328, 230, helvetica, 9.5, colors.muted);

  page.drawRectangle({
    x: MARGIN,
    y: 184,
    width: PAGE_WIDTH - MARGIN * 2,
    height: 96,
    color: colors.navy,
  });
  drawLabel(
    page,
    "Código de confirmación",
    MARGIN + 20,
    252,
    helveticaBold,
    colors.cyan
  );
  const confirmationSize = fitFontSize(
    data.confirmation,
    helveticaBold,
    PAGE_WIDTH - MARGIN * 2 - 40,
    15,
    8.5
  );
  page.drawText(
    truncateToWidth(
      data.confirmation,
      helveticaBold,
      confirmationSize,
      PAGE_WIDTH - MARGIN * 2 - 40
    ),
    {
    x: MARGIN + 20,
    y: 214,
    size: confirmationSize,
    font: helveticaBold,
    color: colors.white,
    }
  );

  page.drawLine({
    start: { x: MARGIN, y: 134 },
    end: { x: PAGE_WIDTH - MARGIN, y: 134 },
    thickness: 0.8,
    color: colors.line,
  });
  page.drawCircle({ x: MARGIN + 9, y: 103, size: 9, color: colors.blue });
  page.drawLine({
    start: { x: MARGIN + 5, y: 103 },
    end: { x: MARGIN + 8, y: 99.5 },
    thickness: 1.2,
    color: colors.white,
  });
  page.drawLine({
    start: { x: MARGIN + 8, y: 99.5 },
    end: { x: MARGIN + 13.5, y: 106 },
    thickness: 1.2,
    color: colors.white,
  });
  page.drawText("Conserva este comprobante.", {
    x: MARGIN + 27,
    y: 99,
    size: 9.5,
    font: helveticaBold,
    color: colors.navy,
  });
  page.drawText(data.siteHost, {
    x:
      PAGE_WIDTH -
      MARGIN -
      helvetica.widthOfTextAtSize(data.siteHost, 9),
    y: 99,
    size: 9,
    font: helvetica,
    color: colors.muted,
  });

  return document.save();
}

export async function downloadAppointmentReceipt(data: AppointmentReceiptData) {
  const logoResponse = await fetch("/brand/angie-lezama-logo.png", {
    cache: "force-cache",
  });
  if (!logoResponse.ok) {
    throw new Error("No pudimos cargar el logo del comprobante.");
  }

  const logoBytes = new Uint8Array(await logoResponse.arrayBuffer());
  const pdfBytes = await createAppointmentReceiptPdf(data, logoBytes);
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = receiptFilename(data.confirmation);
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
