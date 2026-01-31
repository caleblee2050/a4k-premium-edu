import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 로그인
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await db.execute({
            sql: 'SELECT * FROM users WHERE email = ?',
            args: [email],
        });

        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다' });
        }

        // 초기 관리자는 plain text 비밀번호 허용 (첫 로그인 시 해시 업데이트)
        let isValid = false;
        if (user.password_hash.startsWith('$2')) {
            isValid = await bcrypt.compare(password, user.password_hash);
        } else {
            // Plain text password (초기 설정용)
            isValid = password === user.password_hash;
            if (isValid) {
                // 해시로 업데이트
                const hash = await bcrypt.hash(password, 10);
                await db.execute({
                    sql: 'UPDATE users SET password_hash = ? WHERE id = ?',
                    args: [hash, user.id],
                });
            }
        }

        if (!isValid) {
            return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: '로그인 처리 중 오류가 발생했습니다' });
    }
});

// 현재 사용자 정보
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const result = await db.execute({
            sql: 'SELECT id, email, name, role FROM users WHERE id = ?',
            args: [req.user.id],
        });

        if (result.rows.length === 0) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: '사용자 정보 조회 중 오류가 발생했습니다' });
    }
});

// 관리자 생성 (초기 설정용)
router.post('/setup', async (req, res) => {
    try {
        // 이미 관리자가 있는지 확인
        const existing = await db.execute({
            sql: "SELECT COUNT(*) as count FROM users WHERE role = 'admin'",
            args: [],
        });

        if (existing.rows[0].count > 0) {
            return res.status(400).json({ error: '이미 관리자가 존재합니다' });
        }

        const { email, password, name } = req.body;
        const hash = await bcrypt.hash(password, 10);

        await db.execute({
            sql: "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'admin')",
            args: [email, hash, name],
        });

        res.json({ message: '관리자 계정이 생성되었습니다' });
    } catch (error) {
        console.error('Setup error:', error);
        res.status(500).json({ error: '관리자 생성 중 오류가 발생했습니다' });
    }
});

export default router;
