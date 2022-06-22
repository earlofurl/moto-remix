// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import sgMail from "@sendgrid/mail";
import { SENDGRID_API_KEY } from "~/core/utils/env.server";
import { NODE_ENV } from "../../utils/env.server";

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
  let msg;
  const generalAddress = "info@motoperpetuofarm.com";
  const adminAddress = "field@motoperpetuofarm.com";
  const serviceAddress = "service@motoperpetuofarm.com";

  const msg_html = `<p>Message received from Moto Farm Website</p><p>Name: ${name}</p><p>Email: ${email}</p><p>Phone: ${phone}</p><p>Message: ${message}</p>`;

  if (NODE_ENV === "development") {
    msg = {
      to: adminAddress,
      from: serviceAddress, // Change to your verified sender
      replyTo: { email },
      subject: "Contact Us Form from Moto Website",
      text: "You have a new contact us form submission",
      html: msg_html,
    };
  } else {
    msg = {
      to: generalAddress,
      cc: adminAddress,
      from: serviceAddress, // Change to your verified sender
      replyTo: { email },
      subject: "Contact Us Form from Moto Website",
      text: "You have a new contact us form submission",
      html: msg_html,
    };
  }

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function trapSpam({
  name,
  email,
  phone,
  message,
  human_test,
}: {
  name: string;
  email: string;
  phone: string;
  message: string;
  human_test: string;
}): Promise<void> {
  const msg = {
    to: "field@motoperpetuofarm.com",
    from: "service@motoperpetuofarm.com", // Change to your verified sender
    replyTo: { email },
    subject: "Spam caught in snare",
    text: "You got a bot",
    html:
      "<p>Message received from Moto Farm Website</p><p>Name: " +
      name +
      "</p><p>Email: " +
      email +
      "</p><p>Phone: " +
      phone +
      "</p><p>Message: " +
      message +
      "</p><p>Human Test Answer: " +
      human_test +
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
