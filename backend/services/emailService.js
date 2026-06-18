import 'dotenv/config';
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
});

// market alert email
export async function sendAlertEmail({ to, symbol, type, target, current }) {
    const isTarget = type === 'target';
    const message = isTarget ? `${target} has reached your target price` : `${target} has dropped to your stop-loss level`;

    try {
        await transporter.sendMail({
            from: `"IndiQuant Alerts" <${process.env.EMAIL_USER}>`,
            to,
            subject: `${symbol} Price alert!!`,
            html: `
            <div style="font-family:sans-serif; max-width:480px; margin:auto">
                <h2 style="color:#cca649">IndiQuant</h2>
                <p>
                    <strong>${symbol}</strong> — ${message}
                </p>
                <table style="width:100%; border-collapse:collapse; font-size:14px">
                    <tr>
                        <td style="padding:8px; border:1px solid #eee; color:#666">Alert type</td>
                        <td style="padding:8px; border:1px solid #eee; font-weight:500 color:${isTarget ? '#1D9E75' : '#E24B4A'}">
                            ${isTarget ? 'Target Hit' : 'Stop-loss Hit'}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:8px; border:1px solid #eee; color:#666">Your target</td>
                        <td style="padding:8px; border:1px solid #eee">$${Number(target).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px; border:1px solid #eee; color:#666">Current price</td>
                        <td style="padding:8px; border:1px solid #eee; font-weight:500; color:${isTarget ? '#1D9E75' : '#E24B4A'}">
                            $${Number(current).toFixed(2)}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:8px; border:1px solid #eee; color:#666">Triggered At</td>
                        <td style="padding:8px; border:1px solid #eee; color:#666">
                            ${new Date(order.closedAt).toLocaleString() === undefined ? 'N/A' : new Date(order.closedAt).toLocaleString()}
                        </td>
                    </tr>
                </table>
                <p style="color:#888; font-size:12px; margin-top:20px">
                    This is not financial advice. Log in to <a href="${process.env.CLIENT_URL}/dashboard/alerts">IndiQuant</a> to manage your alerts.
                </p>
            </div>
        `
        });
    } catch (error) {
        console.error('Alert email failed.', error);
    }
};

// order confirmation email
export async function sendOrderConfirmation({ to, order }) {
    if (order.closedPrice == null)
        throw new Error('Order has no closing price');

    const pl = order.type === 'buy' ? (Number(order.closedPrice) - Number(order.priceAtOrder)) * Number(order.quantity) : (Number(order.priceAtOrder) - Number(order.closedPrice)) * Number(order.quantity);

    const isProfit = pl >= 0;

    try {
        await transporter.sendMail({
            from: `"IndiQuant" <${process.env.EMAIL_USER}>`,
            to,
            subject: `${order.symbol} Order closed`,
            html: `
            <div style="font-family:sans-serif; max-width:480px; margin:auto">
                <h2 style="color:#cca649">IndiQuant</h2>
                <p>
                    Your <strong style="color: ${order.type === 'buy' ? '#1D9E75' : '#E24B4A'}">${order.type.toUpperCase()}</strong> order for <strong>${order.symbol}</strong> has been closed.
                </p>
                <table style="width:100%;border-collapse:collapse;font-size:14px">
                    <tr>
                        <td style="padding:8px; border:1px solid #eee; color:#666">Quantity</td><td style="padding:8px;border:1px solid #eee">
                            ${order.quantity}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:8px; border:1px solid #eee; color:#666">Entry price</td><td style="padding:8px;border:1px solid #eee">
                            $${Number(order.priceAtOrder).toFixed(2)}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:8px; border:1px solid #eee; color:#666">Exit price</td><td style="padding:8px;border:1px solid #eee">
                            $${Number(order.closedPrice).toFixed(2)}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:8px; border:1px solid #eee; color:#666">P&L</td>
                        <td style="padding:8px; border:1px solid #eee; font-weight:500; color:${isProfit ? '#1D9E75' : '#E24B4A'}">
                            ${isProfit ? '+' : ''}$${pl.toFixed(2)}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:8px; border:1px solid #eee; color:#666">Closed At</td>
                        <td style="padding:8px; border:1px solid #eee; color:#666">
                            ${order.closedAt ? new Date(order.closedAt).toLocaleString() : 'N/A'}
                        </td>
                    </tr>
                </table>
                <p style="color:#888; font-size:12px; margin-top:20px">This is a simulated order. Log in to <a href="${process.env.CLIENT_URL}/dashboard/orders">IndiQuant</a> to manage your orders.</p>
            </div>
        `
        });
    } catch (error) {
        console.error('Order confirmation email failed.', error);
    }
}