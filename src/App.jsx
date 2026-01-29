import { useState } from 'react'
import './App.css'

function App() {
    return (
        <>
            <div className="container">
                <h1>ParamGuru</h1>
                <div className="photo-gallery">
                    <div className="photo-card">
                        <img
                            src="/assets/2017_Pitaji_Photo_Final_NoLayers_24x36_300dpi_DateCorrected.jpg"
                            alt="Pitaji Photo"
                        />
                    </div>
                    <div className="photo-card">
                        <img
                            src="/assets/PapajiPrasad_2017_12x18_600dpi.jpg"
                            alt="Papaji Prasad Photo"
                        />
                    </div>
                </div>
                <p>Website implementation coming soon.</p>
            </div>
        </>
    )
}

export default App
