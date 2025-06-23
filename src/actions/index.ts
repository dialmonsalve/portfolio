import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { Resend } from "resend";

export const prerender = false;

interface Form {
  name: string;
  email: string;
  description: string;
  phone?: string;
}

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;

const html = ({ name, email, description, phone }: Form) => `
  <h2>Nuevo mensaje desde <a href='dialmonsalve.com' >dialmonsalve.com</a></h2>
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
    const resend = new Resend("re_jPS9fnJA_G18N12K6hTUnrwE9BWzvmArv");

    try {
      const { data, error } = await resend.emails.send({
        from: "Mi Web <diales1981@resend.dev>",
        to: "diales1981@gmail.com",
        subject: `Mensaje de ${name} desde dialmonsalve.com`,
        html: html({ description, email, name, phone }),
      });

      if (error) {
        console.error("Error al enviar el email con Resend:", error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al enviar el email. Inténtalo de nuevo más tarde.",
        });
      }
      return !!data;
    } catch (error: any) {
      console.error("Error inesperado en sendEmail handler:", error);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Error desconocido al enviar el email.",
      });
    }
  },
});

export const server = { sendEmail };
