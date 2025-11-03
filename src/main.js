const form = document.getElementById("contactForm");
if (!form) return;
const phoneNu = "254794554194";

const name =
  (form.getElementById('[class="clientName"]') || {}).value || "No name";
const email = (form.querySelector('[name="email"]') || {}).value || "no email";
const subject =
  (form.querySelector('[class="subject"]') || {}).value || "no subject";
const message =
  (form.querySelector('[name="message"]') || {}).value || "no message";

function sendMessage() {
  const lines = [
    `
  'New message from portfolio website`,
    ``,
    `*Name:* ${name}`,
    `*Email:* ${email}`,
    `*Message:* ${message}`,
  ];
  const text = lines.join("\n");
  const encoded = encodeURIComponent(finalText);
  const url = `https://api.whatsapp.com/send?phone=${phoneNu}&text=${lines}`;

  const win = window.open(url, "_blank");
  if (!win) {
    // popup blocked fallback: change location
    window.location.href = url;
  }
}
