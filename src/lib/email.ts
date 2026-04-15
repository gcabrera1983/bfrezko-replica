import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hola@agapestudio.com';

export async function sendOrderConfirmationEmail(order: any) {
  if (!resend) {
    console.log('[Email] RESEND_API_KEY no configurada. Email no enviado.');
    return;
  }

  const itemsHtml = order.items?.map((item: any) => {
    const name = item.name || item.product?.name || 'Producto';
    const qty = item.quantity || 1;
    const price = Number(item.price || 0).toFixed(2);
    return `<tr>
      <td style="padding:8px;border-bottom:1px solid #eee;">${name}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${qty}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">Q${price}</td>
    </tr>`;
  }).join('') || '';

  const total = Number(order.total || 0).toFixed(2);
  const shipping = Number(order.shippingCost || 0).toFixed(2);
  const grandTotal = (Number(order.total || 0) + Number(order.shippingCost || 0)).toFixed(2);

  try {
    await resend.emails.send({
      from: `Ágape Studio <${FROM_EMAIL}>`,
      to: order.customerEmail,
      subject: `✨ Confirmación de tu pedido #${order.id?.slice(-8).toUpperCase()}`,
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Confirmación de pedido</title>
</head>
<body style="margin:0;padding:0;background-color:#FDF9F3;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5d4c3;">
          <tr>
            <td style="background:#6B4423;padding:32px 24px;text-align:center;">
              <h1 style="color:#F6D3B3;margin:0;font-size:24px;font-family:Palatino,serif;letter-spacing:2px;">ÁGAPE STUDIO</h1>
              <p style="color:#F6D3B3CC;margin:8px 0 0;font-size:14px;">Ropa cristiana con propósito</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px;">
              <h2 style="color:#6B4423;margin:0 0 16px;font-size:20px;">¡Gracias por tu compra!</h2>
              <p style="color:#4a3b2a;line-height:1.6;margin:0 0 16px;">Hola <strong>${order.customerName}</strong>, hemos recibido tu pedido correctamente. En cuanto comencemos a prepararlo te mantendremos informado.</p>

              <div style="background:#FDF9F3;border-radius:6px;padding:16px;margin:24px 0;">
                <p style="margin:0 0 8px;color:#6B4423;font-size:14px;"><strong>Número de orden:</strong> #${order.id?.slice(-8).toUpperCase()}</p>
                <p style="margin:0;color:#6B4423;font-size:14px;"><strong>Total:</strong> Q${grandTotal}</p>
              </div>

              <h3 style="color:#6B4423;font-size:16px;margin:24px 0 12px;">Productos</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#4a3b2a;">
                <thead>
                  <tr style="background:#F6D3B333;">
                    <th align="left" style="padding:8px;">Producto</th>
                    <th align="center" style="padding:8px;">Cant.</th>
                    <th align="right" style="padding:8px;">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;font-size:14px;color:#4a3b2a;">
                <tr>
                  <td align="right" style="padding:4px 8px;">Subtotal</td>
                  <td align="right" style="padding:4px 8px;width:100px;">Q${total}</td>
                </tr>
                <tr>
                  <td align="right" style="padding:4px 8px;">Envío</td>
                  <td align="right" style="padding:4px 8px;">Q${shipping}</td>
                </tr>
                <tr>
                  <td align="right" style="padding:8px;font-weight:bold;color:#6B4423;">Total</td>
                  <td align="right" style="padding:8px;font-weight:bold;color:#6B4423;">Q${grandTotal}</td>
                </tr>
              </table>

              <h3 style="color:#6B4423;font-size:16px;margin:24px 0 12px;">Dirección de envío</h3>
              <p style="color:#4a3b2a;line-height:1.6;margin:0;">
                ${order.address}<br>
                ${order.city}, ${order.department}<br>
                ${order.postalCode}
              </p>

              <div style="text-align:center;margin:32px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://agapestudio.com'}/rastreo?orden=${order.id}" style="background:#6B4423;color:#F6D3B3;padding:12px 24px;border-radius:4px;text-decoration:none;display:inline-block;font-weight:bold;">Rastrear mi pedido</a>
              </div>

              <p style="color:#6B4423AA;font-size:12px;margin:24px 0 0;text-align:center;">Si tienes dudas, escríbenos a <a href="mailto:${ADMIN_EMAIL}" style="color:#6B4423;">${ADMIN_EMAIL}</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
    });
    console.log('[Email] Confirmación enviada a', order.customerEmail);
  } catch (err: any) {
    console.error('[Email] Error enviando confirmación:', err.message);
  }
}

export async function sendNewOrderAdminEmail(order: any) {
  if (!resend) {
    console.log('[Email] RESEND_API_KEY no configurada. Email admin no enviado.');
    return;
  }

  const itemsText = order.items?.map((item: any) => {
    const name = item.name || item.product?.name || 'Producto';
    return `- ${name} (x${item.quantity || 1})`;
  }).join('\n') || '';

  try {
    await resend.emails.send({
      from: `Ágape Studio <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `📦 Nueva orden #${order.id?.slice(-8).toUpperCase()} - Q${Number(order.total || 0).toFixed(2)}`,
      html: `<!DOCTYPE html>
<html>
<body style="font-family:Georgia,serif;color:#4a3b2a;background:#FDF9F3;padding:20px;">
  <div style="max-width:600px;margin:auto;background:#fff;border:1px solid #e5d4c3;border-radius:8px;padding:24px;">
    <h2 style="color:#6B4423;">Nueva orden recibida</h2>
    <p><strong>Orden:</strong> #${order.id?.slice(-8).toUpperCase()}</p>
    <p><strong>Cliente:</strong> ${order.customerName}</p>
    <p><strong>Email:</strong> ${order.customerEmail}</p>
    <p><strong>Teléfono:</strong> ${order.customerPhone}</p>
    <p><strong>Total:</strong> Q${(Number(order.total || 0) + Number(order.shippingCost || 0)).toFixed(2)}</p>
    <hr style="border:0;border-top:1px solid #eee;margin:16px 0;">
    <pre style="font-family:Georgia,serif;line-height:1.6;">${itemsText}</pre>
    <hr style="border:0;border-top:1px solid #eee;margin:16px 0;">
    <p><strong>Dirección:</strong><br>${order.address}<br>${order.city}, ${order.department} ${order.postalCode}</p>
    <div style="text-align:center;margin-top:24px;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://agapestudio.com'}/admin/ordenes/${order.id}" style="background:#6B4423;color:#F6D3B3;padding:10px 20px;border-radius:4px;text-decoration:none;">Ver en admin</a>
    </div>
  </div>
</body>
</html>`
    });
    console.log('[Email] Notificación admin enviada a', ADMIN_EMAIL);
  } catch (err: any) {
    console.error('[Email] Error enviando notificación admin:', err.message);
  }
}

export async function sendOrderStatusUpdateEmail(order: any, updateNote?: string) {
  if (!resend) {
    console.log('[Email] RESEND_API_KEY no configurada. Email de actualización no enviado.');
    return;
  }

  const statusLabels: Record<string, string> = {
    PENDING: 'Pendiente',
    PAID: 'Pagado',
    PROCESSING: 'En preparación',
    READY: 'Listo para envío',
    SHIPPED: 'Enviado',
    IN_TRANSIT: 'En tránsito',
    OUT_FOR_DELIVERY: 'En reparto',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
  };

  try {
    await resend.emails.send({
      from: `Ágape Studio <${FROM_EMAIL}>`,
      to: order.customerEmail,
      subject: `📦 Actualización de tu pedido #${order.id?.slice(-8).toUpperCase()}`,
      html: `<!DOCTYPE html>
<html>
<body style="font-family:Georgia,serif;color:#4a3b2a;background:#FDF9F3;padding:20px;">
  <div style="max-width:600px;margin:auto;background:#fff;border:1px solid #e5d4c3;border-radius:8px;padding:24px;">
    <h2 style="color:#6B4423;">Tu pedido tiene una actualización</h2>
    <p>Hola <strong>${order.customerName}</strong>,</p>
    <p>Tu pedido <strong>#${order.id?.slice(-8).toUpperCase()}</strong> ahora está en estado:</p>
    <div style="background:#FDF9F3;border-radius:6px;padding:16px;text-align:center;margin:16px 0;">
      <span style="font-size:18px;font-weight:bold;color:#6B4423;">${statusLabels[order.status] || order.status}</span>
    </div>
    ${order.trackingNumber ? `<p><strong>Número de guía:</strong> ${order.trackingNumber}</p>` : ''}
    ${order.carrier ? `<p><strong>Transportista:</strong> ${order.carrier}</p>` : ''}
    ${updateNote ? `<p style="margin-top:16px;"><strong>Nota:</strong> ${updateNote}</p>` : ''}
    <div style="text-align:center;margin-top:24px;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://agapestudio.com'}/rastreo?orden=${order.id}" style="background:#6B4423;color:#F6D3B3;padding:12px 24px;border-radius:4px;text-decoration:none;display:inline-block;font-weight:bold;">Ver seguimiento</a>
    </div>
    <p style="color:#6B4423AA;font-size:12px;margin:24px 0 0;text-align:center;">Si tienes dudas, escríbenos a <a href="mailto:${ADMIN_EMAIL}" style="color:#6B4423;">${ADMIN_EMAIL}</a></p>
  </div>
</body>
</html>`
    });
    console.log('[Email] Actualización enviada a', order.customerEmail);
  } catch (err: any) {
    console.error('[Email] Error enviando actualización:', err.message);
  }
}
