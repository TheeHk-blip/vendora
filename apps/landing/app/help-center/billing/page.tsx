export default function BillingHelp() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Billing & Payments</h1>
      <p className="text-gray-500 dark:text-gray-400">
        Manage your subscription, payments, and invoices.
      </p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Upgrading Your Plan</h2>
        <p>
          Go to <strong>Settings → Billing</strong> to move from Basic to Startup or Enterprise.
        </p>

        <h2 className="text-xl font-semibold">Accepted Payment Methods</h2>
        <p>
          We accept major credit cards, PayPal, and mobile money in supported regions.
        </p>

        <h2 className="text-xl font-semibold">Downloading Invoices</h2>
        <p>
          Your invoices can be found under <strong>Billing History</strong> in your dashboard.
        </p>
      </section>
    </div>
  );
}
