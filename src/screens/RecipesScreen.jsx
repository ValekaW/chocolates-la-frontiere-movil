import { useState } from 'react';
import { useData } from '../state/DataContext.jsx';
import { assetUrl } from '../config.js';

export default function RecipesScreen() {
  const { db } = useData();
  const recipes = db.recipes;
  const [index, setIndex] = useState(0);

  if (recipes.length === 0) return <p className="status">Aún no hay recetas.</p>;

  const recipe = recipes[index];
  // Da la vuelta al llegar al inicio o al final
  const go = (step) => setIndex((i) => (i + step + recipes.length) % recipes.length);

  return (
    <div className="page">
      <div className="recipe-hero">
        {recipe.image ? <img src={assetUrl(recipe.image)} alt={recipe.title} /> : <span aria-hidden="true">🥣</span>}
      </div>
      <div className="row row--between">
        <button className="btn btn--ghost" onClick={() => go(-1)} aria-label="Receta anterior">‹ Anterior</button>
        <span className="hint">{index + 1} / {recipes.length}</span>
        <button className="btn btn--ghost" onClick={() => go(1)} aria-label="Receta siguiente">Siguiente ›</button>
      </div>

      <h1 className="page-title">{recipe.title}</h1>
      <p className="hint">{recipe.time} · {recipe.servings} porciones</p>

      <h2>Ingredientes</h2>
      <ul className="bullets">
        {recipe.ingredients.map((x) => <li key={x}>{x}</li>)}
      </ul>

      <h2>Preparación</h2>
      <ol className="steps">
        {recipe.steps.map((x) => <li key={x}>{x}</li>)}
      </ol>
    </div>
  );
}
