import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

export interface ExportPdfOptions {
  elementId: string;
  filename?: string;
  isThermal?: boolean;
  paperSize?: "A4" | "A5" | "Thermal-80mm" | "Thermal-58mm";
}

export async function exportElementToPdf({
  elementId,
  filename = "invoice.pdf",
  isThermal = false,
  paperSize = "A4",
}: ExportPdfOptions): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return false;
  }

  try {
    // Generate high resolution canvas
    const canvas = await html2canvas(element, {
      scale: 2.5, // Crisp rendering
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    let pdf: jsPDF;

    if (isThermal || paperSize === "Thermal-80mm") {
      // 80mm width, dynamic height
      const widthMm = 80;
      const heightMm = (canvas.height * widthMm) / canvas.width;
      pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [widthMm, heightMm],
      });
      pdf.addImage(imgData, "PNG", 0, 0, widthMm, heightMm, undefined, "FAST");
    } else if (paperSize === "Thermal-58mm") {
      // 58mm width, dynamic height
      const widthMm = 58;
      const heightMm = (canvas.height * widthMm) / canvas.width;
      pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [widthMm, heightMm],
      });
      pdf.addImage(imgData, "PNG", 0, 0, widthMm, heightMm, undefined, "FAST");
    } else if (paperSize === "A5") {
      pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a5",
      });
      const widthMm = 148;
      const heightMm = (canvas.height * widthMm) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, widthMm, Math.min(210, heightMm), undefined, "FAST");
    } else {
      // Standard A4
      pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const widthMm = 210;
      const heightMm = (canvas.height * widthMm) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, widthMm, Math.min(297, heightMm), undefined, "FAST");
    }

    pdf.save(filename);
    return true;
  } catch (err) {
    console.error("Error exporting to PDF:", err);
    return false;
  }
}

export function printInvoice(): void {
  if (typeof window === "undefined") return;
  window.print();
}

export async function exportToPdf(
  elementId: string,
  filename: string = "invoice.pdf",
  paperSize: string = "a4"
): Promise<boolean> {
  const normalized = paperSize.toLowerCase();
  const isThermal = normalized.includes("thermal");
  const mappedPaperSize: "A4" | "A5" | "Thermal-80mm" | "Thermal-58mm" =
    normalized.includes("58")
      ? "Thermal-58mm"
      : isThermal || normalized.includes("80")
      ? "Thermal-80mm"
      : normalized === "a5"
      ? "A5"
      : "A4";

  return exportElementToPdf({
    elementId,
    filename,
    isThermal,
    paperSize: mappedPaperSize,
  });
}
