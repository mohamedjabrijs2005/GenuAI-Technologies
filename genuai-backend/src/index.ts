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
import { initSocket } from './socket';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for Render/Vercel (required for correct HTTPS detection in OAuth)
app.set('trust proxy', 1);

app.use(cors({ origin: true, methods: ['GET','POST','PUT','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'], credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/assessment', assessmentRoutes);
app.use('/upload', uploadRoutes);
app.use('/email', emailRoutes);
app.use('/admin', adminRoutes);
app.use('/company', companyRoutes);
app.use('/company-roles', companyRolesRoutes);
app.use('/roles', rolesRoutes);
app.use('/subscriptions', subscriptionsRoutes);
app.use('/candidate', candidateRoutes);
app.use('/candidate/interests', candidateInterestsRoutes);
app.use('/genuai-works', genuaiWorksRoutes);
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
