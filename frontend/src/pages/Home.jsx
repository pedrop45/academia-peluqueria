import { Link } from 'react-router-dom';
function Home() {
    return (
        <>
            <section className="hero">
                <div className="wrap hero-grid">
                    <div className="hero-text">
                        <h2 className="kicker">Academia de peluquería y barbería desde 1987</h2>
                        <p className="lead">Familia de peluqueros y barberos desde 1953</p>
                        <p>
                            Formación profesional en peluquería y barbería con centros en Adra y Almería.
                            Conviértete en profesional de la Imagen Personal altamente cualificado.
                        </p>
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
                            <Link to="/cursos" className="btn btn-dark btn-lg">Ver cursos</Link>
                            <Link to="/contacto" className="btn btn-outline-dark btn-lg">Contacto</Link>
                        </div>
                    </div>
                    <div className="hero-media">
                        <img src="/assets/img/c.png" alt="Logo Barbería Montserrat González" />
                    </div>
                </div>
            </section>
            <section className="section">
                <div className="wrap">
                    <h2 className="section-title">¿Quién soy?</h2>
                    <div className="two-col">
                        <div>
                            <h3 className="name">Soy Montserrat González</h3>
                            <p>
                                Peluquera desde 1987 abrió su peluquería en julio de 1989. En 1995 abre la
                                academia de peluquería en Adra y en 2020 en Almería capital. Profesora de la
                                Formación Profesional para el Empleo. Evaluadora de las acreditaciones de la
                                experiencia laboral en la Junta de Andalucía desde 2014. En su trayectoria
                                profesional ha pasado por experiencias como Canal Sur siendo peluquera y
                                maquilladora en el programa Andalucía de Fiesta.
                            </p>
                        </div>
                        <div className="card-media">
                            <img src="/assets/img/a.png" alt="Montserrat González" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="section alt">
                <div className="wrap two-col">
                    <div>
                        <h2 className="section-title">Nuestras clases</h2>
                        <p>
                            Nuestros centros disponen de aulas espaciosas y todas las herramientas necesarias
                            para aprender peluquería y barbería de forma avanzada.
                        </p>
                    </div>
                    <div className="card-media">
                        <img src="/assets/img/b.png" alt="Aula y herramientas de formación" />
                    </div>
                </div>
            </section>
            <section className="notice">
                <div className="wrap notice-box">
                    <h2 className="notice-title">Permiso de Residencia y Trabajo por arraigo para la formación</h2>
                    <p>
                        Infórmate de cómo conseguir el arraigo a través de un curso con CERTIFICADO DE
                        PROFESIONALIDAD, entre otros, nuestro centro C.E.P. MONTSERRAT GONZÁLEZ, te ofrece
                        dichos cursos en la especialidad de Peluquería con los niveles 1, 2 y 3.
                    </p>
                    <p className="notice-cta">
                        Pídenos información al <a href="tel:+34615317466">615 317 466</a>
                    </p>
                </div>
            </section>
            {}
            <section className="section text-center" style={{ padding: '3rem 1rem', backgroundColor: '#f9f9f9' }}>
                <div className="wrap">
                    <h2 className="section-title" style={{ marginBottom: '2rem' }}>Organismos e Instituciones que nos avalan</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '4rem' }}>
                        <img src="/assets/img/certificaciones.png" alt="Certificaciones OCA ISO 9001 e ISO 14001 por ENAC" style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                        <img src="/assets/img/colaboradores.png" alt="Entidades Colaboradoras: Junta de Andalucía, Fundación Estatal, CEPPE, SEPE" style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                    </div>
                </div>
            </section>
            {}
            <div className="ubi" style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3183.5!2d-2.4543232!3d36.8345088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd7a9d6938768ac3%3A0xee2bb0fd3c679a0!2sC.%20Pablo%20Ruiz%20Picasso%2C%2017%2C%2004005%20Almer%C3%ADa!5e0!3m2!1ses!2ses!4v1700000000000"
                    width="600"
                    height="450"
                    style={{ border: 0, maxWidth: '100%' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación Academia Montserrat González"
                ></iframe>
            </div>
        </>
    );
}
export default Home;
