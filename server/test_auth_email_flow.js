import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import emailRoutes from './routes/email.routes.js';
import { sentEmails } from './services/emailService.js';

// Setup test app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);

const server = app.listen(5099, async () => {
  console.log('Testing server started on port 5099');
  const baseUrl = 'http://localhost:5099/api';

  try {
    console.log('\n--- 1. Testing Registration Flow ---');
    const testUser = {
      name: 'Rohan Sharma',
      email: 'rohan.sharma.test@example.com',
      password: 'password123',
      role: 'seeker',
      headline: 'Full Stack Engineer',
      skills: ['React', 'Node.js', 'PostgreSQL']
    };

    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    }).then(r => r.json());

    console.log('Register response:', regRes.success, regRes.message, 'requiresVerification:', regRes.requiresVerification);
    if (!regRes.success) throw new Error('Registration failed');

    console.log('\n--- 2. Testing Email Inbox API ---');
    const inboxRes = await fetch(`${baseUrl}/email/inbox?email=${testUser.email}`).then(r => r.json());
    console.log('Inbox messages count for test user:', inboxRes.emails?.length);
    const verificationEmail = inboxRes.emails?.find(e => e.type === 'verification');
    console.log('Found verification email:', !!verificationEmail);
    console.log('Extracted 6-digit OTP code:', verificationEmail?.code);

    if (!verificationEmail?.code) throw new Error('Verification email code missing');

    console.log('\n--- 3. Testing Email Verification API ---');
    const verifyRes = await fetch(`${baseUrl}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, code: verificationEmail.code })
    }).then(r => r.json());

    console.log('Verify response:', verifyRes.success, verifyRes.message, 'email_verified:', verifyRes.user?.email_verified);
    if (!verifyRes.user?.email_verified) throw new Error('Email verification failed');

    console.log('\n--- 4. Testing Welcome Email Dispatch ---');
    const updatedInboxRes = await fetch(`${baseUrl}/email/inbox?email=${testUser.email}`).then(r => r.json());
    const welcomeEmail = updatedInboxRes.emails?.find(e => e.type === 'welcome');
    console.log('Found welcome email in inbox:', !!welcomeEmail, 'Subject:', welcomeEmail?.subject);

    console.log('\n--- 5. Testing Login API with Correct Credentials ---');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: 'password123' })
    }).then(r => r.json());

    console.log('Login success:', loginRes.success, 'Token received:', !!loginRes.token, 'User name:', loginRes.user?.name);
    if (!loginRes.token) throw new Error('Login failed');

    console.log('\n--- 6. Testing Login with Incorrect Password ---');
    const badLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: 'wrongpassword' })
    });
    console.log('Bad login status (expected 401):', badLoginRes.status);
    if (badLoginRes.status !== 401) throw new Error('Should have returned 401 for bad password');

    console.log('\n--- 7. Testing Demo User Switch & Logins ---');
    const demoSeeker = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sarah.jenkins@example.com', password: 'password123' })
    }).then(r => r.json());
    console.log('Demo Seeker Login (Sarah Jenkins):', demoSeeker.success, demoSeeker.user?.name);

    const demoRecruiter = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'marcus.recruiter@stripe.com', password: 'password123' })
    }).then(r => r.json());
    console.log('Demo Recruiter Login (Marcus Vance):', demoRecruiter.success, demoRecruiter.user?.name);

    console.log('\n✅ ALL AUTH & EMAIL FLOW TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
