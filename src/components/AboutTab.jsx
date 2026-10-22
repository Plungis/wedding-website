import React from 'react';
import PageBlockRenderer from './PageBlockRenderer.jsx';

export default function AboutTab({ aboutUs, siteSettings, onSelectTab }) {
  if (!aboutUs) return null;

  return (
    <div className="about-tab-content">
      <PageBlockRenderer
        pageData={aboutUs}
        siteSettings={siteSettings}
        onSelectTab={onSelectTab}
      />
    </div>
  );
}
