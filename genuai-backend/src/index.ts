import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import passport from 'passport';
import { authRoutes } from './modules/auth';
import { adminRoutes } from './modules/admin';
import { jobRoutes } from './modules/jobs';
import { emailRoutes } from './modules/notifications';
import { integrityRoutes, riskRoutes } from './modules/integrity';
import assessmentRoutes from './routes/assessment';
import uploadRoutes from './routes/upload';
import skillRoutes from './routes/skill';
import coachRoutes from './routes/coach';
import historyRoutes from './routes/history';
import eventsRoutes from './routes/events';
import pmRoutes from './routes/pm';
import networkRoutes from './routes/network';
import newsRoutes from './routes/news';
import aiRoutes from './routes/ai';
import companyRoutes from './routes/company';
import candidateRoutes from './routes/candidate';
import genuaiWorksRoutes from './routes/genuaiWorks';
import candidateInterestsRoutes from './routes/candidateInterests';
import companyRolesRoutes from './routes/companyRoles';
import rolesRoutes from './routes/roles';
import subscriptionsRoutes from './routes/subscriptions';
import pool from './db';
import { initSocket } from './socket';
import { authenticateToken, requireRole } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for Render/Vercel (required for correct HTTPS detection in OAuth)
app.set('trust proxy', 1);

app.use(cors({ origin: true, methods: ['GET','POST','PUT','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'], credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/candidate', authenticateToken, candidateRoutes);
app.use('/candidate/interests', authenticateToken, candidateInterestsRoutes);
app.use('/company', authenticateToken, requireRole('company', 'admin'), companyRoutes);
app.use('/admin', authenticateToken, requireRole('admin'), adminRoutes);
app.use('/company-roles', authenticateToken, requireRole('company', 'admin'), companyRolesRoutes);
app.use('/integrity', authenticateToken, integrityRoutes);
app.use('/integrity/risk', authenticateToken, riskRoutes);
app.use('/ai', authenticateToken, aiRoutes); // stops the open Groq-quota-burning proxy

// Direct top-level module library route (Fix 3)
app.get('/modules', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, canonical_name, category, description, is_composite, status
       FROM assessment_modules
       WHERE status = 'active' OR status IS NULL
       ORDER BY id ASC`
    );
    res.json({ modules: result.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Direct top-level candidate match groups route (Fix 3)
app.get('/match/groups/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;
    const groupsRes = await pool.query(
      `SELECT cgm.id as membership_id, cgm.candidate_id, cgm.group_id, cgm.dynamic_path_id, cgm.created_at,
              cag.canonical_role_id, cag.configuration_version_id, cag.assessment_pattern_hash, cag.pattern_description,
              rt.canonical_name as canonical_role_name
       FROM candidate_group_memberships cgm
       JOIN candidate_assessment_groups cag ON cgm.group_id = cag.id
       LEFT JOIN role_taxonomy rt ON cag.canonical_role_id = rt.id
       WHERE cgm.candidate_id = $1
       ORDER BY cgm.created_at DESC`,
      [candidateId]
    );
    res.json({ groups: groupsRes.rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
app.use('/skill', skillRoutes);
app.use('/jobs', jobRoutes);
app.use('/coach', coachRoutes);
app.use('/history', historyRoutes);
app.use('/events', eventsRoutes);
app.use('/pm', pmRoutes);
app.use('/network', networkRoutes);
app.use('/news', newsRoutes);
app.use('/ai', aiRoutes);
app.use('/integrity', integrityRoutes);
app.use('/integrity/risk', riskRoutes);

app.get('/', (_req, res) => res.json({ name: 'GenuAI Technologies API Server', status: 'ok', health: '/health', version: '1.0.0' }));
app.get('/health', (_req, res) => res.json({ status: 'ok', time: new Date() }));

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log("GenuAI server running on port " + PORT + " (API + Socket.io)");
});

export default app;
