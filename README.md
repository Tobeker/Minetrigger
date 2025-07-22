# Minetrigger

Minesweeper2.0

## Building

Install dependencies and compile the TypeScript sources to the `dist` folder:

```bash
npm install
npm run build
```

## Running with Capacitor

After building the web app you can synchronize and open the native projects:

```bash
npx cap sync
npx cap open android   # or npx cap open ios
```

The native projects are generated in the `android` and `ios` folders.
