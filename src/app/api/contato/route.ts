import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { contato } from "@/data/contato";
import { contatoFormSchema } from "@/lib/contato-schema";

const RESEND_API_URL = "https://api.resend.com/emails";
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 3;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  const rateLimitKey = getRateLimitKey(request);

  if (isRateLimited(rateLimitKey)) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Muitas tentativas em pouco tempo. Aguarde um minuto e tente novamente.",
      },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const data = contatoFormSchema.parse(body);

    if (data._gotcha?.trim()) {
      return NextResponse.json({ success: true });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_EMAIL_FROM;
    const to = process.env.CONTACT_EMAIL_TO?.trim() || contato.email;

    if (!resendApiKey || !from || !to) {
      return NextResponse.json(
        {
          success: false,
          error:
            "O envio ainda não está configurado. Defina RESEND_API_KEY, CONTACT_EMAIL_FROM e CONTACT_EMAIL_TO no ambiente.",
        },
        { status: 503 },
      );
    }

    const resendResponse = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: data.email,
        subject: `[Site] ${data.assunto} - ${data.nome}`,
        text: buildEmailText(data),
      }),
    });

    if (!resendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Não foi possível enviar a mensagem agora. Tente novamente em instantes.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.issues[0]?.message ?? "Revise os dados informados.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Não foi possível processar sua mensagem agora. Tente novamente em instantes.",
      },
      { status: 500 },
    );
  }
}

function buildEmailText(data: {
  nome: string;
  email: string;
  telefone?: string;
  assunto: string;
  mensagem: string;
}) {
  return [
    `Nome: ${data.nome}`,
    `E-mail: ${data.email}`,
    `Telefone: ${data.telefone || "Não informado"}`,
    `Assunto: ${data.assunto}`,
    "",
    "Mensagem:",
    data.mensagem,
  ].join("\n");
}

function getRateLimitKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  return forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  current.count += 1;

  return current.count > RATE_LIMIT_MAX_REQUESTS;
}
