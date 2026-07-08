import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "../Navbar";
import SmoothScroll from "../animations/SmoothScroll";
import Footer from "../footer/Footer";

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

export default function PublicLayout() {
    return (
        <SmoothScroll>
            <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <ScrollProgress />
                <Navbar />
                
                <main style={{ paddingTop: '120px', flex: 1 }}>
                    <Outlet />
                </main>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1]
                        }
                    }}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <Footer />
                </motion.div>
            </div>
        </SmoothScroll>
    );
}
