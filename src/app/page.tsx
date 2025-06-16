'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopNavigation from '@/components/layout/TopNavigation';
import { Modal } from '@/components/ui/Modal';
import { 
  Wrench, 
  Activity,
  Phone,
  Mail,
  MapPin,
  Star,
  ArrowRight,
  Zap,
  Shield,
  Clock
} from 'lucide-react';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-omega-50">
      {/* Top Navigation */}
      <TopNavigation onOpenModal={() => setIsModalOpen(true)} />

      {/* Main Content with padding for fixed header */}
      <main className="pt-16">
        {/* HOME Section */}
        <section id="home" className="min-h-screen flex items-center justify-center py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-12">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                Bienvenido a{' '}
                <span className="bg-gradient-to-r from-omega-600 to-blue-600 bg-clip-text text-transparent">
                  OmegaElectronics
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8">
                Sistema completo de gestión para talleres de reparación electrónica. 
                Administra clientes, equipos, órdenes de trabajo y más desde una sola plataforma.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <div className="text-3xl font-bold text-omega-600 mb-2">500+</div>
                  <div className="text-gray-600">Equipos Reparados</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                  <div className="text-gray-600">Satisfacción Cliente</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                  <div className="text-gray-600">Soporte Técnico</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-omega-500 to-blue-600 text-white rounded-xl font-semibold hover:from-omega-600 hover:to-blue-700 transition-all shadow-lg flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Comenzar Ahora</span>
                </button>
                <Link 
                  href="/dashboard"
                  className="px-8 py-4 border-2 border-omega-500 text-omega-600 rounded-xl font-semibold hover:bg-omega-50 transition-all flex items-center space-x-2"
                >
                  <Activity className="w-5 h-5" />
                  <span>Ir al Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICIOS Section */}
        <section id="servicios" className="min-h-screen flex items-center py-20 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Nuestros Servicios
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ofrecemos soluciones completas para la reparación y mantenimiento de equipos electrónicos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ServiceCard
                icon={<Wrench className="w-12 h-12" />}
                title="Reparación de Equipos"
                description="Diagnóstico y reparación especializada de dispositivos electrónicos con garantía de calidad"
                features={["Diagnóstico gratuito", "Repuestos originales", "Garantía 6 meses"]}
                color="from-blue-500 to-blue-600"
              />
              <ServiceCard
                icon={<Shield className="w-12 h-12" />}
                title="Mantenimiento Preventivo"
                description="Servicios de mantenimiento programado para extender la vida útil de tus equipos"
                features={["Limpieza profunda", "Actualización software", "Revisión completa"]}
                color="from-green-500 to-green-600"
              />
              <ServiceCard
                icon={<Clock className="w-12 h-12" />}
                title="Soporte Técnico"
                description="Asistencia técnica especializada disponible cuando la necesites"
                features={["Soporte 24/7", "Consultoría técnica", "Capacitación"]}
                color="from-purple-500 to-purple-600"
              />
            </div>
          </div>
        </section>

        {/* PORTFOLIO Section */}
        <section id="portfolio" className="min-h-screen flex items-center py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Portfolio de Trabajos
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Algunos de nuestros trabajos más destacados en reparación de equipos electrónicos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <PortfolioCard
                image="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop"
                title="Reparación TV Samsung 65'"
                description="Reparación completa de placa principal y reemplazo de panel LED"
                category="Televisores"
              />
              <PortfolioCard
                image="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop"
                title="Equipos Industriales"
                description="Mantenimiento y reparación de equipos de control industrial"
                category="Industrial"
              />
              <PortfolioCard
                image="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop"
                title="Consolas Gaming"
                description="Reparación de PlayStation 5 y Xbox Series X"
                category="Gaming"
              />
            </div>
          </div>
        </section>

        {/* CONTACTO Section */}
        <section id="contacto" className="min-h-screen flex items-center py-20 bg-gradient-to-br from-gray-900 to-omega-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Contáctanos
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                ¿Tienes algún equipo que necesita reparación? Contáctanos y te ayudaremos
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">Envíanos un mensaje</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nombre"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-omega-500"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-omega-500"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Asunto"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-omega-500"
                  />
                  <textarea
                    rows={4}
                    placeholder="Mensaje"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-omega-500"
                  />
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-omega-500 to-blue-600 text-white rounded-lg font-semibold hover:from-omega-600 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Enviar Mensaje</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Información de Contacto</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-omega-500 rounded-lg flex items-center justify-center">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-semibold">Teléfono</div>
                        <div className="text-gray-300">+54 11 1234-5678</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-omega-500 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-semibold">Email</div>
                        <div className="text-gray-300">info@omegaelectronics.com</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-omega-500 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-semibold">Dirección</div>
                        <div className="text-gray-300">Av. Corrientes 1234, CABA</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h4 className="font-semibold mb-4">Horarios de Atención</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>Lunes - Viernes</span>
                      <span>9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sábados</span>
                      <span>9:00 - 14:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Domingos</span>
                      <span>Cerrado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Modal de Prueba - OmegaElectronics"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Este es un modal de prueba para demostrar la funcionalidad. 
            Puedes cerrarlo haciendo clic en la X, presionando Escape, o haciendo clic fuera del modal.
          </p>
          
          <div className="bg-gradient-to-r from-omega-50 to-blue-50 p-4 rounded-lg border border-omega-200">
            <h4 className="font-semibold text-omega-800 mb-2">Características del Modal:</h4>
            <ul className="text-sm text-omega-700 space-y-1">
              <li>• Animaciones suaves de entrada y salida</li>
              <li>• Cierre con tecla Escape</li>
              <li>• Cierre haciendo clic en el backdrop</li>
              <li>• Diferentes tamaños (sm, md, lg, xl)</li>
              <li>• Responsive y accesible</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ServiceCard({ 
  icon, 
  title, 
  description, 
  features,
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  features: string[];
  color: string; 
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center text-white mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PortfolioCard({ 
  image, 
  title, 
  description, 
  category 
}: { 
  image: string; 
  title: string; 
  description: string; 
  category: string; 
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-omega-500 text-white text-xs font-semibold rounded-full">
            {category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}
