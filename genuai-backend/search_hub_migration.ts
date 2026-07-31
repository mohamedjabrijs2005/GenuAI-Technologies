import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  try {
    console.log("Creating tables for Search Hub...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS network_posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        image_url TEXT,
        likes_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        organization VARCHAR(255) NOT NULL,
        prize VARCHAR(255),
        deadline VARCHAR(255),
        match_score INTEGER,
        tags JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS pm_applications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'submitted',
        assessment_score INTEGER,
        portfolio_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        tag VARCHAR(100),
        title VARCHAR(255) NOT NULL,
        source VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("Tables created successfully.");

    // Seeding mock data
    console.log("Seeding mock data for events...");
    const eventsCheck = await pool.query(`SELECT COUNT(*) FROM events`);
    if (parseInt(eventsCheck.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO events (title, organization, prize, deadline, match_score, tags) VALUES
        ('GenuAI Global FinTech Hack', 'GenuAI & Partner Banks', '$50,000', 'Ends in 12 days', 94, '["React", "Solidity", "AWS"]'),
        ('SaaS Innovation Challenge 2026', 'TechNova', '$15,000 + Internships', 'Ends in 4 days', 88, '["Next.js", "PostgreSQL", "AI"]')
      `);
    }

    console.log("Seeding mock data for news...");
    const newsCheck = await pool.query(`SELECT COUNT(*) FROM news`);
    if (parseInt(newsCheck.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO news (tag, title, source) VALUES
        ('AI Trends', 'OpenAI Announces New Advanced Reasoning Models', 'TechCrunch'),
        ('Hiring', 'Top 10 Tech Companies Actively Hiring Remote Product Managers', 'Forbes'),
        ('Startups', 'GenuAI Technologies Secures Funding to Revolutionize AI Recruitment', 'Tech Radar'),
        ('Development', 'React 19 Release: What Frontend Engineers Need to Know', 'Dev.to')
      `);
    }

    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    pool.end();
  }
}

migrate();
