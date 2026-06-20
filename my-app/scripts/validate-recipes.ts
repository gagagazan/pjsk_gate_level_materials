import { UNITS } from '../lib/recipes'

for (const unit of UNITS) {
  if (unit.recipes.length !== 40) throw new Error(`${unit.id}: expected 40 recipes, got ${unit.recipes.length}`)
  for (let i = 0; i < 40; i++) {
    if (unit.recipes[i].level !== i + 1) throw new Error(`${unit.id}: recipe[${i}].level expected ${i + 1}`)
  }
}
console.log('All recipes validated')
