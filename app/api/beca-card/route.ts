import { NextRequest, NextResponse } from "next/server";
import { B2BPaymentService } from "@/lib/visa-b2b/B2BPaymentService";

// Singleton sandbox instance — persists across requests in the same process.
const b2b = B2BPaymentService.sandbox();

function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      applicantId: string;
      carne: string;
      program: string;
      amount?: number;
    };

    const { carne, program, amount } = body;

    const payment = await b2b.BIP.initiate({
      messageId:     uuid(),
      clientId:      "BCR-BECAS-001",
      buyerId:       "BCR-001",
      supplierId:    carne,
      paymentAmount: amount ?? 500_000,
      currencyCode:  "188",           // ISO 4217: CRC — Costa Rican Colón
      invoiceNumber: `BECA-${carne}-2026`,
      memo:          `Beca Universidad Publica — ${program}`,
      validDays:     365,
    });

    return NextResponse.json({ ok: true, payment });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
