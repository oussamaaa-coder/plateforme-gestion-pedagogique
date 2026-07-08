import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "../components/Navbar";
import StatsSection from "../components/counter/StatsSection";
import Carousel from "../components/carousel/Carousel3D";
import Filliere from "../components/filiere/Filliere";
import Actualite from "../components/actualite/actualité";
import Etudiant from "../components/etudiant/etudiant.jsx";
import SmoothScroll from "../components/animations/SmoothScroll";
import Background3D from "../components/animations/Background3D";
import FAQ from "../components/faq/FAQ";
import DigitalSpace from "../components/digital_space/DigitalSpace";
import Footer from "../components/footer/Footer";
import ScrollToTop from "../components/animations/ScrollToTop";
import "../assets/css/GrainOverlay.css";

const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
        }
    },
    viewport: { once: true, amount: 0.2 }
};

const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            style={{
                scaleX,
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: "#0d2744",
                transformOrigin: "0%",
                zIndex: 1000
            }}
        />
    );
};

function Home() {
    return (
        <SmoothScroll>
            <div style={{ position: "relative", minHeight: "100vh" }}>
                <Background3D />
                <div className="grain-overlay" />
                <ScrollProgress />
                <Navbar />

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <Carousel height="90vh" />
                </motion.div>

                <motion.div {...fadeInUp}>
                    <StatsSection />
                </motion.div>

                <motion.div {...fadeInUp}>
                    <Filliere />
                </motion.div>

                <motion.div {...fadeInUp}>
                    <Actualite />
                </motion.div>

                <motion.div {...fadeInUp}>
                    <Etudiant />
                </motion.div>

                <motion.div {...fadeInUp}>
                    <DigitalSpace />
                </motion.div>

                <motion.div {...fadeInUp}>
                    <FAQ />
                </motion.div>

                <motion.div {...fadeInUp}>
                    <Footer />
                </motion.div>

                <ScrollToTop />
            </div>
        </SmoothScroll>
    )
}

export default Home