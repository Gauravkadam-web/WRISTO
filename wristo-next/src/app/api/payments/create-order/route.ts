import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency = 'INR', orderId } = body;

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({
        success: false,
        message: 'Razorpay server credentials unconfigured'
      }, { status: 400 });
    }

    const amountInPaise = Math.round(Number(amount || 100) * 100);
    const auth = Buffer.from(`${keyId.trim()}:${keySecret.trim()}`).toString('base64');
    const receipt = `rcpt_${Date.now().toString(36)}`;

    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: currency || 'INR',
        receipt,
        notes: {
          platform: 'WRISTO',
          orderId: orderId || ''
        }
      })
    });

    const data = await rzpRes.json();

    if (!rzpRes.ok) {
      return NextResponse.json({
        success: false,
        error: data
      }, { status: rzpRes.status });
    }

    return NextResponse.json({
      success: true,
      data: {
        gatewayOrderId: data.id,
        keyId,
        amount: Number(amount),
        currency
      }
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err?.message || 'Failed to create order'
    }, { status: 500 });
  }
}
