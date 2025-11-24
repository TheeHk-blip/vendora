export default function SecurityHelp() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Security & Privacy</h1>
      <p className="text-gray-500 dark:text-gray-400">
        Learn how your data is protected on Vendora.
      </p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Data Encryption</h2>
        <p>
          All customer data is encrypted at rest and in transit using industry-standard protocols.
        </p>

        <h2 className="text-xl font-semibold">Account Protection</h2>
        <p>
          We support two-factor authentication (2FA) to keep your account secure.
        </p>

        <h2 className="text-xl font-semibold">Privacy Policy</h2>
        <p>
          We never sell personal data and comply with GDPR and modern privacy rules.
        </p>
      </section>
    </div>
  );
}
