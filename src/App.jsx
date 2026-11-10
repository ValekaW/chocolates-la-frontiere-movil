import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { NavProvider, useNav } from './nav.jsx';
import { DataProvider, useData } from './state/DataContext.jsx';
import { AuthProvider } from './state/AuthContext.jsx';
import { CartProvider } from './state/CartContext.jsx';
import TabBar from './components/TabBar.jsx';
import TopBar from './components/TopBar.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import CatalogScreen from './screens/CatalogScreen.jsx';
import ProductScreen from './screens/ProductScreen.jsx';
import CartScreen from './screens/CartScreen.jsx';
import AccountScreen from './screens/AccountScreen.jsx';
import MoreScreen from './screens/MoreScreen.jsx';
import HistoryScreen from './screens/HistoryScreen.jsx';
import RecipesScreen from './screens/RecipesScreen.jsx';
import ContactScreen from './screens/ContactScreen.jsx';

const SCREENS = {
  home: HomeScreen,
  catalog: CatalogScreen,
  product: ProductScreen,
  cart: CartScreen,
  account: AccountScreen,
  more: MoreScreen,
  history: HistoryScreen,
  recipes: RecipesScreen,
  contact: ContactScreen,
};

const TITLES = {
  product: 'Producto',
  history: 'Nuestra historia',
  recipes: 'Recetario',
  contact: 'Contacto',
};

function Shell() {
  const nav = useNav();
  const { db } = useData();

  // Botón "atrás" de Android: cierra la pantalla abierta; en la pantalla principal sale de la app
  useEffect(() => {
    const handle = CapacitorApp.addListener('backButton', () => {
      if (nav.depth > 1) nav.back();
      else CapacitorApp.exitApp();
    });
    return () => {
      handle.then((h) => h.remove());
    };
  }, [nav]);

  const Screen = SCREENS[nav.current.name] ?? HomeScreen;
  const screenKey = `${nav.depth}-${nav.current.name}-${JSON.stringify(nav.current.params)}`;

  return (
    <div className="app">
      {nav.depth > 1 ? (
        <TopBar title={TITLES[nav.current.name] ?? ''} onBack={nav.back} />
      ) : (
        <header className="brandbar">
          <strong>{db.site.brand}</strong>
          <small>{db.site.tagline}</small>
        </header>
      )}

      <main className="screen" key={screenKey}>
        <Screen />
      </main>

      {nav.depth === 1 && <TabBar />}
    </div>
  );
}

function Gate() {
  const { db, error, reload } = useData();

  if (error) {
    return (
      <div className="status">
        <p>{error}</p>
        <button className="btn btn--gold" onClick={reload}>Reintentar</button>
      </div>
    );
  }
  if (!db) return <p className="status">Cargando…</p>;

  return (
    <AuthProvider>
      <CartProvider products={db.products}>
        <Shell />
      </CartProvider>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <NavProvider>
      <DataProvider>
        <Gate />
      </DataProvider>
    </NavProvider>
  );
}
