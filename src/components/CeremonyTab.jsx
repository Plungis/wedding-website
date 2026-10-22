import React from 'react';
import PageBlockRenderer from './PageBlockRenderer.jsx';

export default function CeremonyTab({ ceremony, siteSettings, onSelectTab }) {
  if (!ceremony) return null;

  return (
    <div className="ceremony-tab-content">
      <PageBlockRenderer
        pageData={ceremony}
        siteSettings={siteSettings}
        onSelectTab={onSelectTab}
      />
    </div>
  );
}
