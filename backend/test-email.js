// backend/test-email.js — run with: node test-email.js
import 'dotenv/config';
import { sendAlertEmail, sendOrderConfirmation } from './services/emailService.js';

sendAlertEmail({ to: 'code.enginedoc.v8@gmail.com', symbol: 'BTC', type: 'target', target: 200, current: 205 })
    .then(() => console.log('Email sent — check your inbox'))
    .catch(err => console.error('Failed:', err.message))
sendOrderConfirmation({
    to: 'code.enginedoc.v8@gmail.com', order: {
        type: 'buy',
        symbol: 'AAPL',
        quantity: 10,
        priceAtOrder: 150,
        closedPrice: 155
    }
})
    .then(() => console.log(`Email sent — check your inbox`))
    .catch(err => console.error('Failed:', err.message))