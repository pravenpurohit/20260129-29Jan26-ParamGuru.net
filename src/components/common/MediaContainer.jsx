import React from 'react';

/**
 * MediaContainer
 * Wraps videos, images, or audio in a responsive, styled card.
 * 
 * Props:
 * - type: 'image' | 'video' | 'youtube'
 * - src: string (URL)
 * - alt: string (for images)
 * - caption: string (optional)
 */
const MediaContainer = ({ type, src, alt, caption }) => {
    return (
        <div className="media-card" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            textAlign: 'center'
        }}>
            {type === 'image' && (
                <img
                    src={src}
                    alt={alt}
                    style={{
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                    }}
                />
            )}

            {type === 'video' && (
                <video
                    src={src}
                    controls
                    style={{
                        maxWidth: '100%',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                    }}
                >
                    Your browser does not support the video tag.
                </video>
            )}

            {type === 'audio' && (
                <audio
                    src={src}
                    controls
                    style={{
                        width: '100%',
                        marginTop: '0.5rem'
                    }}
                >
                    Your browser does not support the audio element.
                </audio>
            )}

            {type === 'youtube' && (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
                    <iframe
                        src={src}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )}

            {caption && (
                <p style={{
                    marginTop: '10px',
                    fontSize: '0.9rem',
                    color: '#ccc',
                    fontStyle: 'italic'
                }}>
                    {caption}
                </p>
            )}
        </div>
    );
};

export default MediaContainer;
