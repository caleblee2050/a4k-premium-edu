import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// 수강 신청 목록 (관리자)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await db.execute({
            sql: `SELECT a.*, u.name, u.email, u.phone, c.title as course_title, v.code as voucher_code
                  FROM applications a
                  JOIN users u ON a.user_id = u.id
                  JOIN courses c ON a.course_id = c.id
                  LEFT JOIN vouchers v ON a.voucher_id = v.id
                  ORDER BY a.created_at DESC`,
            args: [],
        });
        res.json(result.rows);
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ error: '신청 목록 조회 중 오류가 발생했습니다' });
    }
});

// 수강 신청 (공개)
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, age, job, course_slug, payment_method, voucher_code } = req.body;
        console.log('[Step 1] Received request:', { name, email, phone, age, job, course_slug, payment_method, voucher_code: voucher_code ? 'provided' : 'none' });

        // 과정 찾기
        console.log('[Step 2] Looking up course:', course_slug);
        const courseResult = await db.execute({
            sql: 'SELECT id FROM courses WHERE slug = ?',
            args: [String(course_slug || '')],
        });

        if (courseResult.rows.length === 0) {
            return res.status(400).json({ error: '유효하지 않은 과정입니다' });
        }

        const courseId = Number(courseResult.rows[0].id);
        console.log('[Step 3] Found courseId:', courseId);

        // 사용자 생성 또는 찾기
        let userId;
        console.log('[Step 4] Looking up user by email:', email);
        const userResult = await db.execute({
            sql: 'SELECT id FROM users WHERE email = ?',
            args: [String(email || '')],
        });

        if (userResult.rows.length > 0) {
            userId = Number(userResult.rows[0].id);
            console.log('[Step 5a] Found existing userId:', userId);
        } else {
            console.log('[Step 5b] Creating new user');
            const tempPassword = await bcrypt.hash(Math.random().toString(36), 10);
            const newUser = await db.execute({
                sql: 'INSERT INTO users (email, password_hash, name, phone, age, job) VALUES (?, ?, ?, ?, ?, ?) RETURNING id',
                args: [String(email || ''), tempPassword, String(name || ''), String(phone || ''), String(age || ''), String(job || '')],
            });
            userId = Number(newUser.rows[0].id);
            console.log('[Step 5b] Created userId:', userId);
        }

        // 중복 신청 확인
        console.log('[Step 6] Checking for duplicate application');
        const existingApplication = await db.execute({
            sql: 'SELECT id FROM applications WHERE user_id = ? AND course_id = ?',
            args: [userId, courseId],
        });

        if (existingApplication.rows.length > 0) {
            return res.status(400).json({ error: '이미 해당 과정에 신청하셨습니다' });
        }

        // 바우처 처리
        let voucherId = null;
        let paymentStatus = 'pending';

        if (payment_method === 'voucher' && voucher_code) {
            console.log('[Step 7] Processing voucher:', voucher_code);
            const voucherResult = await db.execute({
                sql: "SELECT id, course_id, expires_at FROM vouchers WHERE code = ? AND status = 'active'",
                args: [String(voucher_code).toUpperCase()],
            });

            if (voucherResult.rows.length === 0) {
                return res.status(400).json({ error: '유효하지 않은 바우처 코드입니다' });
            }

            const voucher = voucherResult.rows[0];
            const voucherCourseId = voucher.course_id ? Number(voucher.course_id) : null;
            console.log('[Step 8] Voucher found:', { voucherId: voucher.id, voucherCourseId, expires_at: voucher.expires_at });

            // 강좌 검증 (바우처가 특정 강좌 전용인 경우)
            if (voucherCourseId && voucherCourseId !== courseId) {
                return res.status(400).json({ error: '이 강좌에 사용할 수 없는 바우처입니다' });
            }

            // 만료일 검증
            if (voucher.expires_at) {
                const expiresAt = new Date(voucher.expires_at);
                if (expiresAt < new Date()) {
                    return res.status(400).json({ error: '만료된 바우처 코드입니다' });
                }
            }

            voucherId = Number(voucher.id);
            paymentStatus = 'confirmed';

            // 바우처 사용 처리
            console.log('[Step 9] Marking voucher as used');
            await db.execute({
                sql: "UPDATE vouchers SET status = 'used', used_by = ?, used_at = CURRENT_TIMESTAMP WHERE id = ?",
                args: [userId, voucherId],
            });
        }

        // 신청 생성
        console.log('[Step 10] Creating application:', { userId, courseId, voucherId, payment_method, paymentStatus });
        const application = await db.execute({
            sql: `INSERT INTO applications (user_id, course_id, voucher_id, payment_method, payment_status) 
                  VALUES (?, ?, ?, ?, ?) RETURNING *`,
            args: [userId, courseId, voucherId, String(payment_method || 'transfer'), paymentStatus],
        });

        console.log('[Step 11] Application created successfully:', application.rows[0]);
        res.json({
            success: true,
            application: application.rows[0],
            message: payment_method === 'voucher' ? '무료 수강 신청이 완료되었습니다!' : '신청이 완료되었습니다. 입금 확인 후 안내해드립니다.',
        });
    } catch (error) {
        console.error('Create application error:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({ error: '신청 처리 중 오류가 발생했습니다: ' + error.message });
    }
});

// 신청 상태 변경 (관리자)
router.patch('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { payment_status } = req.body;

        await db.execute({
            sql: 'UPDATE applications SET payment_status = ? WHERE id = ?',
            args: [payment_status, Number(id)],
        });

        res.json({ message: '신청 상태가 변경되었습니다' });
    } catch (error) {
        console.error('Update application error:', error);
        res.status(500).json({ error: '신청 상태 변경 중 오류가 발생했습니다' });
    }
});

// 신청 삭제 (관리자)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // 먼저 신청 정보를 가져와서 바우처가 사용되었는지 확인
        const appResult = await db.execute({
            sql: 'SELECT voucher_id FROM applications WHERE id = ?',
            args: [Number(id)],
        });

        if (appResult.rows.length === 0) {
            return res.status(404).json({ error: '신청을 찾을 수 없습니다' });
        }

        const application = appResult.rows[0];

        // 바우처가 사용되었다면 다시 활성화
        if (application.voucher_id) {
            await db.execute({
                sql: "UPDATE vouchers SET status = 'active', used_by = NULL, used_at = NULL WHERE id = ?",
                args: [Number(application.voucher_id)],
            });
        }

        // 신청 삭제
        await db.execute({
            sql: 'DELETE FROM applications WHERE id = ?',
            args: [Number(id)],
        });

        res.json({ message: '신청이 삭제되었습니다' });
    } catch (error) {
        console.error('Delete application error:', error);
        res.status(500).json({ error: '신청 삭제 중 오류가 발생했습니다' });
    }
});

// 회원 목록 (관리자)
router.get('/members', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await db.execute({
            sql: `SELECT id, email, name, phone, age, job, role, created_at FROM users ORDER BY created_at DESC`,
            args: [],
        });
        res.json(result.rows);
    } catch (error) {
        console.error('Get members error:', error);
        res.status(500).json({ error: '회원 목록 조회 중 오류가 발생했습니다' });
    }
});

export default router;
