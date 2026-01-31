import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.js';
import voucherRoutes from './routes/vouchers.js';
import courseRoutes from './routes/courses.js';
import applicationRoutes from './routes/applications.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors({
    origin: isProduction ? true : 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files in production
if (isProduction) {
    app.use(express.static(join(__dirname, '../dist')));
    // Express 5 compatible catch-all route
    app.use((req, res, next) => {
        if (req.path.startsWith('/api')) {
            next();
        } else {
            res.sendFile(join(__dirname, '../dist/index.html'));
        }
    });
}

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
