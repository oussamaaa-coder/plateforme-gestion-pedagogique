import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ─── Contexts ───────────────────────────────────────────────────────────────
import { ThemeProvider } from './admin/context/ThemeContext';
import { AuthProvider } from './admin/context/AuthContext';

// ─── Global CSS ──────────────────────────────────────────────────────────────
import './public_face/assets/css/GlobalHarmony.css';

import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/components/layout/AdminLayout';
import FormateurLayout from './formateur/components/layout/FormateurLayout';
import StudentLayout from './student/components/layout/StudentLayout';
import Dashboard from './admin/pages/admin/Dashboard';
import StudentsList from './admin/pages/admin/users/StudentsList';
import StudentForm from './admin/pages/admin/users/StudentForm';
import TrainersList from './admin/pages/admin/users/TrainersList';
import TrainerForm from './admin/pages/admin/users/TrainerForm';
import TrainerAssignments from './admin/pages/admin/users/TrainerAssignments';
import AdministratorsList from './admin/pages/admin/users/AdministratorsList';
import AdministratorForm from './admin/pages/admin/users/AdministratorForm';
import FilieresList from './admin/pages/admin/pedagogy/FilieresList';
import FiliereForm from './admin/pages/admin/pedagogy/FiliereForm';
import GroupesList from './admin/pages/admin/pedagogy/GroupesList';
import GroupeForm from './admin/pages/admin/pedagogy/GroupeForm';
import ModulesList from './admin/pages/admin/pedagogy/ModulesList';
import ModuleForm from './admin/pages/admin/pedagogy/ModuleForm';
import SallesList from './admin/pages/admin/salles/SallesList';
import SalleForm from './admin/pages/admin/salles/SalleForm';
import ScheduleEvents from './admin/pages/admin/schedule/ScheduleEvents';
import AbsencesList from './admin/pages/admin/schedule/AbsencesList';
import AbsenceForm from './admin/pages/admin/schedule/AbsenceForm';
import NotesList from './admin/pages/admin/schedule/NotesList';
import NoteForm from './admin/pages/admin/schedule/NoteForm';
import ResourcesList from './admin/pages/admin/resources/ResourcesList';
import ResourceForm from './admin/pages/admin/resources/ResourceForm';
import NewsList from './admin/pages/admin/news/NewsList';
import NewsForm from './admin/pages/admin/news/NewsForm';
import NewsDetail from './admin/pages/admin/news/NewsDetail';
import PublicNewsPage from './admin/pages/PublicNewsPage';
import PublicNewsDetail from './public_face/pages/PublicNewsDetail';
import NotificationsList from './admin/pages/admin/NotificationsList';
import Settings from './admin/pages/admin/Settings';
import AdminLogin from './public_face/pages/auth/AdminLogin';
import FormateurLogin from './public_face/pages/auth/FormateurLogin';
import StudentLogin from './public_face/pages/auth/StudentLogin';
import UserLogin from './public_face/pages/auth/UserLogin';
import PublicHome from './public_face/pages/Home';
import LoginChoice from './public_face/pages/LoginChoice';
import PublicLayout from './public_face/components/Layout/PublicLayout';

// Découvrez ISTA NTIC
import MotDuDirecteur from './public_face/pages/decouvrirNtic/MotDuDirecteur';
import PresentationHistorique from './public_face/pages/decouvrirNtic/PresentationHistorique';
import ReglementInterieur from './public_face/pages/decouvrirNtic/ReglementInterieur';
import NosPartenaires from './public_face/pages/decouvrirNtic/NosPartenaires';

// Filière Detail
import FilliereDetail from './public_face/pages/FilliereDetail';

// Admission
import ConditionAcces from './public_face/pages/admission/ConditionAcces';
import ResultatsAdmission from './public_face/pages/admission/ResultatsAdmission';
import ProcedureInscription from './public_face/pages/admission/ProcedureInscription';
import Bourse from './public_face/pages/admission/Bourse';

// Vie au Campus
import BDEClubs from './public_face/pages/vieAuCampus/bdeclubs';
import InternatRestauration from './public_face/pages/vieAuCampus/InternatRestauration';
import Galerie from './public_face/pages/vieAuCampus/Galerie';

// Contact
import Contact from './public_face/pages/contact/Contact';

// Legal & 404
import NotFound from './public_face/pages/NotFound';
import MentionsLegales from './public_face/pages/MentionsLegales';
import PolitiqueConfidentialite from './public_face/pages/PolitiqueConfidentialite';

import StudentDashboard from './student/pages/StudentDashboard';
import StudentProfile from './student/pages/StudentProfile';
import StudentDiscussions from './student/pages/StudentDiscussions';
import StudentResources from './student/pages/StudentResources';
import StudentSchedule from './student/pages/StudentSchedule';
import StudentNotes from './student/pages/StudentNotes';
import StudentAttendance from './student/pages/StudentAttendance';
import StudentNotifications from './student/pages/StudentNotifications';

import FormateurDashboard from './formateur/pages/FormateurDashboard';
import FormateurProfile from './formateur/pages/FormateurProfile';
import FormateurClasses from './formateur/pages/FormateurClasses';
import FormateurStudents from './formateur/pages/FormateurStudents';
import FormateurAttendance from './formateur/pages/FormateurAttendance';
import FormateurSchedule from './formateur/pages/FormateurSchedule';
import FormateurResources from './formateur/pages/FormateurResources';
import FormateurDiscussions from './formateur/pages/FormateurDiscussions';
import FormateurNotesList from './formateur/pages/FormateurNotesList';
import FormateurNoteForm from './formateur/pages/FormateurNoteForm';

import ScrollToTop from './core/components/ui/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/formateur/login" element={<FormateurLogin />} />
            <Route path="/etudiant/login" element={<StudentLogin />} />

            {/* Public routes wrapped in PublicLayout */}
            <Route element={<PublicLayout />}>
              <Route path="/news" element={<PublicNewsPage />} />
              <Route path="/news/:id" element={<PublicNewsDetail />} />
              <Route path="/choix-compte" element={<LoginChoice />} />
              <Route path="/filiere/:id" element={<FilliereDetail />} />
              <Route path="/mot-du-directeur" element={<MotDuDirecteur />} />
              <Route path="/presentation-historique" element={<PresentationHistorique />} />
              <Route path="/reglement-interieur" element={<ReglementInterieur />} />
              <Route path="/nos-partenaires" element={<NosPartenaires />} />
              <Route path="/condition-acces" element={<ConditionAcces />} />
              <Route path="/resultats-admission" element={<ResultatsAdmission />} />
              <Route path="/procedure-inscription" element={<ProcedureInscription />} />
              <Route path="/bourse" element={<Bourse />} />
              <Route path="/bdeclubs" element={<BDEClubs />} />
              <Route path="/internat-restauration" element={<InternatRestauration />} />
              <Route path="/galerie" element={<Galerie />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
            </Route>

            {/* Public Home */}
            <Route path="/" element={<PublicHome />} />

            {/* Student Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute requiredRole="etudiant">
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<StudentDashboard />} />
              <Route path="profil" element={<StudentProfile />} />
              <Route path="discussions" element={<StudentDiscussions />} />
              <Route path="ressources" element={<StudentResources />} />
              <Route path="emploi-du-temps" element={<StudentSchedule />} />
              <Route path="notes" element={<StudentNotes />} />
              <Route path="assiduite" element={<StudentAttendance />} />
              <Route path="notifications" element={<StudentNotifications />} />
            </Route>

            {/* Formateur Routes */}
            <Route
              path="/formateur"
              element={
                <ProtectedRoute requiredRole="formateur">
                  <FormateurLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<FormateurDashboard />} />
              <Route path="profile" element={<FormateurProfile />} />
              <Route path="classes" element={<FormateurClasses />} />
              <Route path="students" element={<FormateurStudents />} />
              <Route path="emploi-du-temps" element={<FormateurSchedule />} />
              <Route path="attendance" element={<FormateurAttendance />} />
              <Route path="resources" element={<FormateurResources />} />
              <Route path="discussions" element={<FormateurDiscussions />} />
              <Route path="notes" element={<FormateurNotesList />} />
              <Route path="notes/add" element={<FormateurNoteForm />} />
              <Route path="settings" element={<FormateurProfile />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="students" element={<StudentsList />} />
              <Route path="students/add" element={<StudentForm />} />
              <Route path="students/edit/:id" element={<StudentForm />} />
              <Route path="trainers" element={<TrainersList />} />
              <Route path="trainers/add" element={<TrainerForm />} />
              <Route path="trainers/edit/:id" element={<TrainerForm />} />
              <Route path="trainers/:id/assignments" element={<TrainerAssignments />} />
              <Route path="administrators" element={<AdministratorsList />} />
              <Route path="administrators/add" element={<AdministratorForm />} />
              <Route path="administrators/edit/:id" element={<AdministratorForm />} />
              <Route path="filieres" element={<FilieresList />} />
              <Route path="filieres/add" element={<FiliereForm />} />
              <Route path="filieres/edit/:id" element={<FiliereForm />} />
              <Route path="groupes" element={<GroupesList />} />
              <Route path="groupes/add" element={<GroupeForm />} />
              <Route path="groupes/edit/:id" element={<GroupeForm />} />
              <Route path="modules" element={<ModulesList />} />
              <Route path="modules/add" element={<ModuleForm />} />
              <Route path="modules/edit/:id" element={<ModuleForm />} />
              <Route path="salles" element={<SallesList />} />
              <Route path="salles/add" element={<SalleForm />} />
              <Route path="salles/edit/:id" element={<SalleForm />} />

              <Route path="schedule" element={<ScheduleEvents />} />
              <Route path="absences/students" element={<AbsencesList role="etudiant" />} />
              <Route path="absences/students/add" element={<AbsenceForm role="etudiant" />} />
              <Route path="absences/students/edit/:id" element={<AbsenceForm role="etudiant" />} />
              <Route path="absences/trainers" element={<AbsencesList role="formateur" />} />
              <Route path="absences/trainers/add" element={<AbsenceForm role="formateur" />} />
              <Route path="absences/trainers/edit/:id" element={<AbsenceForm role="formateur" />} />
              <Route path="notes" element={<NotesList />} />
              <Route path="notes/add" element={<NoteForm />} />
              <Route path="notes/edit/:id" element={<NoteForm />} />
              <Route path="resources" element={<ResourcesList />} />
              <Route path="resources/add" element={<ResourceForm />} />
              <Route path="resources/edit/:id" element={<ResourceForm />} />
              <Route path="news" element={<NewsList />} />
              <Route path="news/add" element={<NewsForm />} />
              <Route path="news/:id" element={<NewsDetail />} />
              <Route path="news/:id/edit" element={<NewsForm />} />
              <Route path="notifications" element={<NotificationsList />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* 404 Catch-all (Must be last) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;