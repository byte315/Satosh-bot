// SATOSH NAKAMOTO - SAMPLE BOT - UGX 5000 access
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const P = require('pino')

// === CONFIG - EDIT HERE ===
const ADMIN_NUMBER = '2567XXXXXXXXX@s.whatsapp.net' // Put your Airtel number e.g 256752123456
const MERCHANT_ID = '1234567' // Sample merchant ID
const PRIVATE_WEBSITE = 'https://your-private-site.com/access' // Sample link
// ===========================

const sessions = {}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const sock = makeWASocket({ auth: state, logger: P({ level: 'silent' }), printQRInTerminal: true })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', (update) => {
    if (update.connection === 'open') console.log('✅ SATOSH BOT IS LIVE - MTN CONNECTED')
    if (update.connection === 'close') startBot()
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const jid = msg.key.remoteJid
    const rawText = msg.message.conversation || msg.message.extendedTextMessage?.text || ""
    const text = rawText.trim().toLowerCase()

    // When user says PAID
    if (rawText.toUpperCase().startsWith('PAID')) {
      await sock.sendMessage(jid, {
        text: `✅ Payment received: ${rawText}\n\nVerifying UGX 5,000...\n\nYour private link will be sent in 10-30 mins after confirmation.\n\nSAMPLE LINK (for testing):\n${PRIVATE_WEBSITE}\n\nKeep your MoMo SMS.\nType SUPPORT if delay.`
      })
      await sock.sendMessage(ADMIN_NUMBER, { text: `💰 NEW SATOSH PAYMENT\nFrom: ${jid}\nDetails: ${rawText}` })
      return
    }

    if (text === '2' || text === 'cancel') {
      sessions[jid] = 0
      await sock.sendMessage(jid, { text: 'Session closed. Type hi to start again.' })
      return
    }

    let step = sessions[jid] || 0

    if (['hi','hello','jambo','hey'].includes(text) || step === 0) {
      sessions[jid] = 1
      await sock.sendMessage(jid, { text: '👽 Welcome to SATOSH NAKAMOTO private community.\n\nPress 1 to continue\nPress 2 to cancel' })
      return
    }

    if (step === 1 && text === '1') {
      sessions[jid] = 2
      await sock.sendMessage(jid, { text: 'SATOSH NAKAMOTO is a private access service for Uganda.\nYou pay UGX 5,000 once to get active private link.\nLink contains curated mystery stories, history research & daily updates.\n\nPress 1 to continue' })
      return
    }

    if (step === 2 && text === '1') {
      sessions[jid] = 3
      await sock.sendMessage(jid, { text: `PAYMENT INSTRUCTIONS (SAMPLE):\n\nUGX 5,000 via Merchant Pay\n\nAirtel: *185*9#\nMTN: *165*3#\nMerchant ID: ${MERCHANT_ID}\n\nAfter paying type: PAID 07xxxxxxx\n\nPress 1 for benefits\nPress 2 for support` })
      return
    }

    if (step === 3 && text === '1') {
      sessions[jid] = 4
      await sock.sendMessage(jid, { text: 'BENEFITS:\n- Daily mystery & research stories\n- Private library\n- Scam awareness guides\nFor education & entertainment only.\n\nPress 1 for disclaimer\nPress 2 to pay' })
      return
    }

    if (step === 4 && text === '1') {
      sessions[jid] = 5
      await sock.sendMessage(jid, { text: 'DISCLAIMER:\n1. Education/entertainment only\n2. Not financial advice\n3. No guarantee of jobs/income\n4. Keep MoMo SMS\n\nPress 1 to see payment again\nPress 2 to cancel
