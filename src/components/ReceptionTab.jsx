import React from 'react';
import PageBlockRenderer from './PageBlockRenderer.jsx';

export default function ReceptionTab({ reception, siteSettings, onSelectTab }) {
  if (!reception) return null;

  return (
    <div className="reception-tab-content">
      <PageBlockRenderer
        pageData={reception}
        siteSettings={siteSettings}
        onSelectTab={onSelectTab}
      />
    </div>
  );
}
