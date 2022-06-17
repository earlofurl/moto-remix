// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import sgMail from "@sendgrid/mail";
import { SENDGRID_API_KEY } from "~/core/utils/env.server";

if (!SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY is not set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendMail({
  name,
  email,
  phone,
  message,
}: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<void> {
  const msg = {
    to: "info@motoperpetuofarm.com",
    cc: "field@motoperpetuofarm.com",
    from: "service@motoperpetuofarm.com", // Change to your verified sender
    replyTo: { email },
    subject: "Contact Us Form from Moto Website",
    text: "You have a new contact us form submission",
    html:
      "<p>Message received from Moto Farm Website</p><p>Name: " +
      name +
      "</p><p>Email: " +
      email +
      "</p><p>Phone: " +
      phone +
      "</p><p>Message: " +
      message +
      "</p>",
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}
