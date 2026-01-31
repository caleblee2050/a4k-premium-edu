import express from 'express';
import db from '../db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// 과정 목록 조회 (공개)
router.get('/', async (req, res) => {
    try {
        const result = await db.execute({
            sql: 'SELECT * FROM courses WHERE is_active = 1 ORDER BY id',
            args: [],
        });
        res.json(result.rows);
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({ error: '과정 목록 조회 중 오류가 발생했습니다' });
    }
});

// 과정 상세 + 커리큘럼 (공개)
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        const courseResult = await db.execute({
            sql: 'SELECT * FROM courses WHERE slug = ?',
            args: [slug],
        });

        if (courseResult.rows.length === 0) {
            return res.status(404).json({ error: '과정을 찾을 수 없습니다' });
        }

        const course = courseResult.rows[0];

        const curriculumResult = await db.execute({
            sql: 'SELECT * FROM curriculum_items WHERE course_id = ? ORDER BY phase, sort_order',
            args: [course.id],
        });

        res.json({
            ...course,
            curriculum: curriculumResult.rows,
        });
    } catch (error) {
        console.error('Get course error:', error);
        res.status(500).json({ error: '과정 조회 중 오류가 발생했습니다' });
    }
});

// 과정 생성 (관리자)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { slug, title, subtitle, description, price, icon, featured } = req.body;

        const result = await db.execute({
            sql: `INSERT INTO courses (slug, title, subtitle, description, price, icon, featured) 
                  VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`,
            args: [slug, title, subtitle, description, price || 0, icon || 'book', featured ? 1 : 0],
        });

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({ error: '과정 생성 중 오류가 발생했습니다' });
    }
});

// 과정 수정 (관리자)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subtitle, description, price, icon, featured, is_active } = req.body;

        await db.execute({
            sql: `UPDATE courses SET title = ?, subtitle = ?, description = ?, price = ?, 
                  icon = ?, featured = ?, is_active = ? WHERE id = ?`,
            args: [title, subtitle, description, price, icon, featured ? 1 : 0, is_active ? 1 : 0, id],
        });

        res.json({ message: '과정이 수정되었습니다' });
    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({ error: '과정 수정 중 오류가 발생했습니다' });
    }
});

// 커리큘럼 항목 추가 (관리자)
router.post('/:id/curriculum', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { phase, title, description, content_type, content_url, sort_order } = req.body;

        const result = await db.execute({
            sql: `INSERT INTO curriculum_items (course_id, phase, title, description, content_type, content_url, sort_order) 
                  VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`,
            args: [id, phase, title, description, content_type || 'text', content_url, sort_order || 0],
        });

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Add curriculum item error:', error);
        res.status(500).json({ error: '커리큘럼 추가 중 오류가 발생했습니다' });
    }
});

// 커리큘럼 항목 삭제 (관리자)
router.delete('/curriculum/:itemId', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { itemId } = req.params;

        await db.execute({
            sql: 'DELETE FROM curriculum_items WHERE id = ?',
            args: [itemId],
        });

        res.json({ message: '커리큘럼 항목이 삭제되었습니다' });
    } catch (error) {
        console.error('Delete curriculum item error:', error);
        res.status(500).json({ error: '커리큘럼 삭제 중 오류가 발생했습니다' });
    }
});

export default router;
