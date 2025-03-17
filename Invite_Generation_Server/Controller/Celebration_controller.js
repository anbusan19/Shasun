const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Set up Multer for file uploads
const uploadDir = path.join(__dirname, './certificates');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

const uploadFiles = upload.fields([
    { name: 'eventImage', maxCount: 1 }
]);

const generateCelebration = (req, res) => {
    try {
        const { 
            eventTitle,
            eventTagline,
            eventSlogan,
            date,
            time,
            venue,
            organization
        } = req.body;

        const { eventImage } = req.files || {};

        const certificatesDir = path.join(__dirname, './certificates');
        if (!fs.existsSync(certificatesDir)) {
            fs.mkdirSync(certificatesDir, { recursive: true });
        }

        const filePath = path.join(certificatesDir, "certificate.pdf");
        const doc = new PDFDocument({ size: 'A4' });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Add background
        const backgroundPath = path.join(__dirname, '../assets/bg.jpg');
        if (fs.existsSync(backgroundPath)) {
            doc.image(backgroundPath, 0, 0, { width: doc.page.width, height: doc.page.height });
        }

        // Add college logo
        const logoPath = path.join(__dirname, './college_logo.png');
        const logoWidth = 250;
        const logoHeight = 80;
        const logoX = (doc.page.width - logoWidth) / 2;
        doc.image(logoPath, logoX, 60, { width: logoWidth, height: logoHeight });

        // Add IQAC text
        doc.y = 160;
        doc.fillColor([181,13,14])
           .font('Times-Bold')
           .fontSize(20)
           .text('Internal Quality Assurance Cell (IQAC)', { align: 'center' });
        
        doc.moveDown(0.2);
        doc.text('&', { align: 'center' });
        doc.moveDown(0.2);
        doc.text('SHABASH', { align: 'center' });
        doc.moveDown(0.2);
        doc.text('(Entrepreneurship Development Cell)', { align: 'center' });

        // Add invitation text
        doc.moveDown(1);
        doc.fillColor([36, 27, 156])
           .fontSize(22)
           .text('Cordially invite you for the', { align: 'center' });

        // Add event title
        doc.moveDown(0.3);
        doc.fillColor([181,13,14])
           .fontSize(22)
           .text(eventTitle, { align: 'center' });

        // Add event tagline
        if (eventTagline) {
            doc.moveDown(0.3);
            doc.fillColor([0,128,0])
               .fontSize(24)
               .text(`"${eventTagline}"`, { align: 'center' });
        }

        // Add event image if provided
        if (eventImage?.[0]?.path) {
            doc.moveDown(0.5);
            const imgWidth = 200;
            const imgHeight = 150;
            const imgX = (doc.page.width - imgWidth) / 2;
            doc.image(eventImage[0].path, imgX, doc.y, { 
                width: imgWidth,
                height: imgHeight,
                fit: [imgWidth, imgHeight]
            });
            doc.moveDown(8); // Adjust spacing after image
        }

        // Add event slogan
        if (eventSlogan) {
            doc.fillColor([36, 27, 156])
               .font('Times-Italic')
               .fontSize(16)
               .text(`"${eventSlogan}"`, { align: 'center' });
            doc.moveDown(0.5);
        }


        // Format date and time
        const [year, month, day] = date.split("-");
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const [hour, minute] = time.split(":");
        const period = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        const formattedTime = `${formattedHour}:${minute} ${period}`;

        // Move to bottom section
        const bottomY = doc.page.height - 107;
        const detailsY = bottomY - 100; // Position details 100 points above signatories

        // Function to get ordinal suffix
        const getOrdinalSuffix = (day) => {
            if (day >= 11 && day <= 13) return { text: "th", superscript: true };
            switch (day % 10) {
                case 1: return { text: "st", superscript: true };
                case 2: return { text: "nd", superscript: true };
                case 3: return { text: "rd", superscript: true };
                default: return { text: "th", superscript: true };
            }
        };

        // Draw details at bottom
        doc.font('Times-Bold').fontSize(14);

        // Date with ordinal suffix
        const suffix = getOrdinalSuffix(parseInt(day));
        const dateText = `Date: ${day}${suffix.text} ${monthNames[month - 1]} ${year}`;
        const dateWidth = doc.widthOfString(dateText);
        const dateX = (doc.page.width - dateWidth) / 2;
        doc.y = detailsY;
        doc.fillColor([181, 13, 14]).text("Date: ", dateX, doc.y, { continued: true })
           .fillColor([36, 27, 156]).text(`${day}`, { continued: true })
           .fillColor([36, 27, 156]).text(suffix.text, { continued: true, superscript: true })
           .text(` ${monthNames[month - 1]} ${year}`);

        // Time
        doc.moveDown(0.5);
        const timeText = `Time: ${formattedTime}`;
        const timeWidth = doc.widthOfString(timeText);
        const timeX = (doc.page.width - timeWidth) / 2;
        doc.fillColor([181, 13, 14]).text("Time: ", timeX, doc.y, { continued: true })
           .fillColor([36, 27, 156]).text(formattedTime);

        // Venue
        doc.moveDown(0.5);
        const venueText = `Venue: ${venue}${organization ? ', Academic Block-' : ''}${organization || ''}`;
        const venueWidth = doc.widthOfString(venueText);
        const venueX = (doc.page.width - venueWidth) / 2;
        doc.fillColor([181, 13, 14]).text("Venue: ", venueX, doc.y, { continued: true })
           .fillColor([36, 27, 156]).text(`${venue}${organization ? ', Academic Block-' : ''}${organization || ''}`);

        // Signatory Section
        doc.moveDown(2);
        const colWidth = doc.page.width / 3;

        doc.fillColor([36, 27, 156])
           .font('Times-Bold')
           .fontSize(14)
           .text("Smt. Usha Abhaya Srisrimal", colWidth * 0, bottomY, { align: 'center', width: colWidth })
           .fontSize(12)
           .text("Secretary", colWidth * 0, bottomY + 20, { align: 'center', width: colWidth });

        doc.fillColor([36, 27, 156])
           .font('Times-Bold')
           .fontSize(14)
           .text("Dr. Harish L Metha", colWidth * 1, bottomY, { align: 'center', width: colWidth })
           .fontSize(12)
           .text("Associate Secretary", colWidth * 1, bottomY + 20, { align: 'center', width: colWidth });

        doc.fillColor([36, 27, 156])
           .font('Times-Bold')
           .fontSize(14)
           .text("Dr. S. Padmavathi", colWidth * 2, bottomY, { align: 'center', width: colWidth })
           .fontSize(12)
           .text("Principal", colWidth * 2, bottomY + 20, { align: 'center', width: colWidth });

        doc.end();

        stream.on('finish', () => {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename=celebration.pdf');
            res.sendFile(path.resolve(filePath));
        });
    } catch (error) {
        console.error('Error generating celebration invite:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports = { uploadFiles, generateCelebration };
