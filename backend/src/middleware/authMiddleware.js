const jwt = require('jsonwebtoken');
const { createClerkClient, verifyToken } = require('@clerk/backend');
const env = require('../config/env');
const userModel = require('../models/userModel');

const clerkClient = createClerkClient({
  secretKey: env.clerkSecretKey || '',
  apiUrl: env.clerkApiUrl
});

async function buildUserFromClerkToken(token) {
  if (!env.clerkSecretKey && !env.clerkJwksPublicKey) return null;

  const verifyOptions = {
    audience: [env.frontendOrigin]
  };

  if (env.clerkSecretKey) {
    verifyOptions.secretKey = env.clerkSecretKey;
  }

  if (env.clerkJwksPublicKey) {
    verifyOptions.jwtKey = env.clerkJwksPublicKey;
  }

  const payload = await verifyToken(token, verifyOptions);
  const clerkId = payload.sub;
  if (!clerkId) return null;

  const clerkUser = await clerkClient.users.getUser(clerkId);
  const primaryEmail =
    clerkUser.emailAddresses.find((email) => email.id === clerkUser.primaryEmailAddressId)?.emailAddress ||
    clerkUser.emailAddresses[0]?.emailAddress ||
    `${clerkId}@clerk.local`;
  const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.username || 'User';

  const localUser = await userModel.upsertClerkUser({
    clerkId,
    email: primaryEmail,
    name
  });

  const role = env.adminEmails.includes(String(primaryEmail).toLowerCase()) ? 'admin' : 'user';
  return {
    id: localUser.id,
    clerkId,
    email: primaryEmail,
    role
  };
}

async function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const clerkUser = await buildUserFromClerkToken(token);
    if (clerkUser) {
      req.user = clerkUser;
      return next();
    }
  } catch (error) {
    // Fallback to local JWT auth if Clerk verification fails.
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'user'
    };
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function adminRequired(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  return next();
}

module.exports = {
  authRequired,
  adminRequired
};
