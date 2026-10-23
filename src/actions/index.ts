import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";

import { Resend } from "resend";
import { RESEND_API_KEY, TURNSTILE_SECRET_KEY } from "astro:env/server";

export const prerender = false;

interface Form {
  name: string;
  email: string;
  description: string;
  phone?: string;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";

const verifyTurnstile = async (token: string | undefined, ip: string | null) => {
  const secret = TURNSTILE_SECRET_KEY ?? (import.meta.env.DEV ? TURNSTILE_TEST_SECRET : undefined);

  if (!secret) {
    console.error("Falta la variable TURNSTILE_SECRET_KEY");
    return false;
  }

  if (!token) return false;

  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body },
    );
    const result = (await response.json()) as { success: boolean; "error-codes"?: string[] };
    if (!result.success) console.error("Turnstile rechazó el token:", result["error-codes"]);
    return result.success;
  } catch (err) {
    console.error("Error al verificar Turnstile:", err);
    return false;
  }
};

const html = ({ name, email, description, phone }: Form) => `
  <h2>Nuevo mensaje desde <a href='https://dialmonsalve.com'>dialmonsalve.com</a></h2>
  <p>Ha recibido un nuevo mensaje de ${escapeHtml(name)}!</p>
  <p>Email: ${escapeHtml(email)}</p>
  <p>Teléfono: ${!phone ? "No registra teléfono" : escapeHtml(phone)}</p>
  <p>Descripción: ${escapeHtml(description).replace(/\n/g, "<br>")}</p>
`;

const sendEmail = defineAction({
  accept: "form",
  input: z.object({
    name: z
      .string({ message: "El campo nombre es requerido" })
      .trim()
      .min(3, "El campo nombre Debe tener al menos 3 caracteres")
      .max(80, "El campo nombre no puede superar los 80 caracteres"),
    email: z
      .email("Debe proporcionar un email válido")
      .max(254, "El email no puede superar los 254 caracteres"),
    description: z
      .string({ message: "Tu opinion Debe tener al menos 3 caracteres" })
      .trim()
      .min(1, "Tu opinión es importante y requerida")
      .max(2000, "Tu mensaje no puede superar los 2000 caracteres"),
    phone: z
      .string()
      .trim()
      .max(20, "El teléfono no puede superar los 20 caracteres")
      .optional(),
    "cf-turnstile-response": z.string().max(2048).optional(),
  }),

  handler: async (
    { description, email, name, phone, "cf-turnstile-response": token },
    { request },
  ) => {
    const human = await verifyTurnstile(token, request.headers.get("CF-Connecting-IP"));

    if (!human) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "No se pudo verificar que no eres un robot.",
      });
    }

    if (!RESEND_API_KEY) {
      console.error("Falta la variable RESEND_API_KEY");
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error al enviar el email. Inténtalo de nuevo más tarde.",
      });
    }

    const resend = new Resend(RESEND_API_KEY);

    const { data, error } = await resend.emails
      .send({
        from: "Mi Web <diales1981@resend.dev>",
        to: "diales1981@gmail.com",
        replyTo: email,
        subject: `Mensaje de ${name.replace(/[\r\n]+/g, " ")} desde dialmonsalve.com`,
        html: html({ description, email, name, phone }),
      })
      .catch((err: unknown) => ({ data: null, error: err }));

    if (error || !data) {
      console.error("Error al enviar el email con Resend:", error);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error al enviar el email. Inténtalo de nuevo más tarde.",
      });
    }

    return true;
  },
});

export const server = { sendEmail };
