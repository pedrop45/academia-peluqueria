import { Link } from 'react-router-dom';
function Presencial() {
    return (
        <>
            {}
            <section className="c-hero">
                <div className="l-wrap">
                    <div className="c-hero__grid">
                        {}
                        <div>
                            <p className="c-hero__kicker">Formación oficial para profesionales de la imagen personal</p>
                            <h1 className="c-heading">
                                Certificado SSCE0110: Docencia de la Formación Profesional para el Empleo
                            </h1>
                            <p className="c-hero__lead">
                                Programa oficial que te habilita para programar, impartir, tutorizar y evaluar
                                acciones formativas de formación profesional para el empleo.
                            </p>
                            <ul className="c-list">
                                <li>Familia profesional: Servicios Socioculturales y a la Comunidad.</li>
                                <li>Área profesional: Formación y educación.</li>
                                <li>Duración total: 360 horas de certificado + módulo de prácticas profesionales.</li>
                            </ul>
                            <div className="c-actions">
                                <Link to="/contacto" className="c-btn">Solicitar plaza</Link>
                                <a href="#info" className="c-btn c-btn--ghost">Ver información</a>
                            </div>
                        </div>
                        {}
                        <div>
                            <div className="c-card c-card--lift">
                                <h3 className="c-subheading">Competencia general</h3>
                                <p className="t-small t-muted">
                                    Programar, impartir, tutorizar y evaluar acciones formativas del subsistema de
                                    formación profesional para el empleo, utilizando recursos didácticos y orientando
                                    sobre itinerarios formativos y salidas profesionales.
                                </p>
                                <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,.06)', margin: '1rem 0' }} />
                                <p className="t-small"><strong>Nivel</strong>: 3</p>
                                <p className="t-small"><strong>Real Decreto</strong>: 1697/2011, modificado por RD 625/2013.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {}
            <section className="l-section" id="info">
                <div className="l-wrap">
                    <h2 className="c-heading">Módulos formativos</h2>
                    <div className="l-grid l-grid--two" style={{ gap: '1rem' }}>
                        {[
                            { cod: 'MF1442_3', h: '90 horas', title: 'Programación didáctica de acciones formativas para el empleo' },
                            { cod: 'MF1443_3', h: '120 horas', title: 'Impartición y tutorización de acciones formativas para el empleo' },
                            { cod: 'MF1444_3', h: '90 horas', title: 'Evaluación del aprendizaje en formación profesional para el empleo' },
                            { cod: 'MF1445_3', h: '60 horas', title: 'Orientación laboral y promoción de la calidad en la formación profesional para el empleo' },
                        ].map(m => (
                            <div className="c-card" key={m.cod}>
                                <h4 className="c-subheading" style={{ fontSize: '1rem' }}>{m.title}</h4>
                                <p className="t-small t-muted" style={{ margin: 0 }}>
                                    <strong>{m.cod}</strong> · {m.h}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {}
            <section className="l-section l-section--alt">
                <div className="l-wrap">
                    <h2 className="c-heading">Salidas profesionales</h2>
                    <p className="t-muted">Al obtener este certificado podrás ejercer como:</p>
                    <ul className="c-list">
                        <li>Docente/formador en entidades de formación profesional para el empleo.</li>
                        <li>Tutor de prácticas en centros de trabajo.</li>
                        <li>Coordinador de acciones formativas.</li>
                        <li>Evaluador de competencias y acreditaciones laborales.</li>
                    </ul>
                </div>
            </section>
            {}
            <section className="l-section">
                <div className="l-wrap">
                    <h2 className="c-heading">Requisitos de acceso</h2>
                    <div className="l-grid l-grid--two" style={{ gap: '1rem' }}>
                        <div className="c-card">
                            <h3 className="c-subheading" style={{ fontSize: '1rem' }}>Vía académica</h3>
                            <ul className="c-list t-small">
                                <li>Bachillerato o equivalente.</li>
                                <li>Técnico Superior o equivalente.</li>
                                <li>Superación prueba de acceso a CFGS.</li>
                            </ul>
                        </div>
                        <div className="c-card">
                            <h3 className="c-subheading" style={{ fontSize: '1rem' }}>Vía profesional</h3>
                            <ul className="c-list t-small">
                                <li>Certificado de profesionalidad de nivel 2 del mismo área.</li>
                                <li>Experiencia laboral demostrada de al menos 3 años en el sector.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            {}
            <section className="notice">
                <div className="wrap notice-box">
                    <h2 className="notice-title">¿Interesado en este certificado?</h2>
                    <p>
                        Solicita información sobre fechas, plazas disponibles y financiación.
                        Nuestro equipo te orientará sin compromiso.
                    </p>
                    <p className="notice-cta">
                        Llámanos al <a href="tel:+34615317466">615 317 466</a> o{' '}
                        <Link to="/contacto" style={{ color: '#fff', textDecorationThickness: '2px' }}>
                            escríbenos por aquí
                        </Link>.
                    </p>
                </div>
            </section>
        </>
    );
}
export default Presencial;