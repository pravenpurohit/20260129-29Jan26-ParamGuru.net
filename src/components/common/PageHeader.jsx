import React from 'react';

const PageHeader = ({ title, subtitle }) => {
    return (
        <div className="page-header" style={{ marginBottom: '2rem' }}>
            <h1>{title}</h1>
            {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>
    );
};

export default PageHeader;
