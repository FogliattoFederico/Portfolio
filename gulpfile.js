import { src, dest, watch, series, parallel } from "gulp";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import fs from "fs";

const sass = gulpSass(dartSass);

// 1. TAREA PARA COPIAR IMÁGENES (desde src/img/ → build/img/)
export function images(done) {
  return src("src/img/**/*", {
    base: "src",
    encoding: false  // ✅ evita que Gulp trate los binarios como texto
  })
    .pipe(dest("build"))
    .on("data", (file) => {
      console.log(`🖼️  Copiando: ${file.relative}`);
    })
    .on("end", () => {
      console.log("✅ Imágenes copiadas de src/img/ a build/img/");
      done();
    });
}

// 2. TAREA PARA COPIAR HTML (desde raíz → build/)
export function html(done) {
  return src(["*.html", "!node_modules/**/*"])
    .pipe(dest("build"))
    .on("end", () => {
      console.log("✅ HTML copiado a build/");
      done();
    });
}

// 3. TAREA PARA CSS (compila SASS → build/css/)
export function css(done) {
  return src("src/scss/app.scss")
    .pipe(
      sass({
        outputStyle: "compressed",
      }).on("error", function (err) {
        console.error("❌ Error en SASS:", err.message);
        console.error("📁 Archivo:", err.file);
        console.error("📝 Línea:", err.line);
        process.exit(1);
      })
    )
    .pipe(dest("build/css"))
    .on("end", () => {
      console.log("✅ CSS compilado en build/css/");
      done();
    });
}

// 4. TAREA PARA JS (desde src/js/ → build/js/)
export function js(done) {
  return src("src/js/*.js")
    .pipe(dest("build/js"))
    .on("end", () => {
      console.log("✅ JS copiado en build/js/");
      done();
    });
}

// 5. ✅ NUEVO: TAREA PARA COPIAR EL CV (desde src/cv/ → build/cv/)
export function cv(done) {
  return src("src/cv/**/*", {
    base: "src",
    allowEmpty: true,
    encoding: false  // ✅ evita que Gulp corrompa el PDF
  })
    .pipe(dest("build"))
    .on("end", () => {
      console.log("✅ CV copiado en build/cv/");
      done();
    });
}

// 6. TAREA PARA ARCHIVOS EXTRA (favicon, etc.)
export function extras(done) {
  return src(
    ["favicon.ico", "*.txt", "*.json", "!package.json", "!package-lock.json"],
    {
      base: ".",
      allowEmpty: true,
    }
  )
    .pipe(dest("build"))
    .on("end", () => {
      console.log("✅ Archivos extra copiados");
      done();
    });
}

// 7. LIMPIAR carpeta build/
export function clean(done) {
  if (fs.existsSync("build")) {
    fs.rmSync("build", { recursive: true, force: true });
    console.log("🧹 Carpeta build eliminada");
  }
  done();
}

// 8. VERIFICACIÓN DETALLADA
export function verify(done) {
  console.log("\n🔍 VERIFICANDO ESTRUCTURA DEL BUILD:");
  console.log("=".repeat(50));

  if (fs.existsSync("build")) {
    const listDir = (dir, indent = "") => {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      items.forEach((item) => {
        const icon = item.isDirectory() ? "📁" : "📄";
        console.log(`${indent}${icon} ${item.name}`);
        if (item.isDirectory() && !item.name.includes("node_modules")) {
          listDir(`${dir}/${item.name}`, indent + "  ");
        }
      });
    };

    listDir("build");

    console.log("\n📋 VERIFICACIÓN DE ARCHIVOS CRÍTICOS:");
    console.log("-".repeat(50));

    const criticalFiles = [
      { path: "build/index.html", type: "HTML principal" },
      { path: "build/css/app.css", type: "CSS compilado" },
      { path: "build/img/", type: "Carpeta de imágenes" },
      { path: "build/js/", type: "Carpeta de JS" },
      { path: "build/cv/", type: "Carpeta del CV" }, // ✅ nuevo
    ];

    criticalFiles.forEach((file) => {
      const exists = fs.existsSync(file.path);
      const icon = exists ? "✅" : "❌";
      const status = exists ? "ENCONTRADO" : "NO ENCONTRADO";
      console.log(`${icon} ${file.type}: ${status} (${file.path})`);

      if (exists && fs.statSync(file.path).isDirectory()) {
        const files = fs.readdirSync(file.path);
        console.log(`   📦 Contiene: ${files.length} archivos`);
        if (files.length > 0 && file.path.includes("img")) {
          console.log(
            `   🖼️  Imágenes: ${files.slice(0, 5).join(", ")}${files.length > 5 ? "..." : ""}`
          );
        }
      }
    });

    if (fs.existsSync("build/index.html")) {
      console.log("\n🔗 ANALIZANDO RUTAS EN HTML:");
      console.log("-".repeat(50));
      const htmlContent = fs.readFileSync("build/index.html", "utf8");

      const imgRegex =
        /src\s*=\s*["']([^"']*\.(jpg|jpeg|png|gif|svg|webp|ico))["']/gi;
      let match;
      const imagesFound = [];

      while ((match = imgRegex.exec(htmlContent)) !== null) {
        imagesFound.push(match[1]);
      }

      if (imagesFound.length > 0) {
        console.log(
          `🖼️  Se encontraron ${imagesFound.length} imágenes referenciadas:`
        );
        imagesFound.forEach((img) => {
          const exists = fs.existsSync(`build/${img.replace(/^\//, "")}`);
          const icon = exists ? "✅" : "❌";
          console.log(`   ${icon} ${img}`);
        });
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  done();
}

// 9. WATCH — observa cambios en desarrollo
export function dev() {
  watch("*.html", html);
  watch("src/scss/**/*.scss", css);
  watch("src/js/**/*.js", js);
  watch("src/img/**/*", images);
  watch("src/cv/**/*", cv); // ✅ nuevo
  console.log("👀 Observando cambios en archivos...");
}

// 10. TAREAS DE BUILD
export const build = series(
  clean,
  parallel(html, images, extras, js, css, cv), // ✅ cv agregado
  verify
);

export const netlifyBuild = series(
  clean,
  parallel(html, images, extras, js, css, cv), // ✅ cv agregado
  verify
);

export default series(
  clean,
  parallel(html, images, extras, js, css, cv), // ✅ cv agregado
  dev
);