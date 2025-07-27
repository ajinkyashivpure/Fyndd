import React from "react";

const BetaPrivacy = () => (
  <div className="max-w-3xl mx-auto p-6 text-gray-800">
    <h1 className="text-2xl font-semibold mb-4">Fyndd – Open Beta Privacy Policy</h1>
    <p><strong>Effective Date:</strong> [Insert Date]</p>

    <ul className="list-disc list-inside mt-4 space-y-2">
      <li><strong>Data Collection:</strong> We collect minimal personal information (like name, email) and technical data (like device info and usage logs) to improve the beta experience.</li>
      <li><strong>Usage:</strong> Your data may be used to:
        <ul className="list-disc list-inside ml-5">
          <li>Monitor performance</li>
          <li>Debug issues</li>
          <li>Improve features</li>
          <li>Analyze user behavior (anonymously)</li>
        </ul>
      </li>
      <li><strong>Third Parties:</strong> We don’t sell your data. We may use third-party tools (e.g., analytics) with proper safeguards.</li>
      <li><strong>Security:</strong> We implement reasonable security practices but cannot guarantee complete security during the beta phase.</li>
      <li><strong>Opt-Out:</strong> You may stop using the platform at any time and request data deletion by contacting us at <a href="mailto:privacy@fyndd.in" className="text-blue-600 underline">privacy@fyndd.in</a>.</li>
    </ul>
  </div>
);

export default BetaPrivacy;
