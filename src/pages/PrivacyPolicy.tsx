import FadeIn from "@/components/FadeIn";
import SEO from "@/components/SEO";
import SitePageLayout from "@/components/SitePageLayout";

const sectionHeading =
  "font-heading text-[clamp(22px,3vw,28px)] leading-[1.35] tracking-[-0.5px] mt-14 mb-5";
const bodyText = "text-[17px] leading-[1.75] tracking-[-0.1px] mb-5";
const listItem = "text-[17px] leading-[1.75] tracking-[-0.1px]";

const PrivacyPolicy = () => {
  return (
    <SitePageLayout>
      <SEO
        title="Privacy Policy"
        description="How OpenComputer collects, uses, and protects your data across opencomputer.dev and the OpenComputer platform."
        path="/privacy"
      />

      <FadeIn>
        <h1 className="font-heading text-[clamp(42px,6vw,64px)] leading-[1.15] tracking-[-1.5px] mb-4">
          Privacy policy.
        </h1>
        <p className="font-mono-brand text-[13px] text-muted-foreground mb-10">
          Last updated: August 3, 2026
        </p>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div>
          <p className={bodyText}>
            OpenComputer is operated by Digger ("we", "us"). This policy
            explains what data we collect, why we collect it, and what we do
            with it, across this website (opencomputer.dev) and the
            OpenComputer platform (app.opencomputer.dev).
          </p>
          <p className={bodyText}>
            The short version: we collect as little as we can, we don't sell
            your data, and the marketing site doesn't use tracking cookies.
          </p>

          <h2 className={sectionHeading}>Data we collect on this website</h2>
          <p className={bodyText}>
            We use Plausible, a privacy-friendly analytics service, to
            understand aggregate traffic to this site. Plausible does not use
            cookies and does not collect personal data; we see page views,
            referrers, and country-level location, never individual visitors.
          </p>
          <p className={bodyText}>
            Our hosting providers keep standard server logs (IP address,
            user agent, requested pages) for security and operations. These
            are retained for a limited period and not used for tracking.
          </p>

          <h2 className={sectionHeading}>Data we collect on the platform</h2>
          <p className={bodyText}>
            If you create an account on the OpenComputer platform, we collect:
          </p>
          <ul className="list-disc pl-6 mb-5 space-y-2">
            <li className={listItem}>
              <strong>Account information:</strong> your name, email address,
              and details from the authentication provider you sign in with.
            </li>
            <li className={listItem}>
              <strong>Billing information:</strong> handled by our payment
              processor. We never see or store full card numbers.
            </li>
            <li className={listItem}>
              <strong>Usage data:</strong> metadata about your sandboxes and
              agent sessions (creation times, resource usage, API calls) so we
              can operate the service, meter billing, and debug issues.
            </li>
            <li className={listItem}>
              <strong>Sandbox content:</strong> the code, files, and data you
              run inside your sandboxes. This is your data. We access it only
              to operate the service, or with your permission when helping you
              debug something.
            </li>
          </ul>

          <h2 className={sectionHeading}>How we use your data</h2>
          <ul className="list-disc pl-6 mb-5 space-y-2">
            <li className={listItem}>To provide and operate the service.</li>
            <li className={listItem}>
              To bill you for usage and prevent fraud and abuse.
            </li>
            <li className={listItem}>
              To communicate with you about your account, incidents, and
              product updates. You can opt out of non-essential emails at any
              time.
            </li>
            <li className={listItem}>
              To improve the product, using aggregate usage patterns.
            </li>
          </ul>
          <p className={bodyText}>
            We do not sell your personal data, and we do not use the contents
            of your sandboxes to train machine learning models.
          </p>

          <h2 className={sectionHeading}>Who we share data with</h2>
          <p className={bodyText}>
            We share data only with service providers we use to run
            OpenComputer, such as cloud infrastructure providers, our payment
            processor, and email delivery services. Each provider receives
            only what it needs to perform its function and is bound by its own
            data protection obligations. We may also disclose data if required
            by law.
          </p>

          <h2 className={sectionHeading}>Data retention</h2>
          <p className={bodyText}>
            We keep your account data for as long as your account is active.
            When you delete a sandbox, its contents are removed from our
            systems, subject to short-lived backups. When you delete your
            account, we delete your personal data within 30 days, except where
            we're legally required to keep records (for example, billing
            history).
          </p>

          <h2 className={sectionHeading}>Security</h2>
          <p className={bodyText}>
            Sandboxes run in isolated virtual machines. Data is encrypted in
            transit, and credentials and secrets are encrypted at rest. If we
            become aware of a breach affecting your data, we will notify you
            without undue delay.
          </p>

          <h2 className={sectionHeading}>Your rights</h2>
          <p className={bodyText}>
            You can access, correct, export, or delete your personal data at
            any time. Depending on where you live, you may have additional
            rights under laws like the GDPR or CCPA, including the right to
            object to processing and the right to lodge a complaint with a
            supervisory authority. To exercise any of these rights, email us
            at the address below.
          </p>

          <h2 className={sectionHeading}>Cookies</h2>
          <p className={bodyText}>
            This marketing site does not use tracking cookies. The platform
            uses strictly necessary cookies to keep you signed in.
          </p>

          <h2 className={sectionHeading}>Children</h2>
          <p className={bodyText}>
            OpenComputer is not directed at children under 16, and we do not
            knowingly collect data from them.
          </p>

          <h2 className={sectionHeading}>Changes to this policy</h2>
          <p className={bodyText}>
            If we make material changes to this policy, we'll update the date
            at the top of this page and, for significant changes affecting
            platform users, notify you by email.
          </p>

          <h2 className={sectionHeading}>Contact</h2>
          <p className={bodyText}>
            Questions about this policy or your data? Email us at{" "}
            <a href="mailto:utpal@digger.dev" className="underline">
              utpal@digger.dev
            </a>
            .
          </p>
        </div>
      </FadeIn>
    </SitePageLayout>
  );
};

export default PrivacyPolicy;
