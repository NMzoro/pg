import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Code, Terminal, FileText, Play, Settings, User, Menu, X, ChevronDown, Maximize2, GitBranch, BarChart, Info, AlertCircle } from 'lucide-react';

// Toast Component personnalisé (comme React-Toastify)
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'info' ? 'bg-blue-500' : type === 'success' ? 'bg-green-500' : 'bg-red-500';
  
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-3 rounded shadow-lg ${bgColor} text-white min-w-64 max-w-md`}>
      {type === 'info' && <Info className="w-5 h-5 mr-2" />}
      {type === 'success' && <Play className="w-5 h-5 mr-2" />}
      {type === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
      <div className="flex-1">{message}</div>
      <button onClick={onClose} className="ml-3">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const App = () => {
  const [code, setCode] = useState(`import numpy as np
import matplotlib.pyplot as plt
import random
import operator
# -----------------------------
# 1. Définition des primitives
# -----------------------------
PRIMITIVES = {
'add': (operator.add, 2),
'sub': (operator.sub, 2),
'mul': (operator.mul, 2),
'neg': (operator.neg, 1)
}
TERMINALS = ['x'] + [random.randint(-3, 3) for _ in range(5)]
# -----------------------------
# 2. Générer un arbre aléatoire
# -----------------------------
def generate_random_tree(depth):
if depth == 0 or (depth < 3 and random.random() < 0.3):
return random.choice(TERMINALS)
func_name = random.choice(list(PRIMITIVES.keys()))
_, arity = PRIMITIVES[func_name]
return [func_name] + [generate_random_tree(depth - 1) for _ in range(arity)]
# -----------------------------
# 3. Évaluer un arbre
# -----------------------------
def evaluate_tree(tree, x):
if isinstance(tree, (int, float)):
return tree
elif tree == 'x':
return x
else:
func_name = tree[0]
func, arity = PRIMITIVES[func_name]
args = [evaluate_tree(subtree, x) for subtree in tree[1:]]
try:
return func(*args)
except:
return 0 # Gérer les erreurs d'exécution
# -----------------------------
# 4. Fonction de fitness (MSE)
# -----------------------------
def fitness(tree, X, Y):
try:
y_pred = np.array([evaluate_tree(tree, x) for x in X])
return np.mean((y_pred - Y)**2)
except:
return float('inf')
# -----------------------------
# 5. Mutation et croisement
# -----------------------------
def mutate(tree, depth=3):
if isinstance(tree, list) and random.random() < 0.2:
return generate_random_tree(depth)
elif isinstance(tree, list):
return [tree[0]] + [mutate(sub, depth-1) for sub in tree[1:]]
else:
return tree
def crossover(t1, t2):
return random.choice([t1, t2]) # Simplifié
# -----------------------------
# 6. Données cibles
# -----------------------------
X = np.linspace(-10, 10, 100)
Y = X**2 + 2*X + 1 # Fonction cible
# -----------------------------
# 7. Boucle de programmation génétique
# -----------------------------
POP_SIZE = 50
N_GEN = 30
best_fitness_history = []
population = [generate_random_tree(3) for _ in range(POP_SIZE)]
for gen in range(N_GEN):
scored = [(tree, fitness(tree, X, Y)) for tree in population]
scored.sort(key=lambda x: x[1])
best_fitness_history.append(scored[0][1])
print(f"Génération {gen+1}, Meilleure fitness : {scored[0][1]:.4f}")
new_population = [scored[0][0]] # Élitisme
while len(new_population) < POP_SIZE:
p1 = random.choice(scored[:10])[0]
p2 = random.choice(scored[:10])[0]
child = crossover(p1, p2)
child = mutate(child)
new_population.append(child)
population = new_population
# -----------------------------
# 8. Résultat final et graphiques
# -----------------------------
best_tree = scored[0][0]
y_pred = np.array([evaluate_tree(best_tree, x) for x in X])
plt.figure(figsize=(12, 5))
# Graphe 1 : fonction réelle vs approximation
plt.subplot(1, 2, 1)
plt.plot(X, Y, label="Vraie fonction f(x)", linewidth=2)
plt.plot(X, y_pred, label="Approximation GP", linestyle='--', color='orange', linewidth=2)
plt.title("Régression Symbolique par Programmation Génétique")
plt.xlabel("x")
plt.ylabel("f(x)")
plt.legend()
plt.grid(True)
# Graphe 2 : évolution de la fitness
plt.subplot(1, 2, 2)
plt.plot(best_fitness_history, color='blue', linewidth=2)
plt.title("Évolution de la fitness")
plt.xlabel("Génération")
plt.ylabel("Erreur quadratique moyenne")
plt.grid(True)
plt.tight_layout()
plt.show()
print("\\n Arbre final trouvé :", best_tree)`);
  
  const [activeTab, setActiveTab] = useState('main.py');
  const [terminalVisible, setTerminalVisible] = useState(true);
  const [graphData, setGraphData] = useState([]);
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [graphVisible, setGraphVisible] = useState(false);
  const [outputTab, setOutputTab] = useState('terminal');
  const [isExecuting, setIsExecuting] = useState(false);
  const [costHistory, setCostHistory] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  useEffect(() => {
    // Afficher le toast au chargement du composant
    setToast({
      show: true,
      message: "Bienvenue! Cliquez sur le bouton 'Exécuter' pour lancer l'analyse et afficher les graphiques.",
      type: 'info'
    });
    
    // Cacher le toast après 5 secondes
    const toastTimer = setTimeout(() => {
      setToast({ ...toast, show: false });
    }, 5000);
    
    return () => clearTimeout(toastTimer);
  }, []);

  useEffect(() => {
    if (isExecuting) {
      const timer = setTimeout(() => {
        setIsExecuting(false);
        setTerminalOutput([
          '> python main.py',
          'Exécution du script...',
          'Initialisation de la programmation génétique...',
          'Génération 1, Meilleure fitness : 851.1684',
          'Génération 2, Meilleure fitness : 851.1684',
          'Génération 3, Meilleure fitness : 43.0067',
          'Génération 4, Meilleure fitness : 35.0067',
          'Génération 5, Meilleure fitness : 35.0067',
          'Génération 10, Meilleure fitness : 16.0000',
          'Génération 15, Meilleure fitness : 1.0000',
          'Génération 20, Meilleure fitness : 1.0000',
          'Génération 25, Meilleure fitness : 1.0000',
          'Génération 30, Meilleure fitness : 1.0000',
          'Arbre final trouvé : [\'add\', [\'add\', [\'add\', \'x\', 0], [\'mul\', \'x\', \'x\']], \'x\']',
          '> Process finished with exit code 0'
        ]);
        setOutputTab('graphs');
        
        // Générer des données pour le graphique de régression symbolique
        const regressionData = [];
        for (let i = 0; i < 100; i++) {
          const x = i / 5 - 10;
          const y = x*x + 2*x + 1; // La vraie fonction
          const predicted = x*x + 2*x + 1; // Ce que notre modèle a trouvé
          regressionData.push({
            x: x,
            y: y,
            predicted: predicted
          });
        }
        setGraphData(regressionData);
        
        // Générer historique du coût pour la courbe d'apprentissage
        const costData = [
          { iteration: 1, cost: 851.1684 },
          { iteration: 2, cost: 851.1684 },
          { iteration: 3, cost: 43.0067 },
          { iteration: 4, cost: 35.0067 },
          { iteration: 5, cost: 35.0067 },
          { iteration: 6, cost: 35.0067 },
          { iteration: 7, cost: 35.0067 },
          { iteration: 8, cost: 16.0000 },
          { iteration: 9, cost: 16.0000 },
          { iteration: 10, cost: 16.0000 },
          { iteration: 11, cost: 1.0000 },
          { iteration: 12, cost: 1.0000 }
        ];
        
        // Compléter jusqu'à 30 générations
        for (let i = 13; i <= 30; i++) {
          costData.push({ iteration: i, cost: 1.0000 });
        }
        
        setCostHistory(costData);
        
        setGraphVisible(true);
        
        // Afficher un toast de succès
        setToast({
          show: true,
          message: "Exécution terminée avec succès! Les graphiques sont maintenant disponibles.",
          type: 'success'
        });
        
        // Cacher le toast après 3 secondes
        setTimeout(() => {
          setToast({ ...toast, show: false });
        }, 3000);
        
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isExecuting]);

  const handleRunCode = () => {
    setIsExecuting(true);
    setTerminalOutput([
      '> python main.py',
      'Exécution du script...',
      'Chargement des dépendances...'
    ]);
    setOutputTab('terminal');
    
    // Afficher un toast d'information
    setToast({
      show: true,
      message: "Exécution du code en cours...",
      type: 'info'
    });
  };

  // Modal de bienvenue
  const WelcomeModal = () => {
    if (!showWelcomeModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-400" />
              Bienvenue dans l'interface VS Code
            </h3>
            <button onClick={() => setShowWelcomeModal(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-6 text-gray-300">
            <p className="mb-4">Cette interface simule Visual Studio Code avec une implémentation de programmation génétique en Python.</p>
            <p className="mb-2">Pour commencer :</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Cliquez sur le bouton <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Exécuter</span> pour lancer l'analyse</li>
              <li>Observez l'exécution dans le terminal</li>
              <li>Visualisez les graphiques de résultats dans l'onglet "Graphiques"</li>
            </ul>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={() => setShowWelcomeModal(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Compris !
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-300 overflow-hidden">
      {/* Toast notification */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      )}
      
      {/* Modal de bienvenue */}
      <WelcomeModal />
      
      {/* Barre de titre */}
      <div className="flex items-center justify-between bg-gray-900 p-1 border-b border-gray-700">
        <div className="flex items-center">
          <Menu className="w-4 h-4 mx-2" />
          <div className="text-xs mr-4">Fichier</div>
          <div className="text-xs mr-4">Édition</div>
          <div className="text-xs mr-4">Sélection</div>
          <div className="text-xs mr-4">Affichage</div>
          <div className="text-xs mr-4">Aller</div>
          <div className="text-xs mr-4">Exécuter</div>
        </div>
        <div className="text-xs text-gray-400">main.py - Python - VS Code</div>
        <div className="flex">
          <Maximize2 className="w-4 h-4 mx-1" />
          <X className="w-4 h-4 mx-1" />
        </div>
      </div>

      {/* Zone principale */}
      <div className="flex flex-1 overflow-hidden">
        {/* Barre latérale */}
        <div className="flex">
          <div className="w-12 bg-gray-900 border-r border-gray-700 flex flex-col items-center py-2">
            <div className="py-2 border-l-2 border-blue-500">
              <FileText className="w-6 h-6" />
            </div>
            <div className="py-2">
              <GitBranch className="w-6 h-6" />
            </div>
            <div className="py-2">
              <Play className="w-6 h-6" />
            </div>
            <div className="py-2">
              <BarChart className="w-6 h-6" />
            </div>
            <div className="mt-auto py-2">
              <User className="w-6 h-6" />
            </div>
            <div className="py-2">
              <Settings className="w-6 h-6" />
            </div>
          </div>
          
          {/* Structure des fichiers */}
          <div className="w-48 bg-gray-800 border-r border-gray-700 overflow-y-auto">
            <div className="p-2 text-xs uppercase font-bold">Explorateur</div>
            <div className="px-2 py-1 flex items-center">
              <ChevronDown className="w-4 h-4 mr-1" />
              <span className="text-xs">PROJET PYTHON</span>
            </div>
            <div className="pl-4">
              <div className="px-2 py-1 text-xs bg-gray-700 rounded flex items-center">
                <FileText className="w-3 h-3 mr-2 text-blue-400" />
                main.py
              </div>
              <div className="px-2 py-1 text-xs flex items-center">
                <FileText className="w-3 h-3 mr-2 text-yellow-400" />
                requirements.txt
              </div>
              <div className="px-2 py-1 text-xs flex items-center">
                <FileText className="w-3 h-3 mr-2 text-green-400" />
                README.md
              </div>
            </div>
          </div>
        </div>

        {/* Zone d'édition et de sortie */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex bg-gray-800 border-b border-gray-700">
            <div className="px-3 py-1 bg-gray-900 text-xs flex items-center border-r border-gray-700">
              <FileText className="w-3 h-3 mr-2 text-blue-400" />
              main.py
              <X className="w-3 h-3 ml-2" />
            </div>
          </div>

          {/* Éditeur de code */}
          <div className="flex-1 overflow-auto bg-gray-900 relative">
            <div className="absolute top-2 right-2">
              <button 
                onClick={handleRunCode} 
                disabled={isExecuting}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
              >
                <Play className="w-3 h-3 mr-1" />
                {isExecuting ? 'Exécution...' : 'Exécuter'}
              </button>
            </div>
            <div className="font-mono text-sm p-4 whitespace-pre">
              <pre className="text-gray-300">{code}</pre>
            </div>
          </div>

          {/* Terminal et résultats */}
          {terminalVisible && (
            <div className="h-80 bg-gray-900 border-t border-gray-700 overflow-hidden flex flex-col">
              <div className="flex bg-gray-800 border-b border-gray-700">
                <div 
                  className={`px-3 py-1 text-xs flex items-center border-r border-gray-700 cursor-pointer ${outputTab === 'terminal' ? 'bg-gray-700' : 'bg-gray-800'}`}
                  onClick={() => setOutputTab('terminal')}
                >
                  <Terminal className="w-3 h-3 mr-2" />
                  Terminal
                </div>
                <div 
                  className={`px-3 py-1 text-xs flex items-center border-r border-gray-700 cursor-pointer ${outputTab === 'graphs' ? 'bg-gray-700' : 'bg-gray-800'}`}
                  onClick={() => outputTab === 'graphs' ? setOutputTab('terminal') : null}
                >
                  <BarChart className="w-3 h-3 mr-2" />
                  Graphiques
                </div>
                <div className="ml-auto px-1 py-1 flex items-center">
                  <X className="w-3 h-3" onClick={() => setTerminalVisible(false)} />
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden">
                {outputTab === 'terminal' && (
                  <div className="p-2 font-mono text-xs overflow-auto h-full">
                    <div className="text-green-400">$ python</div>
                    {terminalOutput.map((line, index) => (
                      <div key={index} className="text-gray-300">{line}</div>
                    ))}
                  </div>
                )}
                
                {outputTab === 'graphs' && graphVisible && (
                  <div className="flex flex-col p-2 h-full overflow-auto bg-gray-900">
                    <div className="flex mb-2 text-sm font-semibold">
                      <div className="mr-4 cursor-pointer border-b-2 border-blue-500">Régression Symbolique</div>
                      <div className="cursor-pointer">Courbe d'apprentissage</div>
                    </div>
                    
                    <div className="flex flex-wrap">
                      <div className="w-1/2 p-2 bg-white rounded">
                        <div className="text-xs font-bold text-gray-800 mb-1">Fonction vs Approximation</div>
                        <ResponsiveContainer width="100%" height={200}>
                          <ScatterChart margin={{ top: 5, right: 5, bottom: 20, left: 20 }}>
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            <XAxis type="number" dataKey="x" name="X" />
                            <YAxis type="number" dataKey="y" name="Y" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Legend />
                            <Scatter name="Vraie fonction" data={graphData} fill="#8884d8" />
                            <Line
                              type="monotone"
                              dataKey="predicted"
                              stroke="#ff7300"
                              name="Approximation GP"
                              dot={false}
                              data={graphData}
                            />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="w-1/2 p-2 bg-white rounded">
                        <div className="text-xs font-bold text-gray-800 mb-1">Évolution de la fitness</div>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={costHistory} margin={{ top: 5, right: 5, bottom: 20, left: 20 }}>
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            <XAxis type="number" dataKey="iteration" name="Génération" />
                            <YAxis type="number" name="Fitness" />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="cost"
                              stroke="#ff0000"
                              name="Erreur quadratique moyenne"
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="w-full p-3 mt-2 bg-gray-800 rounded text-xs">
                        <div className="font-bold mb-1">Résultats de la programmation génétique:</div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div>Fitness finale: <span className="text-green-400">1.0000</span></div>
                            <div>Générations: <span className="text-green-400">30</span></div>
                            <div>Taille de population: <span className="text-green-400">50</span></div>
                          </div>
                          <div>
                            <div>Expression trouvée: <span className="text-blue-400">x² + 2x + 1</span></div>
                            <div>Arbre: <span className="text-blue-400">['add', ['add', ['add', 'x', 0], ['mul', 'x', 'x']], 'x']</span></div>
                            <div>Précision: <span className="text-green-400">99.0%</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Barre d'état */}
      <div className="flex justify-between items-center px-2 py-1 text-xs bg-blue-600 text-white">
        <div className="flex items-center">
          <div className="mr-4 flex items-center">
            <Play className="w-3 h-3 mr-1" />
            <button onClick={handleRunCode} className="hover:underline" disabled={isExecuting}>
              {isExecuting ? 'Exécution...' : 'Exécuter'}
            </button>
          </div>
          <div>Python 3.9.0</div>
        </div>
        <div className="flex items-center">
          <div className="mx-4">UTF-8</div>
          <div className="mx-4">LF</div>
          <div>Ligne 1, Col 1</div>
        </div>
      </div>
    </div>
  );
};

export default App;