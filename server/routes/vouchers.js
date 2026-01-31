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

// 바우처 생성 (관리자)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { code, course_id } = req.body;

        // 중복 확인
        const existing = await db.execute({
            sql: 'SELECT id FROM vouchers WHERE code = ?',
            args: [code.toUpperCase()],
        });

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: '이미 존재하는 코드입니다' });
        }

        const result = await db.execute({
            sql: 'INSERT INTO vouchers (code, course_id) VALUES (?, ?) RETURNING *',
            args: [code.toUpperCase(), course_id || null],
        });

        res.json(result.rows[0]);
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
            sql: "SELECT * FROM vouchers WHERE code = ? AND status = 'active'",
            args: [code.toUpperCase()],
        });

        if (result.rows.length === 0) {
            return res.status(400).json({ valid: false, error: '유효하지 않은 바우처 코드입니다' });
        }

        res.json({ valid: true, voucher: result.rows[0] });
    } catch (error) {
        console.error('Validate voucher error:', error);
        res.status(500).json({ error: '바우처 검증 중 오류가 발생했습니다' });
    }
});

export default router;
