export default function DashboardHelp() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Using the Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400">
        Learn how to navigate and use your Vendora merchant dashboard.
      </p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Main Sections</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Overview (sales, revenue, analytics)</li>
          <li>Products management</li>
          <li>Orders & fulfillment</li>
          <li>Messaging center</li>
          <li>Store settings</li>
        </ul>       
      </section>
    </div>
  );
}
