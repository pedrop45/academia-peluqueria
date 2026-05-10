import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

import Home from './pages/Home';
import Presencial from './pages/Presencial';
import Teleformacion from './pages/Teleformacion';
import Cursos from './pages/Cursos';
import Servicios from './pages/Servicios';
import Trabajos from './pages/Trabajos';
import Equipo from './pages/Equipo';
import Contacto from './pages/Contacto';

import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import AdminCourses from './pages/AdminCourses';
import AdminTestimonials from './pages/AdminTestimonials';
import AdminBlog from './pages/AdminBlog';
import AdminJobs from './pages/AdminJobs';
import AdminPartners from './pages/AdminPartners';
import AdminOrders from './pages/AdminOrders';
import AdminGallery from './pages/AdminGallery';

import CursosBarberia from './pages/CursosBarberia';
import CursosCertificados from './pages/CursosCertificados';
import CursosEspecialidades from './pages/CursosEspecialidades';

import NuestrosAlumnos from './pages/NuestrosAlumnos';
import Testimonios from './pages/Testimonios';
import BolsaEmpleo from './pages/BolsaEmpleo';
import CentrosColaboradores from './pages/CentrosColaboradores';
import Blog from './pages/Blog';
import AccesoAlumnos from './pages/AccesoAlumnos';

import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import PagoExito from './pages/PagoExito';
import PagoCancelado from './pages/PagoCancelado';
import MisCursos from './pages/MisCursos';

import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function AdminRoute({ element }) {
  return <ProtectedAdminRoute>{element}</ProtectedAdminRoute>;
}

function App() {
  return (
    <Routes>
      {}
      <Route element={<Layout />}>

        {}
        <Route path="/" element={<Home />} />
        <Route path="/presencial" element={<Presencial />} />
        <Route path="/teleformacion" element={<Teleformacion />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/trabajos" element={<Trabajos />} />
        <Route path="/equipo" element={<Equipo />} />
        <Route path="/contacto" element={<Contacto />} />

        {}
        <Route path="/cursos/barberia-peluqueria" element={<CursosBarberia />} />
        <Route path="/cursos/certificados" element={<CursosCertificados />} />
        <Route path="/cursos/especialidades" element={<CursosEspecialidades />} />

        {}
        <Route path="/nuestros-alumnos" element={<NuestrosAlumnos />} />
        <Route path="/testimonios" element={<Testimonios />} />
        <Route path="/bolsa-empleo" element={<BolsaEmpleo />} />
        <Route path="/centros-colaboradores" element={<CentrosColaboradores />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/acceso-alumnos" element={<AccesoAlumnos />} />

        {}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {}
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pago/exito" element={<PagoExito />} />
        <Route path="/pago/cancelado" element={<PagoCancelado />} />
        <Route path="/mis-cursos" element={<MisCursos />} />

        {}
        <Route path="/admin" element={<AdminLogin />} />

        {}
        <Route path="/admin/panel" element={<AdminRoute element={<AdminPanel />} />} />
        <Route path="/admin/courses" element={<AdminRoute element={<AdminCourses />} />} />
        <Route path="/admin/testimonials" element={<AdminRoute element={<AdminTestimonials />} />} />
        <Route path="/admin/blog" element={<AdminRoute element={<AdminBlog />} />} />
        <Route path="/admin/jobs" element={<AdminRoute element={<AdminJobs />} />} />
        <Route path="/admin/partners" element={<AdminRoute element={<AdminPartners />} />} />
        <Route path="/admin/orders" element={<AdminRoute element={<AdminOrders />} />} />
        <Route path="/admin/gallery" element={<AdminRoute element={<AdminGallery />} />} />

        {}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>
    </Routes>
  );
}

export default App;
