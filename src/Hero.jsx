import { Link } from "react-router-dom";
import { FiFileText, FiPlayCircle, FiDownload, FiArrowRight } from "react-icons/fi";

const Hero = () => {
  return (
    <section
      id="hero"
      className="min-h-screen relative bg-gradient-to-br from-green-50 to-green-100 overflow-hidden"
    >
      {/* Formes décoratives */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-64 bg-green-400/10 -skew-y-6"></div>
        <div className="absolute bottom-0 left-0 w-full h-64 bg-emerald-400/10 skew-y-6"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-300/20 rounded-full"></div>
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-32 h-screen bg-gradient-to-t from-green-600/5 to-transparent"></div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-6 py-16 lg:py-32 flex items-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Colonne de gauche: texte principal */}
          <div className="space-y-8">
            <div className="inline-block px-6 py-3 bg-green-100 border-l-4 border-green-600 text-green-800 text-sm font-medium">
              Algorithme de Métaheuristique
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 leading-tight">
              <span className="relative inline-block">
                Programmation Génétique pour la régression symbolique
                <span className="absolute bottom-0 left-0 w-full h-2 bg-green-500/40"></span>
              </span>
            </h1>
            
            <p className="text-lg text-green-700 max-w-lg">
              La Programmation Génétique (GP) comme méthode de métaheuristique pour résoudre des problèmes de régression symbolique.
            </p>
            
            {/* Boutons principaux */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="rapport_code.pdf"
                download="rapport_code.pdf"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-700 text-white font-medium hover:bg-green-600 transition-all duration-300 shadow-lg"
              >
                <FiFileText className="text-xl" />
                Découvrir le code
              </a>
              <Link
                to="/demo"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-green-700 font-medium border border-green-300 hover:bg-green-50 transition-all duration-300 shadow-md"
              >
                <FiPlayCircle className="text-xl" />
                Voir la démo
              </Link>
            </div>
          </div>
          
          {/* Colonne de droite: carte d'information */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-green-600 px-6 py-4 text-white">
              <h2 className="text-xl font-bold">Ressources disponibles</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Liste des ressources */}
              <div className="space-y-4">
                
                <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                  <div className="p-2 bg-green-100 rounded-lg text-green-700">
                    <FiPlayCircle className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800">Démonstration interactive</h3>
                    <p className="text-sm text-green-600">Visualisation des étapes de l'algorithme en temps réel</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                  <div className="p-2 bg-green-100 rounded-lg text-green-700">
                    <FiDownload className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800">Rapport détaillé</h3>
                    <p className="text-sm text-green-600">Analyse complète et résultats expérimentaux</p>
                  </div>
                </div>
              </div>
              
              {/* Téléchargement du rapport */}
              <div className="pt-4 border-t border-green-100">
                <a
                  href="rapport.pdf"
                  download="rapport_khadija_jamai.pdf"
                  className="flex items-center justify-between w-full px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-500 transition-all duration-300"
                >
                  <span>Télécharger le rapport complet</span>
                  <FiArrowRight className="text-xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer avec auteur */}
      <div className="absolute bottom-0 left-0 w-full bg-green-800/90 text-white py-4 z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-lg font-medium">Réalisé par : <span className="font-semibold uppercase">Khadija Jamai</span></p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <p className="text-lg font-medium">Encadré par : <span className="font-semibold uppercase">MR.ANTER Samir</span></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
