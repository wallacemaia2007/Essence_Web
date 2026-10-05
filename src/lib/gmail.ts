export function buildGmailComposeUrl({
  to,
  subject,
  body,
}: {
  to: string;
  subject?: string;
  body?: string;
}) {
  const params = new URLSearchParams();
  params.set("view", "cm");
  params.set("fs", "1");
  params.set("to", to);
  if (subject) params.set("su", subject);
  if (body) params.set("body", body);
  return `https://mail.google.com/mail/?${params.toString()}`;
}
