import React from "react";

const BetaTerms = () => (
  <div className="max-w-3xl mx-auto p-6 text-gray-800">
    <h1 className="text-2xl font-semibold mb-4">Fyndd – Open Beta Terms & Conditions</h1>
    <p><strong>Effective Date:</strong> [Insert Date]</p>
    <p><strong>Version:</strong> Beta 1.0</p>

    <ul className="list-disc list-inside mt-4 space-y-2">
      <li><strong>Beta Status:</strong> Fyndd is in its open beta phase and under active development. You may encounter bugs, incomplete features, or unexpected changes.</li>
      <li><strong>Usage:</strong> Use Fyndd at your own discretion. We do not guarantee uptime, feature stability, or consistent performance during beta.</li>
      <li><strong>Feedback:</strong> We may collect your usage data and feedback to improve the platform. By using Fyndd, you consent to this.</li>
      <li><strong>Changes:</strong> We may add, remove, or modify features without notice. Data may be reset during beta updates.</li>
      <li><strong>Liability:</strong> Fyndd is not liable for any losses or issues arising from use during the beta phase.</li>
    </ul>

    <p className="mt-4">If you do not agree to these terms, please refrain from using the platform during the beta period.</p>
  </div>
);

export default BetaTerms;
