export default function AccountHelp() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Account Issues</h1>
      <p className="text-gray-500 dark:text-gray-400">
        Learn how to manage your Vendora account, recover access, and update your details.
      </p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">How to Reset Your Password</h2>
        <p>
          If you&apos;ve forgotten your password, go to the{" "}
          <span className="font-medium">Forgot Password</span> page and enter your email.
          You&apos;ll receive a secure reset link.
        </p>

        <h2 className="text-xl font-semibold">Updating Your Profile</h2>
        <p>
          Visit <strong>Settings → Profile</strong> to change your name, email, or
          contact information.
        </p>

        <h2 className="text-xl font-semibold">Deleting Your Account</h2>
        <p>
          Go to <strong>Settings → Account</strong> and click “Delete Account”. Your data will be
          permanently removed within 7 days.
        </p>
      </section>
    </div>
  );
}
