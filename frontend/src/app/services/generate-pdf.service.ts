import { Injectable } from '@angular/core';
import * as jsPDFAll from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class GeneratePdfService {

      generatePdf(data, id: number) {
        html2canvas(data, { allowTaint: true }).then((canvas) => {
            let HTML_Width = canvas.width;
            let HTML_Height = canvas.height;
            let top_left_margin = 15;
            let PDF_Width = HTML_Width + top_left_margin * 2;
            let PDF_Height = PDF_Width * 1.5 + top_left_margin * 2;
            let canvas_image_width = HTML_Width;
            let canvas_image_height = HTML_Height;
            let totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
            canvas.getContext('2d');
            let imgData = canvas.toDataURL('image/jpeg', 1.0);
            let pdf = new jsPDFAll.jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
            pdf.addImage(
                imgData,
                'JPG',
                top_left_margin,
                top_left_margin,
                canvas_image_width,
                canvas_image_height
            );
            for (let i = 1; i <= totalPDFPages; i++) {
                pdf.addPage([PDF_Width, PDF_Height], 'p');
                pdf.addImage(
                    imgData,
                    'JPG',
                    top_left_margin,
                    -(PDF_Height * i) + top_left_margin * 4,
                    canvas_image_width,
                    canvas_image_height
                );
            }
            const namePDF = 'BonusRecords_' + id + '.pdf';
            pdf.save(namePDF);
        });
    }

}

