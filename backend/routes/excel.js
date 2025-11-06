const express = require('express');
const router = express.Router();
const multer = require('multer');
const ExcelJS = require('exceljs');
const IncidentReport = require('../models/IncidentReport');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload and process Excel file
router.post('/upload', upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    
    const worksheet = workbook.getWorksheet(1); // Get first worksheet
    if (!worksheet) {
      return res.status(400).json({ message: 'No worksheet found in Excel file' });
    }

    const incidents = [];
    let rowNumber = 0;

    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return; // Skip header row
      
      const rowData = row.values;
      if (rowData && rowData.length > 0) {
        const incident = {
          title: rowData[1] || '',
          description: rowData[2] || '',
          location: rowData[3] || 'Main Office',
          severity: rowData[4] || 'Medium',
          status: rowData[5] || 'Open',
          reporter: rowData[6] || 'John Smith',
          extraComments: rowData[7] || '',
          date: rowData[8] ? new Date(rowData[8]) : new Date()
        };

        // Validate required fields
        if (incident.title && incident.description) {
          incidents.push(incident);
        }
      }
      rowNumber = rowIndex;
    });

    if (incidents.length === 0) {
      return res.status(400).json({ message: 'No valid incidents found in Excel file' });
    }

    // Clear existing incidents (optional - you can remove this if you want to append)
    // await IncidentReport.deleteMany({});

    // Insert new incidents
    const savedIncidents = await IncidentReport.insertMany(incidents);

    res.json({
      message: `Successfully imported ${savedIncidents.length} incidents from Excel file`,
      importedCount: savedIncidents.length,
      totalRows: rowNumber
    });

  } catch (error) {
    console.error('Excel upload error:', error);
    res.status(500).json({ 
      message: 'Error processing Excel file',
      error: error.message 
    });
  }
});

// Export incidents to Excel
router.get('/export', async (req, res) => {
  try {
    const incidents = await IncidentReport.find().sort({ createdAt: -1 });
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Incident Reports');
    
    // Add headers
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Severity', key: 'severity', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Reporter', key: 'reporter', width: 20 },
      { header: 'Extra Comments', key: 'extraComments', width: 40 },
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 }
    ];

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Add data rows
    incidents.forEach(incident => {
      worksheet.addRow({
        id: incident._id.toString(),
        title: incident.title,
        description: incident.description,
        location: incident.location,
        severity: incident.severity,
        status: incident.status,
        reporter: incident.reporter,
        extraComments: incident.extraComments || '',
        date: incident.date,
        createdAt: incident.createdAt,
        updatedAt: incident.updatedAt
      });
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=incident-reports.xlsx');

    // Write to response
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({ 
      message: 'Error exporting to Excel',
      error: error.message 
    });
  }
});

// Get Excel template
router.get('/template', async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Incident Reports Template');
    
    // Add headers
    worksheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Severity', key: 'severity', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Reporter', key: 'reporter', width: 20 },
      { header: 'Extra Comments', key: 'extraComments', width: 40 },
      { header: 'Date', key: 'date', width: 20 }
    ];

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Add sample data row
    worksheet.addRow({
      title: 'Sample Incident',
      description: 'This is a sample incident description',
      location: 'Main Office',
      severity: 'Medium',
      status: 'Open',
      reporter: 'John Smith',
      extraComments: 'Sample extra comments',
      date: new Date()
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=incident-template.xlsx');

    // Write to response
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Template generation error:', error);
    res.status(500).json({ 
      message: 'Error generating template',
      error: error.message 
    });
  }
});

module.exports = router; 