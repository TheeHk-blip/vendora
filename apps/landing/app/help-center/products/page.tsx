export default function ProductsHelp() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Product Approval</h1>
      <p className="text-gray-500 dark:text-gray-400">
        Understand how Vendora reviews and approves new products.
      </p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Why are products reviewed?</h2>
        <p>
          To maintain a safe and trustworthy marketplace, all products must comply with
          our guidelines and quality standards.
        </p>

        <h2 className="text-xl font-semibold">Common Reasons for Rejection</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Low-quality or blurry images</li>
          <li>Missing product description</li>
          <li>Incorrect category selection</li>
          <li>Prohibited or restricted items</li>
        </ul>

        <h2 className="text-xl font-semibold">Re-submitting a Product</h2>
        <p>
          Edit your product, fix the issues highlighted in the rejection message, and
          submit again for review.
        </p>
      </section>
    </div>
  );
}
