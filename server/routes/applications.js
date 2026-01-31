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

        // 과정 찾기
        const courseResult = await db.execute({
            sql: 'SELECT id FROM courses WHERE slug = ?',
            args: [course_slug],
        });

        if (courseResult.rows.length === 0) {
            return res.status(400).json({ error: '유효하지 않은 과정입니다' });
        }

        const courseId = courseResult.rows[0].id;

        // 사용자 생성 또는 찾기
        let userId;
        const userResult = await db.execute({
            sql: 'SELECT id FROM users WHERE email = ?',
            args: [email],
        });

        if (userResult.rows.length > 0) {
            userId = userResult.rows[0].id;
        } else {
            const tempPassword = await bcrypt.hash(Math.random().toString(36), 10);
            const newUser = await db.execute({
                sql: 'INSERT INTO users (email, password_hash, name, phone, age, job) VALUES (?, ?, ?, ?, ?, ?) RETURNING id',
                args: [email, tempPassword, name, phone, age, job],
            });
            userId = newUser.rows[0].id;
        }

        // 바우처 처리
        let voucherId = null;
        let paymentStatus = 'pending';

        if (payment_method === 'voucher' && voucher_code) {
            const voucherResult = await db.execute({
                sql: "SELECT id FROM vouchers WHERE code = ? AND status = 'active'",
                args: [voucher_code.toUpperCase()],
            });

            if (voucherResult.rows.length === 0) {
                return res.status(400).json({ error: '유효하지 않은 바우처 코드입니다' });
            }

            voucherId = voucherResult.rows[0].id;
            paymentStatus = 'confirmed';

            // 바우처 사용 처리
            await db.execute({
                sql: "UPDATE vouchers SET status = 'used', used_by = ?, used_at = CURRENT_TIMESTAMP WHERE id = ?",
                args: [userId, voucherId],
            });
        }

        // 신청 생성
        const application = await db.execute({
            sql: `INSERT INTO applications (user_id, course_id, voucher_id, payment_method, payment_status) 
                  VALUES (?, ?, ?, ?, ?) RETURNING *`,
            args: [userId, courseId, voucherId, payment_method, paymentStatus],
        });

        res.json({
            success: true,
            application: application.rows[0],
            message: payment_method === 'voucher' ? '무료 수강 신청이 완료되었습니다!' : '신청이 완료되었습니다. 입금 확인 후 안내해드립니다.',
        });
    } catch (error) {
        console.error('Create application error:', error);
        res.status(500).json({ error: '신청 처리 중 오류가 발생했습니다' });
    }
});

// 신청 상태 변경 (관리자)
router.patch('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { payment_status } = req.body;

        await db.execute({
            sql: 'UPDATE applications SET payment_status = ? WHERE id = ?',
            args: [payment_status, id],
        });

        res.json({ message: '신청 상태가 변경되었습니다' });
    } catch (error) {
        console.error('Update application error:', error);
        res.status(500).json({ error: '신청 상태 변경 중 오류가 발생했습니다' });
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
