import express from 'express';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.post('/generate', async (req, res) => {
    let browser;

    try {
        console.log("🚀 Incoming Certificate Generation Request");

        const { name, course, date, testScore, userId, quizId } = req.body;

        // ✅ Log request body for debugging
        console.log("📩 Request Data:", req.body);

        // ✅ Validate required fields
        if (!name || !course || !date || testScore === undefined || !userId || !quizId) {
            console.error("⚠️ Missing required fields");
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // ✅ Ensure `testScore` is a valid number
        const score = Number(testScore);
        if (isNaN(score)) {
            console.error("⚠️ Invalid test score format:", testScore);
            return res.status(400).json({
                success: false,
                message: 'Invalid test score format'
            });
        }

        // ✅ Enforce minimum test score requirement
        if (score < 20) {
            console.error("❌ Test score too low for certificate:", score);
            return res.status(403).json({
                success: false,
                message: 'Certificate generation requires a minimum 80% test score'
            });
        }

        console.log("✅ Validation Passed!");

        // ✅ Check if HTML template exists
        const templatePath = path.join(__dirname, 'template.html');
        if (!fs.existsSync(templatePath)) {
            console.error(`❌ Template file not found at: ${templatePath}`);
            return res.status(500).json({
                success: false,
                message: 'Certificate template not found'
            });
        }

        console.log("📄 Template found. Loading HTML...");

        // ✅ Read and process the template
        let html = fs.readFileSync(templatePath, 'utf8');
        html = html.replace(/{{name}}/g, name)
                   .replace(/{{course}}/g, course)
                   .replace(/{{date}}/g, date)
                   .replace(/{{score}}/g, score);

        console.log("🔍 Processed HTML Template:\n", html);

        // ✅ Launch Puppeteer with debugging options
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage'
            ],
            dumpio: true // Enables verbose Puppeteer logs
        });

        console.log("🟢 Puppeteer launched successfully!");

        const page = await browser.newPage();
        await page.setViewport({ width: 1024, height: 768 });

        // ✅ Capture console logs from Puppeteer
        page.on('console', (msg) => console.log(`🖥 Puppeteer Log:`, msg.text()));

        console.log("⏳ Setting page content...");
        await page.setContent(html, { waitUntil: 'domcontentloaded' });

        // ✅ Wait for rendering to complete
        await new Promise(resolve => setTimeout(resolve, 1000));


        // ✅ Take a screenshot for debugging
        const debugScreenshotPath = path.join(__dirname, 'debug_screenshot.png');
        await page.screenshot({ path: debugScreenshotPath, fullPage: true });
        console.log("📸 Screenshot captured:", debugScreenshotPath);

        // ✅ Generate the certificate PDF
        const pdfPath = path.join(__dirname, `certificate_${userId}_${quizId}.pdf`);
        await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
            path: pdfPath
        });

        console.log(`📄 PDF generated at: ${pdfPath}`);

        // ✅ Close Puppeteer properly
        await browser.close();
        browser = null;

        // ✅ Ensure the file was created successfully
        if (!fs.existsSync(pdfPath)) {
            console.error("❌ PDF file was not created:", pdfPath);
            return res.status(500).json({
                success: false,
                message: 'Failed to generate certificate PDF'
            });
        }

        console.log("✅ PDF exists. Sending response...");

        // ✅ Send the generated PDF
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': fs.statSync(pdfPath).size
        });

        res.attachment(`Certificate_${name.replace(/ /g, '_')}.pdf`);
        fs.createReadStream(pdfPath).pipe(res);

    } catch (error) {
        console.error('❌ Critical error generating certificate:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to generate certificate',
            error: error.message
        });

    } finally {
        // ✅ Ensure the browser is closed in case of a failure
        if (browser) {
            await browser.close();
            console.log("🛑 Puppeteer browser closed due to error");
        }
    }
});

export default router;
