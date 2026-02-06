import express from 'express';
import db from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// 바우처 목록 조회 (관리자)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await db.execute({
            sql: `SELECT v.*, u.name as used_by_name, c.title as course_title 
                  FROM vouchers v 
                  LEFT JOIN users u ON v.used_by = u.id 
                  LEFT JOIN courses c ON v.course_id = c.id 
                  ORDER BY v.created_at DESC`,
            args: [],
        });
        res.json(result.rows);
    } catch (error) {
        console.error('Get vouchers error:', error);
        res.status(500).json({ error: '바우처 목록 조회 중 오류가 발생했습니다' });
    }
});

// 바우처 생성 (관리자) - 대량 생성 지원
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { course_id, count = 1 } = req.body;

        if (!course_id) {
            return res.status(400).json({ error: '과정을 선택해야 합니다' });
        }

        const courseResult = await db.execute({
            sql: 'SELECT slug, title FROM courses WHERE id = ?',
            args: [course_id],
        });

        if (courseResult.rows.length === 0) {
            return res.status(400).json({ error: '유효하지 않은 과정입니다' });
        }

        const course = courseResult.rows[0];

        // 접두어 생성 (예: GCE1, VIBE 등)
        let prefix = 'A4K';
        if (course.slug.includes('gce-l1')) prefix = 'GCE1';
        else if (course.slug.includes('gce-l2')) prefix = 'GCE2';
        else if (course.slug.includes('vibe')) prefix = 'VIBE';

        const vouchers = [];
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 헷갈리는 문자 제외

        // 30일 후 만료
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        for (let i = 0; i < count; i++) {
            let code = `${prefix}-`;
            for (let j = 0; j < 8; j++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            // Generate formatted expiration string for DB (YYYY-MM-DD HH:MM:SS)
            const expiresAtStr = expiresAt.toISOString().replace('T', ' ').substring(0, 19);

            await db.execute({
                sql: 'INSERT INTO vouchers (code, course_id, expires_at) VALUES (?, ?, ?)',
                args: [code, course_id, expiresAtStr],
            });

            vouchers.push({ code, course_title: course.title, expires_at: expiresAt });
        }

        res.json({ message: `${count}개의 바우처가 생성되었습니다`, vouchers });
    } catch (error) {
        console.error('Create voucher error:', error);
        res.status(500).json({ error: '바우처 생성 중 오류가 발생했습니다' });
    }
});

// 바우처 상태 변경 (관리자)
router.patch('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await db.execute({
            sql: 'UPDATE vouchers SET status = ? WHERE id = ?',
            args: [status, id],
        });

        res.json({ message: '바우처 상태가 변경되었습니다' });
    } catch (error) {
        console.error('Update voucher error:', error);
        res.status(500).json({ error: '바우처 상태 변경 중 오류가 발생했습니다' });
    }
});

// 바우처 삭제 (관리자)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        await db.execute({
            sql: "UPDATE vouchers SET status = 'deleted' WHERE id = ?",
            args: [id],
        });

        res.json({ message: '바우처가 삭제되었습니다' });
    } catch (error) {
        console.error('Delete voucher error:', error);
        res.status(500).json({ error: '바우처 삭제 중 오류가 발생했습니다' });
    }
});

// 바우처 검증 (공개 API)
router.post('/validate', async (req, res) => {
    try {
        const { code } = req.body;

        const result = await db.execute({
            sql: "SELECT v.*, c.title as course_title FROM vouchers v LEFT JOIN courses c ON v.course_id = c.id WHERE v.code = ? AND v.status = 'active'",
            args: [code.toUpperCase()],
        });

        if (result.rows.length === 0) {
            return res.status(400).json({ valid: false, error: '유효하지 않은 바우처 코드입니다' });
        }

        const voucher = result.rows[0];

        // 만료일 체크
        if (voucher.expires_at) {
            const expiresAt = new Date(voucher.expires_at);
            if (expiresAt < new Date()) {
                return res.status(400).json({ valid: false, error: '만료된 바우처 코드입니다' });
            }
        }

        res.json({ valid: true, voucher });
    } catch (error) {
        console.error('Validate voucher error:', error);
        res.status(500).json({ error: '바우처 검증 중 오류가 발생했습니다' });
    }
});

export default router;
