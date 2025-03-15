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

const generateCertificate = (req, res) => {
    try {
        const { 
            eventTitle, subtitle, date, venue, chiefGuests, 
            organization, collaboration, time, clubName, course, department, endDate, eventType, additionalImageDescription 
        } = req.body;

        const agendaList = req.body.agendaList;
        const agendaArray = Array.isArray(agendaList)
            ? agendaList
            : (agendaList ? [agendaList] : []);

        const collaborationArray = collaboration && typeof collaboration === 'string'
            ? collaboration.split(',').map(item => item.trim())
            : Array.isArray(collaboration)
                ? collaboration
                : [];

        // Parse chiefGuests JSON string into an array of objects.
        let chiefGuestsArray = [];
        try {
            chiefGuestsArray = JSON.parse(chiefGuests);
        } catch (err) {
            console.error("Error parsing chiefGuests JSON", err);
            chiefGuestsArray = [];
        }

        let collaboratorsArray = [];
        try {
            collaboratorsArray = JSON.parse(req.body.collaborators);
        } catch (err) {
            console.error("Error parsing collaborators JSON", err);
            collaboratorsArray = [];
        }

        let titlesArray = req.body.titles;
        if (!Array.isArray(titlesArray) && titlesArray) {
            titlesArray = [titlesArray];
        } else if (!titlesArray) {
            titlesArray = [];
        }

        // Uploaded files
        const { clubLogo, collaboratorLogos, chiefGuestImages, additionalImage } = req.files || {};

        const certificatesDir = path.join(__dirname, './certificates');
        if (!fs.existsSync(certificatesDir)) {
            fs.mkdirSync(certificatesDir, { recursive: true });
        }


        const filePath = path.join(certificatesDir, "certificate.pdf");

        const doc = new PDFDocument({ size: 'A4' });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        const backgroundPath = path.join(__dirname, '../assets/bg.jpg');
        if (fs.existsSync(backgroundPath)) {
            doc.image(backgroundPath, 0, 0, { width: doc.page.width, height: doc.page.height });
        } else {
            console.warn('Background image not found!');
        }

        // Logos Section
        const logoY = 60;
        const logoHeight = 80;
        const leftLogoWidth = 80;
        const collegeLogoWidth = 275;
        const rightLogosWidth = 80;
        const totalRightLogos = collaboratorLogos ? collaboratorLogos.length : 0;
        const totalWidth = collegeLogoWidth + leftLogoWidth + totalRightLogos * rightLogosWidth + 10 * (totalRightLogos - 1);
        const centerX = (doc.page.width - totalWidth) / 2;
        const leftLogoX = centerX;
        const collegeLogoX = leftLogoX + leftLogoWidth + 10;
        const rightLogosX = collegeLogoX + collegeLogoWidth + 10;

        if (clubLogo?.[0]?.path) {
            doc.image(clubLogo[0].path, leftLogoX, logoY, { width: leftLogoWidth, height: logoHeight });
        }
        const logoPath = path.join(__dirname, './college_logo.png');
        doc.image(logoPath, collegeLogoX, logoY, { width: collegeLogoWidth, height: logoHeight });
        if (collaboratorLogos) {
            collaboratorLogos.forEach((logo, index) => {
                const posX = rightLogosX + index * (rightLogosWidth + 10);
                if (logo?.path) {
                    doc.image(logo.path, posX, logoY, { width: rightLogosWidth, height: logoHeight });
                }
            });
        }

        doc.y = logoY + 100;
        doc.fillColor('#000').font('Times-Bold').fontSize(14);
        doc.fillColor([181,13,14]).font('Times-Bold').fontSize(20).text(`${"Internal Quality Assurance Cell (IQAC)"}`, { align: 'center' });
            doc.moveDown(0.2);
            if (clubName) {
                doc.fillColor([181,13,14]).font('Times-Bold').fontSize(20).text("&", { align: 'center' });
                doc.moveDown(0.2);
            }
            
           if (clubName) {
            doc.fillColor([181, 13, 14]).font('Times-Bold').text(
                `${clubName}${department ? ' of' : ''}`, 
                { align: 'center' }
              );            
            doc.moveDown(0.2);
           } if (department && course) {
                doc.fillColor([181,13,14]).font('Times-Bold').text(`${department} Department of ${course}`, { align: 'center' });
           }
        
        doc.moveDown(0);

        if ((collaborationArray && collaborationArray.length > 0) || (collaboratorsArray && collaboratorsArray.length > 0)) {
            doc.font('Times-Bold')
               .fontSize(14)
               .text(`In Collaboration with`, { align: 'center' });
            doc.moveDown(0);
        
            let formattedCollaborators = "";
        
            if (collaboratorsArray.length > 0) {
                formattedCollaborators = collaboratorsArray.map(collab => collab.name).join("\n");
            }
        
            if (collaborationArray.length > 0) {
                let legacyNames = collaborationArray.join("\n");
                formattedCollaborators = formattedCollaborators 
                    ? legacyNames + "\n" + formattedCollaborators 
                    : legacyNames;
            }
        
            doc.fillColor([181, 13, 14])
               .font('Times-Bold')
               .fontSize(20)
               .text(formattedCollaborators, { align: 'center' });
            
        } else {
            doc.moveDown();
        }

        doc.fillColor([36, 27, 156])
           .font('Times-Bold')
           .fontSize(18)
           .text(`Cordially invites you for the`, { align: 'center' });
        if (eventType) {
            doc.fillColor([181,13,14])
           .font('Times-Bold')
           .fontSize(20)
           .text(`${eventType}` , { align: 'center' });
        } else {
            doc.fillColor([181,13,14])
           .font('Times-Bold')
           .fontSize(20)
           .text(`${eventTitle}` , { align: 'center' });
        }
        
        doc.fillColor([181,13,14])
           .font('Times-Bold')
           .fontSize(14)
           .text(subtitle, { align: 'center' });
        doc.moveDown(-0.4);

        if (titlesArray.length > 0) {
            let formattedTitles = titlesArray.join("\n"); // Each title on a new line
        
            doc.fillColor([181, 13, 14])
               .font('Times-Bold')
               .fontSize(18)
               .text("On", { align: 'center' }) // "On" on one line
               .text(formattedTitles, { align: 'center' }) // Titles on separate lines
               .moveDown();
        }

        // Resource People Section (only if chief guests exist)
        if (chiefGuestsArray && chiefGuestsArray.length > 0 ) {
            if (chiefGuestsArray && chiefGuestsArray.length > 1) {
                doc.fillColor([181,13,14])
                .font('Times-Bold')
                .fontSize(14)
                .text("Resource People", { align: 'center' });
                // doc.moveDown();
            } else {
                doc.fillColor([181,13,14])
                .font('Times-Bold')
                .fontSize(14)
                .text("Resource Person", { align: 'center' });
                // doc.moveDown();
            }
        } else {
            doc.moveDown();
        }
                  
        // Chief Guest Section
        const guestCount = chiefGuestsArray.length;
        const guestY = doc.y + 15;
        const imageSize = 80;
        let guestXPositions = [];

        if (guestCount === 1) {
            guestXPositions = [doc.page.width / 2 - imageSize / 2];
        } else if (guestCount === 2) {
            guestXPositions = [
                doc.page.width * 0.3 - imageSize / 2, 
                doc.page.width * 0.7 - imageSize / 2
            ];
        } else if (guestCount >= 3) {
            const spacing = doc.page.width / (guestCount + 1);
            guestXPositions = Array.from({ length: guestCount }, (_, i) => spacing * (i + 1) - imageSize / 2);
        }

        const chiefGuestImagePaths = (chiefGuestImages || []).map(img => img.path);
        console.log('Final Chief Guest Image Paths:', chiefGuestImagePaths);

        chiefGuestsArray.forEach((guest, index) => {
            if (index >= guestXPositions.length) return;
            const guestX = guestXPositions[index];
            const guestImagePath = chiefGuestImagePaths[index] || null;
            console.log(`Placing image for guest ${index}:`, guestImagePath);

            // Place the guest image
            if (guestImagePath) {
                doc.image(guestImagePath, guestX, guestY, { width: imageSize, height: imageSize });
            } else {
                console.warn(`No image found for guest at index ${index}`);
            }

            // Calculate text position
            const textY = guestY + imageSize + 10;
            const textWidth = doc.page.width / guestCount - 10;

            // Construct guest details
            const fullName = `${guest.salutation ? guest.salutation + ' ' : ''}${guest.name || ''}`;
            const designation = guest.designation || '';
            const additionalText = guest.additionalText || '';

            // Render guest name
            doc.font('Times-Bold')
            .fontSize(12)
            .fillColor([181, 13, 14]) 
            .text(fullName, guestX - (textWidth / 2) + (imageSize / 2), textY, {
                align: 'center',
                width: textWidth
            });

           
            doc.font('Times-Bold')
            .fontSize(10)
            .fillColor([36, 27, 156]) 
            .text(designation, guestX - (textWidth / 2) + (imageSize / 2), textY + 14, {
                align: 'center',
                width: textWidth
            });

            
            doc.font('Times-Bold')
            .fontSize(10)
            .fillColor([36, 27, 156]) 
            .text(additionalText, guestX - (textWidth / 2) + (imageSize / 2), textY + 28, {
                align: 'center',
                width: textWidth
            });
        });
                
                doc.moveDown(0.5);

        // Time, Date and End Date Section
        const textSize = 19;
        doc.font('Times-Bold').fontSize(textSize);

        // Function to get ordinal suffix
        const getOrdinalSuffix = (day) => {
        if (day >= 11 && day <= 13) return "th";
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
        };

        // --- Start Date ---
        const [year, month, day] = date.split("-").map(Number);
        const suffix = getOrdinalSuffix(day);
        const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];
        const monthName = monthNames[month - 1];

        // --- End Date ---
        let endDateString = "";
        if (typeof endDate !== "undefined" && endDate.trim() !== "") {
        const [eYear, eMonth, eDay] = endDate.split("-").map(Number);
        if (eDay !== 0 && eYear !== 0) {
            const eSuffix = getOrdinalSuffix(eDay);
            const eMonthName = monthNames[eMonth - 1];
            endDateString = ` - ${eDay}${eSuffix} ${eMonthName} ${eYear}`;
        } 
        } else {
        endDateString = ` `;
        }

        const [hour, minute] = time.split(":").map(Number);
        const period = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        const formattedTime = `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;

        const startLabel = "Date: ";
        const startDateString = `${day}${suffix} ${monthName} ${year}`;
        const timeLabel = "Time: ";
        const timeString = formattedTime;

        doc.font('Times-Bold').fontSize(textSize);

        const dateText = `${startLabel}${startDateString}${endDateString}`;
        const startDateWidth = doc.widthOfString(dateText);
        const startDateX = (doc.page.width - startDateWidth) / 2;

        doc.fillColor([181, 13, 14])
        .text(startLabel, startDateX, doc.y, { continued: true })
        .fillColor([36, 27, 156])
        .text(`${day}`, { continued: true }) // Day without suffix
        .fillColor([36, 27, 156])
        .text(suffix, { continued: true, superscript: true }) // Superscript suffix
        .text(` ${monthName} ${year}`, { continued: true });

        if (endDateString) {
        doc.fillColor([36, 27, 156])
            .text(endDateString);
        } else {
        doc.moveDown(0.5); 
        }

        doc.font('Times-Bold').fontSize(textSize);

        const timeText = `${timeLabel}${timeString}`;
        const timeWidth = doc.widthOfString(timeText);
        const timeX = (doc.page.width - timeWidth) / 2;

        // Render time text in center
        doc.fillColor([181, 13, 14])
        .text(timeLabel, timeX, doc.y, { continued: true })
        .fillColor([36, 27, 156])
        .text(timeString);

        // --- Venue ---
        const venueLabel = "Venue: ";
        const venueValueStr = `${venue}${organization ? ', Academic Block-' : '' } ${organization ? organization : ''}`; // Ensure 'venue' and 'organization' are defined in req.body

        doc.font('Times-Bold').fontSize(textSize);
        const venueLabelWidth = doc.widthOfString(venueLabel);
        const venueValueWidth = doc.widthOfString(venueValueStr);

        // Total width for the venue line
        const totalVenueWidth = venueLabelWidth + venueValueWidth;

        // Compute starting x-coordinate to center the venue line
        const venueLineX = (doc.page.width - totalVenueWidth) / 2;

        // Render venue line
        doc.fillColor([181, 13, 14])
        .text(venueLabel, venueLineX, doc.y, { continued: true });
        doc.fillColor([36, 27, 156])
        .text(venueValueStr, { continued: false });

        // Signatory Section 
        const bottomY = doc.page.height - 107; 
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

        // -------------------------------
        // Agenda List Section (Added)
        // -------------------------------
        
        if (agendaArray.length > 0) {
            doc.moveDown(2);
            doc.addPage();
            if (fs.existsSync(backgroundPath)) {
                doc.image(backgroundPath, 0, 0, { width: doc.page.width, height: doc.page.height });
            }
            if (agendaArray.length > 0) {
                doc.font('Times-Bold')
                .fontSize(18)
                .fillColor([48,57,77])
                .text("Agenda: ", doc.page.margins.left, doc.y, { continued: true });
                doc.fillColor([48,57,77])
                .text(startDateString, { continued: true });
                // doc.fontSize(18 - 6)
                // .text(suffix, { baseline: "sup", continued: true });
                // doc.fontSize(18)
                // .text(` ${remainingDateString}`);
                doc.moveDown(2);
                doc.font('Times-Bold').fontSize(18).fillColor([48,57,77]);
                agendaArray.forEach((item, index) => {
                    doc.text(`${item}`, doc.page.margins.left);
                });
                doc.moveDown();
            }
        }

        doc.end();
        stream.on('finish', () => {
            // Set headers for inline display (preview)
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "inline; filename=certificate.pdf");
            res.sendFile(path.resolve(filePath));
        });
    } catch (error) {
        console.error('Error generating certificate:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const uploadFiles = upload.fields([
    { name: 'clubLogo', maxCount: 1 },
    { name: 'collegeLogo', maxCount: 1 },
    { name: 'collaboratorLogos', maxCount: 3 },
    { name: 'chiefGuestImages', maxCount: 3 }
]);

module.exports = { uploadFiles, generateCertificate };
