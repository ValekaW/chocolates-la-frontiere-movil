// Prepara todo para Android y abre Android Studio:  npm run android
//   1. crea la carpeta android/ si todavía no existe
//   2. compila la app y la copia al proyecto Android
//   3. genera el ícono y la pantalla de inicio con el logotipo
//   4. abre Android Studio (ahí: Build → Build App Bundle(s) / APK(s) → Build APK(s))
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const run = (cmd) => {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
};

if (!existsSync('android')) run('npx cap add android');
run('npm run cap:sync');
run('npm run cap:assets');
run('npx cap open android');
