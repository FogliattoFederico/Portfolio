import {src, dest, watch, series} from 'gulp'
import * as dartSass from 'sass' 
import gulpSass from 'gulp-sass'

const sass = gulpSass(dartSass)

// Funcion para leer el archivo scss y compilar a css
export function css(done){
    // USAR RETURN para manejar correctamente las promesas
    return src('src/scss/app.scss')
        .pipe(sass({
            outputStyle: 'compressed'  // Para producción
        }).on('error', function(err) {
            console.error('❌ Error en SASS:', err.message);
            console.error('📁 Archivo:', err.file);
            console.error('📝 Línea:', err.line);
            // Terminar el proceso con error
            process.exit(1);
        }))
        .pipe(dest('build/css'))
        .on('end', () => {
            console.log('✅ CSS compilado exitosamente en build/css/');
            done();
        });
}

// funcion para js
export function js(done){
    // USAR RETURN para manejar correctamente las promesas
    return src('src/js/*.js')
        .pipe(dest('build/js'))
        .on('end', () => {
            console.log('✅ JS copiado exitosamente en build/js/');
            done();
        });
}

// Funcion para utilizar watch con gulp (SOLO desarrollo)
export function dev(){
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', js);
    console.log('👀 Modo desarrollo activado - Observando cambios...');
}

// Función para limpiar la carpeta build
export function clean(done) {
    const fs = require('fs');
    if (fs.existsSync('build')) {
        fs.rmSync('build', { recursive: true, force: true });
        console.log('🧹 Carpeta build eliminada');
    }
    done();
}

// TAREA BUILD PARA NETLIFY - Limpia y luego construye
export const build = series(clean, js, css);

// Tarea para verificar que todo esté bien
export function verify(done) {
    const fs = require('fs');
    console.log('🔍 Verificando estructura...');
    
    if (!fs.existsSync('src/scss/app.scss')) {
        console.error('❌ No se encuentra src/scss/app.scss');
        process.exit(1);
    }
    
    if (fs.existsSync('build')) {
        console.log('✅ Carpeta build existe');
        console.log('📁 Contenido:', fs.readdirSync('build'));
    }
    
    done();
}

// Build completo con verificación
export const netlifyBuild = series(clean, js, css, verify);

// Tarea por defecto (con watch para desarrollo local)
export default series(js, css, dev);