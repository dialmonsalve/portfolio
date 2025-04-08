export const prerender = false;

import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

import nodemailer from "nodemailer";

interface Form {
  name: string;
  email: string;
  description: string;
  phone?: string;
}

const MAILER_SECRET_NAME = import.meta.env.MAILER_SECRET_NAME;
const MAILER_SECRET_KEY = import.meta.env.MAILER_SECRET_KEY;
const SERVICE =  import.meta.env.SERVICE;

const html = ({ name, email, description, phone }: Form) => `
  <h2>Nuevo mensaje desde mi sitio web</h2>
  <p>Ha recibido un nuevo mensaje de ${name}! </p>
  <p>Email: ${email}</p>
  <p>Teléfono: ${!phone ? "No registra teléfono" : phone}</p>
  <p>Descripción: ${description} </p>
`;

const sendEmail = defineAction({
  accept: "form",
  input: z.object({
    name: z
      .string({ message: "El campo nombre es requerido" })
      .min(3, "El campo nombre Debe tener al menos 3 caracteres")
      .nonempty(),
    email: z
      .string({ message: "El campo email es requerido" })
      .email("Debe proporcionar un email válido")
      .nonempty(),
    description: z
      .string({ message: "Tu opinion Debe tener al menos 3 caracteres" })
      .min(1, "Tu opinión es importante y requerida")
      .nonempty(),
    phone: z.string().optional(),
  }),

  handler: async ({ description, email, name, phone }) => {
    const transporter = nodemailer.createTransport({
      service: SERVICE,
      secure: true,
      auth: { user: MAILER_SECRET_NAME, pass: MAILER_SECRET_KEY },
    });

    const mailOptions = {
      from: email,
      to: MAILER_SECRET_NAME,
      subject: "Mensaje desde https://misitioweb.com",
      text: `Hola, Acabas de recibir un mensaje de ${name}!`,
      html: html({ description, email, name, phone }),
    };

    let resp;

    try {
      resp = await transporter.sendMail(mailOptions);
      const data = resp.accepted;

      return !!data
    } catch (error: any) {
      if (error) {
        if (resp?.rejected) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: "Errores de validación",
          });
        }

        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: error,
        });
      }
    }
  },
});

export const server = { sendEmail};
