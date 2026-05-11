"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  return (
    <section id="contacto" className="py-24 bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0B2A5B 0%, #1a3f7a 50%, #2563EB 100%)",
          }}
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #10B981 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #60A5FA 0%, transparent 70%)" }} />

          <div className="relative p-12 lg:p-16 text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="text-xs font-medium text-white/80">Solicitudes abiertas hasta el 31 de mayo</span>
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
              ¿Listo para{" "}
              <span className="font-serif-editorial italic font-normal text-blue-300">
                postular?
              </span>
            </h2>
            <p className="text-lg text-white/60 max-w-lg mx-auto">
              Únete a más de 12,000 estudiantes que ya han dado el primer paso
              hacia una educación sin límites económicos.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/login">
                <Button
                  size="lg"
                  className="rounded-full bg-white text-[#0B2A5B] hover:bg-white/90 shadow-[0_8px_24px_rgba(0,0,0,0.2)] font-semibold px-8"
                >
                  Iniciar solicitud
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-white/30 text-white hover:bg-white/10 px-8"
              >
                Contactar asesor
              </Button>
            </div>

            <p className="text-xs text-white/40 pt-2">
              Oficina de Becas UCR · Teléfono: 2511-4567 · becas@ucr.ac.cr
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
