import { useState } from "react";
import { CourseListPage } from "../components/CourseListPage";
export default function CursosCertificados() {
    const [level, setLevel] = useState(1);
    return (
        <div className="container py-4">
            <div className="d-flex flex-wrap gap-2 mb-3">
                <button
                    className={`btn btn-sm ${level === 1 ? "btn-dark" : "btn-outline-dark"}`}
                    onClick={() => setLevel(1)}
                >
                    Nivel 1
                </button>
                <button
                    className={`btn btn-sm ${level === 2 ? "btn-dark" : "btn-outline-dark"}`}
                    onClick={() => setLevel(2)}
                >
                    Nivel 2
                </button>
                <button
                    className={`btn btn-sm ${level === 3 ? "btn-dark" : "btn-outline-dark"}`}
                    onClick={() => setLevel(3)}
                >
                    Nivel 3
                </button>
            </div>
            <CourseListPage
                title={`Certificados de Profesionalidad · Nivel ${level}`}
                subtitle="Formación oficial reconocida por el SEPE. Selecciona el nivel para ver los certificados disponibles."
                category="certificados"
                level={level}
                emptyMsg={`No hay certificados publicados para el Nivel ${level}.`}
            />
        </div>
    );
}