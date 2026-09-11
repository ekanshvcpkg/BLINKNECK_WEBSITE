const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/* ── API: Create Escrow Blink ───────────────────────────────── */
app.post('/api/escrow/create', (req, res) => {
  const { amount, recipient, timelock, condition, note } = req.body;

  // Validation
  if (!amount || !recipient) {
    return res.status(400).json({ error: 'amount and recipient are required' });
  }

  // Generate a mock Blink ID (in production this would be a real on-chain tx)
  const blinkId = crypto.randomBytes(8).toString('hex');
  const blinkUrl = `https://blink.blinkneck.io/e/${blinkId}`;

  const escrow = {
    id: blinkId,
    blinkUrl,
    amount: parseFloat(amount),
    recipient,
    timelock: timelock || '24h',
    condition: condition || 'hash',
    note: note || '',
    status: 'PENDING',
    network: 'solana-mainnet',
    fee: '< $0.001',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  console.log('[BLINKNECK] New escrow created:', escrow.id, `| ${amount} SOL → ${recipient}`);
  res.json(escrow);
});

/* ── API: Protocol Stats ────────────────────────────────────── */
app.get('/api/stats', (req, res) => {
  res.json({
    escrowsSettled: 147392,
    volumeProcessed: '2.4M',
    disputeFreeRate: '99.97%',
    avgSettleTime: '0.43s',
    supportedWallets: ['Phantom', 'Solflare', 'Backpack'],
    network: 'Solana Mainnet',
  });
});

/* ── API: Verify Blink ──────────────────────────────────────── */
app.get('/api/escrow/verify/:id', (req, res) => {
  const { id } = req.params;
  // Mock verification — in production queries the Solana program
  res.json({
    id,
    status: 'PENDING',
    verified: true,
    network: 'solana-mainnet',
    blinkUrl: `https://blink.blinkneck.io/e/${id}`,
    metadata: {
      protocol: 'BLINKNECK',
      version: '1.0.0',
      audited: true,
    },
  });
});

/* ── API: Why / Feature Data ────────────────────────────────── */
app.get('/api/features', (req, res) => {
  res.json([
    {
      id: 'in-feed',
      title: 'In-Feed Execution',
      headline: 'No External Sites',
      desc: 'Turn escrow into a shareable link. Users interact, sign, and pay inside their social media feed.',
      badge: 'ZERO REDIRECTS',
    },
    {
      id: 'no-middlemen',
      title: 'Zero Human Middlemen',
      headline: 'Smart Contract Only',
      desc: 'No biased admins, no manual payout delays. The code is the arbiter — immutable, impartial, instant.',
      badge: 'TRUSTLESS',
    },
    {
      id: 'low-fees',
      title: 'Near-Zero Fees',
      headline: '< $0.001 Per Transaction',
      desc: 'Solana ensures settlement in under a second for fractions of a cent.',
      badge: 'LIGHTNING FAST',
    },
  ]);
});

/* ── API: Security Features ─────────────────────────────────── */
app.get('/api/security', (req, res) => {
  res.json([
    {
      id: 'timelock',
      title: 'Programmable Timelocks',
      desc: 'Funds auto-return to buyer if terms aren\'t met within the agreed window.',
      pill: 'AUTO-REFUND ON EXPIRY',
    },
    {
      id: 'multisig',
      title: 'Multi-Sig & Condition Release',
      desc: 'Sellers only receive funds when predefined on-chain proof of delivery is validated.',
      pill: 'PROOF-GATED RELEASE',
    },
    {
      id: 'metadata',
      title: 'Verified Blink Metadata',
      desc: 'Every BLINKNECK link displays verified transaction parameters directly in wallet preview before signing.',
      pill: 'WALLET-LEVEL VERIFICATION',
    },
  ]);
});

/* ── SPA Fallback ───────────────────────────────────────────── */
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`BLINKNECK server running on http://localhost:${PORT}`);
});

module.exports = app;
