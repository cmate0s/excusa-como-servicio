# excusa-como-servicio

Cuando falla el CI, esta GitHub Action lee el log, detecta qué tipo de fallo es y comenta en el PR una excusa a medida. Después puede cerrarlo como "no reproducible".

No es una excusa al azar: se elige según el error (null, timeout, merge, dependencias, producción, tests flaky...) y cita el test, el archivo y el autor reales.

## Ejemplo

```
### 🧾 Informe de incidencia (null)

> El objeto es null porque decidió no existir. Respetamos su decisión y recomendamos no seguir investigando.

Estado: no reproducible.
```

## Uso

```yaml
- name: Tests
  run: npm test 2>&1 | tee test.log

- name: Excusa si falla
  if: failure()
  uses: cmate0s/excusa-como-servicio@main
  with:
    log-file: test.log
    cerrar-pr: "false"
```

Necesita `permissions: pull-requests: write`.

## Categorías

`null`, `timeout`, `merge`, `dependencias`, `produccion`, `flaky`, `tests`, `generico`.

Las excusas están en `excusas.json`. Admite `{author}`, `{test}` y `{file}`. Los PR con más humor negro son bienvenidos; los que insultan a personas, no.

## Probar en local

```bash
node excusa.js test.log --author=mate0s
node excusa.js "" --categoria=produccion
```

## Aviso

Sirve para quedar bien delante del equipo, no para arreglar nada. Si cierras PRs reales con `cerrar-pr: "true"`, la responsabilidad es tuya y de tu empleador.

---

🎬 Más caos en [YouTube @mate0s-dev91](https://youtube.com/@mate0s-dev91)
